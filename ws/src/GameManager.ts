import { WebSocket } from "ws";
import {
  INIT_GAME,
  MOVE,
  GAME_ADDED,
  GAME_ALERT,
  EXIT_GAME,
  RECONNECTION,
  GAME_JOINED,
  CHAT
} from "./messages";
import { User } from ".";
import { connectionManager } from "./connectionManager";
import { Game } from "./Game";

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
    user.socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      console.log("message in gameManger", message);

      if (message.type === INIT_GAME) {
        if (!this.pendingGameId) {
          console.log("no game room with player waiting");

          const game = new Game(user.userId, null);
          this.games.push(game);
          this.pendingGameId = game.RoomId;
          connectionManager.addUserRoomMap(user, game.RoomId);
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
            connectionManager.sendMessageToAll(
              waitingGame.RoomId,
              JSON.stringify({
                type: GAME_ALERT,
                payload: {
                  message: "Trying to Connect with yourself?",
                },
              })
            );
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

      if (message.type === RECONNECTION) {
        
        const gameId = message.payload.roomId;
        const game = this.games.find((game) => game.RoomId === gameId);
        if (game) {
          
          const Players = connectionManager.getPlayersInfo(game.RoomId);
          const WhitePlayer = Players?.find(
            (user) => user.userId !== game?.player2Id
          );
          const BlackPlayer = Players?.find(
            (user) => user.userId === game?.player2Id
          );
          
          user.socket.send(
            JSON.stringify({
              type: GAME_JOINED,
              payload: {
                RoomId: game.RoomId,
                WhitePlayer: WhitePlayer,
                BlackPlayer: BlackPlayer,
                fen: game.board.fen(),
              },
            })
          );
        }
        connectionManager.addUserRoomMap(user,gameId)
      }
      
     if(message.type===CHAT)
     {
      const roomId=message.payload.roomId;
      const game = this.games.find((game) => game.RoomId === roomId);
      if(game){
      const Players=connectionManager.getPlayersInfo(roomId)
      const myInfo=Players?.find(
            (u) => u.userId === user.userId
          );
      const opponentInfo=Players?.find(
            (u) => u.userId !== user.userId
          );
      myInfo?.socket.send(JSON.stringify({type:CHAT,payload:{
        message:message.payload.message
      }}))
      opponentInfo?.socket.send(JSON.stringify({type:CHAT,payload:{
        message:{
          type:"recieved",
          message:message.payload.message.message
        }
      }}))  
      }

     }
    });
  }
}
