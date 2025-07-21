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
  JOINROOM
} from "./messages";
import { User } from ".";
import { connectionManager } from "./connectionManager";
import { Game } from "./Game";
import { getGameFromDb, saveMessageInDb } from "./API_Routes";

export class GameManager {
  private games: Game[]; //game is defined like games:type  where array of Room (where Room is a class name Game).... like x:number[] x is the array of number
  private pendingGameId: string | null;
  private users: User[]; // users is a array of websockets

  constructor() {
    // as types are defined now variables initialization
    this.games = [];
    this.pendingGameId = null;
    this.users = [];
  }

  addUser(user: User) {
    console.log();

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
    user.socket.on("message", async(data) => {
      const message = JSON.parse(data.toString());
      console.log("message in gameManger", message);
      console.log(connectionManager.getmapInfo());
      

      if (message.type === INIT_GAME) {
        if (!this.pendingGameId) {
          console.log("no game room with player waiting");          

          const game = new Game(user.userId, null);
          this.games.push(game);
          if(!message.private)
          {
            this.pendingGameId = game.RoomId
          }
          console.log("game created..!!",game.RoomId);
          

          connectionManager.addUserRoomMap(user, game.RoomId);
          console.log("game added in map:",connectionManager.getmapInfo());
          connectionManager.sendMessageToAll(
            game.RoomId,
            JSON.stringify({
              type: GAME_ADDED,
              gameId: game.RoomId,
            })
          );
        } else {
          console.log(
            "game room available with player waiting",
            this.pendingGameId
          );

          const waitingGame = this.games.find(
            (game) => game.RoomId === this.pendingGameId
          );
          if (!waitingGame) {
            console.error("Pending game not found?");
            return;
          }

          if (user.userId === waitingGame.player1Id) {
            user.socket.send(JSON.stringify({
                type: GAME_ALERT,
                payload: {
                  message: "Trying to Connect with yourself?",
                }
              }))
            connectionManager.sendMessageToAll(
              waitingGame.RoomId,
              JSON.stringify({
                type: GAME_ALERT,
                payload: {
                  message: "Trying to Connect with yourself?",
                },
              })
            );
            this.removeGame(this.pendingGameId)
            this.pendingGameId=null;
            return;
          }

          connectionManager.addUserRoomMap(user, waitingGame.RoomId);
          waitingGame.PushSecondPlayer(user);
          this.pendingGameId = null;
        }
      }

      if (message.type === MOVE) {
        const gameId = message.payload.gameId;
        const game = this.games.find((game) => game.RoomId === gameId); // it looks for that game where it can find the current game in Game array.. and make move in that
        if (game) {
          console.log(message);
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

        if(gameWS&&!gameWS.player2Id)
        {
          connectionManager.addUserRoomMap(user,gameId)
          await gameWS.PushSecondPlayer(user)
          return;
        }
        

        const gameDB =await getGameFromDb(gameId)
        console.log("Game Recieved in Game Manager :",gameDB);

        if (!gameDB) {
          user.socket.send(
            JSON.stringify({
              type: GAME_NOT_FOUND,
            }),
          );
          return;
        }

        if(!gameWS)
        {
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
                moves:gameDB.moves,
                chat:gameDB.chat,
                fen: gameDB.currentFen,
              },
            })
          );
        connectionManager.addUserRoomMap(user,gameId)
      }
      
     if(message.type===CHAT)
     {
      const roomId=message.payload.roomId;
      const game = this.games.find((game) => game.RoomId === roomId);
      if(game){
        await saveMessageInDb(roomId,message.payload.message)
        connectionManager.sendMessageToAll(roomId,JSON.stringify({
          type:CHAT,
          payload:{
          message:message.payload.message
          }
        }))
      }
     }
    });
  }
}
