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
  REQUEST_DRAW,
  REQUEST_DRAW_APPROVE,
  GAME_OVER
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
type WaitingGame = { gametype: GameType; gameId: string | null };

export class GameManager {
  private games: Game[]; //game is defined like games:type  where array of Room (where Room is a class name Game).... like x:number[] x is the array of number
  private waitingGame: WaitingGame[];
  private users: User[]; // users is a array of websockets

  constructor() {
    // as types are defined now variables initialization
    this.games = [];
    this.waitingGame = [
      { gametype: "blitz", gameId: null },
      { gametype: "rapid", gameId: null },
      { gametype: "daily", gameId: null },
    ];
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
    /// if game never started remove game from game[] and empty waitingGame ids
    const waitingGameEntry = this.waitingGame.find((w) => w.gameId && this.games.find((g) =>g.RoomId === w.gameId && g.player1Id === user.userId && !g.player2Id));

    if (waitingGameEntry) {
      this.games = this.games.filter(
        (g) => g.RoomId !== waitingGameEntry.gameId
      );

      waitingGameEntry.gameId = null;

      console.log(`Removed stale waiting game for user ${user.userId}`);
    }
  }

  private async addHandler(user: User) {
    user.socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());
      const gameType = message.gameType as GameType;

           if (message.type === INIT_GAME) {

            //check if player already started a game and trying to add a new game 
        if (!message.private) {
          const alreadyWaitingPublic = this.waitingGame.some(w =>
            w.gameId &&
            this.games.find(
              g => g.RoomId === w.gameId && g.player1Id === user.userId
            )
          );
          if (alreadyWaitingPublic) {
            user.socket.send(JSON.stringify({
              type: GAME_ALERT,
              payload: { message: "You already have a public game waiting." }
            }));

            return;
          }
        }
         
        //check if player game started a private already and trying to add a new game 
        if (message.private) {
          const PrivateGame = this.games.find(
            g => g.isPrivate && g.player1Id === user.userId && !g.player2Id
          );
          if (PrivateGame) {
            user.socket.send(JSON.stringify({
              type: GAME_ALERT,
              payload: { message: "You already have a private game waiting." }
            }));
            this.removeGame(PrivateGame.RoomId)
            return;
          }
        }
        //find if gametype already has a roomid stored in waitingGame object 
        const WaitingGame = this.waitingGame.find(
          (gtype) => gtype.gametype === gameType
        );
       //if its empty add a new game or else push the player in that roomid room
        if (!WaitingGame?.gameId) {
          const game = new Game(user.userId, null,message.private,gameType);
          game.isPrivate = message.private || false; 
          this.games.push(game);

          if (!message.private && WaitingGame) {
            WaitingGame.gameId = game.RoomId;
          }

          connectionManager.addUserRoomMap(user, game.RoomId);

          connectionManager.sendMessageToAll(
            game.RoomId,
            JSON.stringify({
              type: GAME_ADDED,
              gameId: game.RoomId,
              gameType: gameType,
              private: message.private,
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
          waitingGame.PushSecondPlayer(user, gameType);
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

        if (message.type === GAME_OVER) {
        const gameId = message.payload.gameId;
        const game = this.games.find((game) => game.RoomId === gameId);

        if (game) {
          this.removeGame(game.RoomId);
        }
      }

      if (message.type === RECONNECTION || message.type === JOINROOM) {
        const gameId = message.payload.roomId;

        const gameWS = this.games.find((game) => game.RoomId === gameId);

        if (gameWS && !gameWS.player2Id) {
          connectionManager.addUserRoomMap(user, gameId);
          gameWS.PushSecondPlayer(user, gameType);
          return;
        }

        const gameDB = await getGameFromDb(gameId);
        console.log("Game Recieved in Game Manager :", gameDB);

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
            gameDB.id,
            gameDB.timeControl==="RAPID"?"rapid":gameDB.timeControl==="CLASSICAL"?"daily":"blitz" 
          );
          this.games.push(game);
        }
        if(gameWS)
        {
        const GAME_TOTAL_MS = (gameWS.gameType==="rapid"?15:gameWS.gameType==="blitz"?5:60) * 60 * 1000;
        const whiteTimeLeft = (GAME_TOTAL_MS - gameWS.player1TimeConsumed);
        const blackTimeLeft = (GAME_TOTAL_MS - gameWS.player2TimeConsumed);
        const elapsedSinceLastMove = Date.now() - gameWS.lastMoveTime;

        const liveWhiteTimeLeft = whiteTimeLeft - (gameWS.board.turn() === "w" ? elapsedSinceLastMove : 0);
        const liveBlackTimeLeft = blackTimeLeft - (gameWS.board.turn() === "b" ? elapsedSinceLastMove : 0);
        const now = Date.now();
        const timeTaken = (now - gameWS.lastMoveTime);
          user.socket.send(
          JSON.stringify({
            type: GAME_JOINED,
            payload: {
              RoomId: gameDB.id,
              gameType:gameDB.timeControl==="RAPID"?"rapid":gameDB.timeControl==="CLASSICAL"?"daily":"blitz" ,
              WhitePlayer: gameDB.whitePlayer,
              BlackPlayer: gameDB.blackPlayer,
              DBmoves: gameDB.moves,
              chat: gameDB.chat,
              fen: gameDB.currentFen,
              whiteTimeLeft:liveWhiteTimeLeft,
              blackTimeLeft:liveBlackTimeLeft,
              abandonedDeadline: 60000 - (Date.now() - gameWS.perMoveStart),
              serverTime:Date.now()
            },
          })
        )
        }
        else
        {
          user.socket.send(
          JSON.stringify({
            type: GAME_JOINED,
            payload: {
              RoomId: gameDB.id,
              gameType:gameDB.timeControl==="RAPID"?"rapid":gameDB.timeControl==="CLASSICAL"?"daily":"blitz" ,
              WhitePlayer: gameDB.whitePlayer,
              BlackPlayer: gameDB.blackPlayer,
              DBmoves: gameDB.moves,
              chat: gameDB.chat,
              fen: gameDB.currentFen
            },
          })
        )
        }

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
        const gameWS = this.games.find((game) => game.RoomId === roomId);
        console.log("game details : ",gameWS);
        
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
      if (message.type === REQUEST_DRAW) {
        //console.log("hello i triggred in undoMove");

        const gameId = message.payload.gameId as string;
        connectionManager.sendMessageToAll(
          gameId,
          JSON.stringify({
            type: REQUEST_DRAW,
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
            const undoCount = turn ? 1 : 2;
            const lastmoveCount = moveCount - undoCount;

            //console.log(roomId);

            const gameDB = await getGameFromDb(roomId);
            console.log("Game Recieved in Undo Approved :", gameDB);

            game?.board.load(gameDB.fenHistory[lastmoveCount]);
            const updatedgame = await deleteMovesfromDb(
              roomId,
              undoCount,
              moveCount,
              gameDB.fenHistory[lastmoveCount]
            );
            const updatedgameDB = await getGameFromDb(roomId);
            connectionManager.sendMessageToAll(
              roomId,
              JSON.stringify({
                type: UNDO_MOVE_APPROVE,
                payload: {
                  choice: choice,
                  revertedfen: updatedgameDB.fenHistory[lastmoveCount],
                  moves: updatedgameDB.moves,
                },
              })
            );
            game.moveCount = lastmoveCount;
            console.log("Updatedgame after moves deleted :", updatedgame);
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

        if (message.type === REQUEST_DRAW_APPROVE) {
        const choice = message.payload.choice as boolean;
        const roomId = message.payload.gameId as string;

        const game=this.games.find((g)=> g.RoomId===roomId)

        if(game&&choice)
        {
          console.log("i got triggered",game,choice);
          
          await game.endGame("COMPLETED","DRAW")  
          this.removeGame(game.RoomId);
        }
            connectionManager.sendMessageToAll(
              roomId,
              JSON.stringify({
                type: REQUEST_DRAW_APPROVE,
                payload: {
                 choice:choice
                },
              })
            );
          }


    });
  }
}
