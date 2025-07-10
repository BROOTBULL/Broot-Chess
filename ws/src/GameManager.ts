import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";
import { User } from ".";

export class GameManager {
  private games: Game[];//game is defined like games:type  where array of Room (where Room is a class name Game).... like x:number[] x is the array of number  
  private pendingUser: WebSocket | null;
  private pendingUserDetail:User | null;
  private users: WebSocket[]; // users is a array of websockets 

  constructor() {// as types are defined now variables initialization
    this.games = [];
    this.pendingUser = null;
    this.pendingUserDetail=null;
    this.users = [];
  }

  addUser(user:User,socket: WebSocket) {
    console.log();
    
    this.users.push(socket);// just to count online users remove offline users and 
    this.addHandler(user,socket);//as soon as this trigger a eventListener is attached to the socket that listen to all message till connections is closed from frontend ...ws.close()
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
  }

  private addHandler(user:User,socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          
          const game = new Game(this.pendingUser,this.pendingUserDetail!, socket,user); //start game
          this.games.push(game);
          this.pendingUser = null;
        } else {
          
          this.pendingUser = socket;
          this.pendingUserDetail=user;
        }
      }

      if (message.type === MOVE) {
         const game =this.games.find(game=> game.player1===socket || game.player2===socket);// it looks for that game where it can find the current socket in either of the player.. and make move in that socket 
         if (game){                                                                         //game class has 4 properties p1,p2 sockets and board with date 
          console.log(message);
          
          game.makeMove(socket,message.move);
         }
      } 
    });
  }
}
