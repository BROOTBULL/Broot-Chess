import { Chess, Move, Square } from "chess.js";
import { randomUUID } from "crypto";
import { User } from ".";
import { connectionManager } from "./connectionManager";
import { GAME_OVER, INIT_GAME, MOVE, GAME_ENDED } from "./messages";
import { createGameInDb, endGameDB, saveMovesInDb } from "./API_Routes";
import { GameType } from "./GameManager";

export type GAME_RESULT = "WHITE_WINS" | "BLACK_WINS" | "DRAW";
export type GAME_STATUS = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED' | 'TIME_UP' | 'PLAYER_EXIT';
export type timeControl =  "CLASSICAL" | "RAPID" | "BLITZ" ;
export type gamedata ={
      id:string,
      timeControl:timeControl,
      status:GAME_STATUS,
      startAt:string|Date,
      currentFen:string,
      whitePlayerId:string,
      blackPlayerId:string
}

export class Game {
  public RoomId: string;
  public player1Id: string;
  public player2Id: string | null;
  public result: GAME_RESULT | null = null;
  public board: Chess;
  public moveCount: number;
  public isPrivate: boolean; 
  private startTime = new Date(Date.now());

  constructor(
    player1Id: string,
    player2Id: string | null,
    RoomId?: string,
    isPrivate: boolean = false
  ) {
    this.RoomId = RoomId ?? randomUUID();
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    this.isPrivate = isPrivate;
    this.board = new Chess();
    this.moveCount = 0;
  }

  PushSecondPlayer(user:User,gameType:GameType)
  {
    this.player2Id=user.userId;
    const Players = connectionManager.getPlayersInfo(this.RoomId);
    this.startTime=new Date(Date.now());
    const GameType=gameType==="rapid"?"RAPID":gameType==="daily"?"CLASSICAL":"BLITZ" as timeControl

    const WhitePlayer=Players?.find((user)=> user.userId !== this.player2Id)
    const BlackPlayer=Players?.find((user)=> user.userId === this.player2Id)
    const gameData={
      id:this.RoomId,
      timeControl:GameType,
      status:"IN_PROGRESS" as GAME_STATUS,
      startAt:this.startTime,
      currentFen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      whitePlayerId:this.player1Id,
      blackPlayerId:this.player2Id
    }

    createGameInDb(gameData)
    
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
    ++this.moveCount;


    await saveMovesInDb(this.RoomId,move,this.board.fen(),this.moveCount)
    
    //notify both player about their moves 
    connectionManager.sendMessageToAll(this.RoomId,JSON.stringify({type: MOVE,payload:{user:user,move: move}}))

    //endGame logic 
    if (this.board.isGameOver()) {
      const winner = this.board.isDraw()
      ? 'DRAW'
      : this.board.turn() === 'b'
        ? 'WHITE_WINS'
        : 'BLACK_WINS';
    
    this.endGame('COMPLETED', this.board.turn()==="b" ? 'white' : 'black');
    }


  }

  async exitGame(user : User) {
    this.endGame('PLAYER_EXIT', user.userId === this.player2Id ? 'white' : 'black');
  }

  async endGame(status: GAME_STATUS, result: string) {

    const updategame=await endGameDB(this.RoomId,status,result)

    connectionManager.sendMessageToAll(
      this.RoomId,
      JSON.stringify({
        type: GAME_ENDED,
        payload: {
          result,
          status
        },
      }),
    );

  }


}
