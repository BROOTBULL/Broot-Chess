import { WebSocket } from "ws";
import { INIT_GAME, MOVE ,GAME_ADDED,GAME_ALERT} from "./messages";
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

      if (message.type === INIT_GAME) {

        if (!this.pendingGameId) {
          const game = new Game(user.userId, null);
          this.games.push(game)
          this.pendingGameId=game.RoomId;
          connectionManager.addUserRoomMap(user,game.RoomId)
          connectionManager.sendMessageToAll(
             game.RoomId,
            JSON.stringify({
              type: GAME_ADDED,
              gameId:game.RoomId,
            })
          )
        }
        else
        {
          const waitingGame=this.games.find((game)=> game.RoomId === this.pendingGameId);
        if (!waitingGame) {
            console.error('Pending game not found?');
            return;
          }

        if (user.userId === waitingGame.player1Id) {
            connectionManager.sendMessageToAll(
              waitingGame.RoomId,
              JSON.stringify({
                type: GAME_ALERT,
                payload: {
                  message: 'Trying to Connect with yourself?',
                },
              }),
            );
            return;
          }

        connectionManager.addUserRoomMap(user,waitingGame.RoomId)
        waitingGame.PushSecondPlayer(user)

        }

      if (message.type === MOVE) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        ); // it looks for that game where it can find the current socket in either of the player.. and make move in that socket
        if (game) {
          //game class has 4 properties p1,p2 sockets and board with date
          console.log(message);

          game.makeMove(socket, message.move);
        }
      }
    });
  }
}
