import { WebSocket } from "ws";
import {
  INIT_GAME,
  MOVE,
  GAME_ADDED,
  GAME_ALERT,
  EXIT_GAME,
  RECONNECTION,
  GAME_JOINED,
  CHAT,
  GAME_NOT_FOUND,
  JOINROOM,
  NOTIFICATION,
  UNDO_MOVE,
  UNDO_MOVE_APPROVE,
} from "./messages";
import { User } from ".";
import { connectionManager } from "./connectionManager";
import { Game } from "./Game";
import {
  deleteMovesfromDb,
  getGameFromDb,
  saveMessageInDb,
} from "./API_Routes";

export type NotifType = "MESSAGE" | "REQUEST" | "CHALLENGE" | "ACCEPT" | "";
export type GameType = "blitz" | "rapid" | "daily" | "PRIVATE";
type WaitingGame={gametype:GameType,gameId:string|null}

export class GameManager {
  private games: Game[]; //game is defined like games:type  where array of Room (where Room is a class name Game).... like x:number[] x is the array of number
  private waitingGame: WaitingGame[];
  private users: User[]; // users is a array of websockets

  constructor() {
    // as types are defined now variables initialization
    this.games = [];
    this.waitingGame = [{gametype:"blitz",gameId:null},{gametype:"rapid",gameId:null},{gametype:"daily",gameId:null}];
    this.users = [];
  }

  addUser(user: User) {
    //console.log();

    this.users.push(user); // just to count online users remove offline users and
    this.addHandler(user); //as soon as this trigger a eventListener is attached to the socket that listen to all message till connections is closed from frontend ...ws.close()
  }

  removeGame(gameId: string) {
    this.games = this.games.filter((game) => game.RoomId !== gameId);
  }

  removeUser(socket: WebSocket) {
    const user = this.users.find((user) => user.socket === socket);
    if (!user) {
      console.error("User not found?");
      return;
    }
    this.users = this.users.filter((user) => user.socket !== socket);
    connectionManager.removeUserRoomMap(user);
  }

  private async addHandler(user: User) {
    user.socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());
      const gameType=message.gameType as GameType;


      if (message.type === INIT_GAME) {
         const WaitingGame=this.waitingGame.find((gtype)=> gtype.gametype===gameType)
        if (!WaitingGame?.gameId) {

          const game = new Game(user.userId, null);
          this.games.push(game);

          if (!message.private&&WaitingGame) {
            WaitingGame.gameId = game.RoomId;
          }


          connectionManager.addUserRoomMap(user, game.RoomId);

          connectionManager.sendMessageToAll(
            game.RoomId,
            JSON.stringify({
              type: GAME_ADDED,
              gameId: game.RoomId,
              gameType:gameType,
              private:message.private
            })
          );
        } else {
          const waitingGame = this.games.find(
            (game) => game.RoomId === WaitingGame.gameId
          );
          if (!waitingGame) {
            console.error("Pending game not found?");
            return;
          }

          if (user.userId === waitingGame.player1Id) {
            user.socket.send(
              JSON.stringify({
                type: GAME_ALERT,
                payload: {
                  message: "Trying to Connect with yourself?",
                },
              })
            );
            connectionManager.sendMessageToAll(
              waitingGame.RoomId,
              JSON.stringify({
                type: GAME_ALERT,
                payload: {
                  message: "Trying to Connect with yourself?",
                },
              })
            );
            this.removeGame(WaitingGame.gameId);
            WaitingGame.gameId = null;
            return;
          }

          connectionManager.addUserRoomMap(user, waitingGame.RoomId);
          waitingGame.PushSecondPlayer(user,gameType);
          WaitingGame.gameId = null;
        }
      }

      if (message.type === MOVE) {
        const gameId = message.payload.gameId;
        const game = this.games.find((game) => game.RoomId === gameId); // it looks for that game where it can find the current game in Game array.. and make move in that
        if (game) {
          //console.log(message);
          game.makeMove(user, message.payload.move); //game take user and move and move using socket inside the user
        }
      }

      if (message.type === EXIT_GAME) {
        const gameId = message.payload.gameId;
        const game = this.games.find((game) => game.RoomId === gameId);

        if (game) {
          game.exitGame(user);
          this.removeGame(game.RoomId);
        }
      }

