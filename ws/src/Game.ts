import { Chess, Move, Square } from "chess.js";
import { randomUUID } from "crypto";
import { User } from ".";
import { connectionManager } from "./connectionManager";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

type GAME_RESULT = "WHITE_WINS" | "BLACK_WINS" | "DRAW";

export class Game {
  public RoomId: string;
  public player1Id: string;
  public player2Id: string | null;
  public result: GAME_RESULT | null = null;
  public board: Chess;
  private moveCount = 0;  
  private startTime = new Date(Date.now());

  constructor(player1Id: string, player2Id: string | null, RoomId?: string) {
    this.RoomId = RoomId ?? randomUUID();
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    this.board = new Chess();
  }

  PushSecondPlayer(user:User)
  {
    this.player2Id=user.userId;
    const Players = connectionManager.getPlayersInfo(this.RoomId);

    const WhitePlayer=Players?.find((user)=> user.userId !== this.player2Id)
    const BlackPlayer=Players?.find((user)=> user.userId === this.player2Id)
    
    connectionManager.sendMessageToAll(
      this.RoomId,
      JSON.stringify({
        type:INIT_GAME,
        payload:{
          RoomId:this.RoomId,
          WhitePlayer: WhitePlayer,
          BlackPlayer: BlackPlayer,
          fen: this.board.fen(),
        }
      })
    )
  }

  isPromoting(chess: Chess, from: Square, to: Square) {
    const piece = chess.get(from);

    if (!piece || piece.type !== "p") return false;

    // White pawn reaching 8th rank or black pawn reaching 1st
    return (
      (piece.color === "w" && to.endsWith("8")) ||
      (piece.color === "b" && to.endsWith("1"))
    );
  }

  //Making Moves on the WS

  async makeMove(user: User, move: Move) {
    //checking turns
    const isWhiteTurn = this.board.turn() === "w";
    if (isWhiteTurn && user.userId !== this.player1Id) return;

    if (!isWhiteTurn && user.userId !== this.player2Id) return;

    if (this.result) {
      console.log("Trying to move after game completion...!!!");
      return;
    }

    //promoting logic
    try {
      const promote = this.isPromoting(this.board, move.from, move.to);

      this.board.move({
        from: move.from,
        to: move.to,
        ...(promote ? { promotion: "q" } : {}),
      });
    } catch (e) {
      console.error("Error while making move", e);
      return;
    }
    
    //notify both player about their moves 
    connectionManager.sendMessageToAll(this.RoomId,JSON.stringify({type: MOVE,move: move}))

    //endGame logic 
        if (this.board.isGameOver()) {
      const winner = this.board.isDraw()
      ? 'DRAW'
      : this.board.turn() === 'b'
        ? 'WHITE_WINS'
        : 'BLACK_WINS';

    connectionManager.sendMessageToAll(this.RoomId,JSON.stringify({type: GAME_OVER, payload: { winner }}))
    }

    this.moveCount++;

  }
}