      if (message.type === RECONNECTION || message.type === JOINROOM) {
        const gameId = message.payload.roomId;

        const gameWS = this.games.find((game) => game.RoomId === gameId);

        if (user.userId === gameWS?.player1Id) {
            user.socket.send(
              JSON.stringify({
                type: GAME_ALERT,
                payload: {
                  message: "Trying to Connect with yourself?",
                },
              })
            );
            connectionManager.sendMessageToAll(
              gameWS?.RoomId,
              JSON.stringify({
                type: GAME_ALERT,
                payload: {
                  message: "Trying to Connect with yourself?",
                },
              })
            );
            this.removeGame(gameId);
            return;
          }

        if (gameWS && !gameWS.player2Id) {
          connectionManager.addUserRoomMap(user, gameId);
          await gameWS.PushSecondPlayer(user,gameType);
          return;
        }

        const gameDB = await getGameFromDb(gameId);
        //console.log("Game Recieved in Game Manager :", gameDB);

        if (!gameDB) {
          user.socket.send(
            JSON.stringify({
              type: GAME_NOT_FOUND,
            })
          );
          return;
        }

        if (!gameWS) {
          const game = new Game(
            gameDB.whitePlayerId,
            gameDB.blackPlayerId,
            gameDB.id
          );
          this.games.push(game);
        }

        user.socket.send(
          JSON.stringify({
            type: GAME_JOINED,
            payload: {
              RoomId: gameDB.id,
              WhitePlayer: gameDB.whitePlayer,
              BlackPlayer: gameDB.blackPlayer,
              moves: gameDB.moves,
              chat: gameDB.chat,
              fen: gameDB.currentFen,
            },
          })
        );
        connectionManager.addUserRoomMap(user, gameId);
      }

      if (message.type === CHAT) {
        const roomId = message.payload.roomId;
        const game = this.games.find((game) => game.RoomId === roomId);
        if (game) {
          await saveMessageInDb(roomId, message.payload.message);
          connectionManager.sendMessageToAll(
            roomId,
            JSON.stringify({
              type: CHAT,
              payload: {
                message: message.payload.message,
              },
            })
          );
        }
      }

      if (message.type === NOTIFICATION) {
        //console.log("notification recieved");

        const playerId = message.payload.playerId as string;
        const roomId = connectionManager.getPlayerIdToRoomId(user.userId);
        connectionManager.sendMessageToUser(
          playerId,
          JSON.stringify({
            type: NOTIFICATION,
            payload: {
              sender: user as User,
              notifType: message.payload.notifType as NotifType,
              message: message.payload.message as string,
              roomId: roomId,
            },
          })
        );
      }

      if (message.type === UNDO_MOVE) {
        //console.log("hello i triggred in undoMove");

        const gameId = message.payload.gameId as string;
        connectionManager.sendMessageToAll(
          gameId,
          JSON.stringify({
            type: UNDO_MOVE,
            payload: {
              requestingPlayerId: user.userId,
            },
          })
        );
      }

      if (message.type === UNDO_MOVE_APPROVE) {
        const choice = message.payload.choice as boolean;
        const roomId = message.payload.gameId as string;

        if (choice) {
          const color = message.payload.color as string;
          const game = this.games.find((game) => game.RoomId === roomId);
          if (game) {
            const turn = game.board.turn() == color;
            const moveCount = game.moveCount;
            const undoCount= turn ? 1 : 2;
            const lastmoveCount = moveCount - undoCount;

            //console.log(roomId);

            const gameDB = await getGameFromDb(roomId);
            console.log(
              "Game Recieved in Undo Approved :",
              gameDB
            );

            game?.board.load(gameDB.fenHistory[lastmoveCount]);

            connectionManager.sendMessageToAll(
              roomId,
              JSON.stringify({
                type: UNDO_MOVE_APPROVE,
                payload: {
                  revertedfen: gameDB.fenHistory[lastmoveCount],
                  moves:gameDB.moves
                },
              })
            );

           const updatedgame = await deleteMovesfromDb(
              roomId,
              undoCount,
              moveCount,
              gameDB.fenHistory[lastmoveCount]
            );
            game.moveCount=lastmoveCount
            console.log("Updatedgame after moves deleted :",updatedgame); 
          }
        } else {
          connectionManager.sendMessageToAll(
            roomId,
            JSON.stringify({
              type: UNDO_MOVE_APPROVE,
              payload: {
                choice: choice,
              },
            })
          );
        }
      }
    });
  }
}
