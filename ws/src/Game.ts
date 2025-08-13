import { Chess, Move, Square } from "chess.js";
import { randomUUID } from "crypto";
import { User } from ".";
import { connectionManager } from "./connectionManager";
import { GAME_OVER, INIT_GAME, MOVE, GAME_ENDED } from "./messages";
import { createGameInDb, endGameDB, saveMovesInDb } from "./API_Routes";
import { GameType } from "./GameManager";

export type GAME_RESULT = "WHITE_WINS" | "BLACK_WINS" | "DRAW";
export type GAME_STATUS =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED"
  | "TIME_UP"
  | "PLAYER_EXIT";
export type timeControl = "CLASSICAL" | "RAPID" | "BLITZ";
export type gamedata = {
  id: string;
  timeControl: timeControl;
  status: GAME_STATUS;
  startAt: string | Date;
  currentFen: string;
  whitePlayerId: string;
  blackPlayerId: string;
};

export class Game {
  public RoomId: string;
  public player1Id: string;
  public player2Id: string | null;
  public result: GAME_RESULT | null = null;
  public gameType: GameType;
  public board: Chess;
  public moveCount: number;
  public isPrivate: boolean;
  private startTime = new Date(Date.now());
  public lastMoveTime: number;
  public player1TimeConsumed: number;
  public player2TimeConsumed: number;
  private gameDeadline: number;
  public perMoveStart: number ;
  private moveTimer: NodeJS.Timeout | null;
  private abandonTimer: NodeJS.Timeout | null;

  constructor(
    player1Id: string,
    player2Id: string | null,
    isPrivate: boolean = false,
    gameType: GameType,
    RoomId?: string
  ) {
    this.RoomId = RoomId ?? randomUUID();
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    this.isPrivate = isPrivate;
    this.gameType = gameType;
    this.board = new Chess();
    this.moveCount = 0;
    this.gameDeadline = 0;
    this.perMoveStart = 0;
    this.moveTimer = null;
    this.abandonTimer = null;
    this.lastMoveTime = 0;
    this.player1TimeConsumed = 0;
    this.player2TimeConsumed = 0;
  }

  PushSecondPlayer(user: User, gameType: GameType) {
    this.player2Id = user.userId;
    const Players = connectionManager.getPlayersInfo(this.RoomId);
    this.startTime = new Date(Date.now());
    const GameType =
      gameType === "rapid"
        ? "RAPID"
        : gameType === "daily"
        ? "CLASSICAL"
        : ("BLITZ" as timeControl);

    const WhitePlayer = Players?.find((user) => user.userId !== this.player2Id);
    const BlackPlayer = Players?.find((user) => user.userId === this.player2Id);
    const gameData = {
      id: this.RoomId,
      timeControl: GameType,
      status: "IN_PROGRESS" as GAME_STATUS,
      startAt: this.startTime,
      currentFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      whitePlayerId: this.player1Id,
      blackPlayerId: this.player2Id,
    };

    createGameInDb(gameData);

    connectionManager.sendMessageToAll(
      this.RoomId,
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          RoomId: this.RoomId,
          WhitePlayer: WhitePlayer,
          BlackPlayer: BlackPlayer,
          gameType: this.gameType,
          fen: this.board.fen(),
        },
      })
    );
    this.lastMoveTime=Date.now()
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

  // promoting logic
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

  // calculate time taken
  const now = Date.now();
  const timeTaken = this.moveCount===1?0:(now - this.lastMoveTime);
  this.perMoveStart=Date.now()

  if (isWhiteTurn) {
    this.player1TimeConsumed += timeTaken;
  } else {
    this.player2TimeConsumed += timeTaken;
  }
  this.lastMoveTime = now;

  // reset timers
  if (this.abandonTimer) clearTimeout(this.abandonTimer);
  if (this.moveTimer) clearTimeout(this.moveTimer);

  // restart abandon timer (60s no move)
  this.abandonTimer = setTimeout(() => {
    this.endGame("ABANDONED", this.board.turn()==="w" ? "black" : "white");
  }, 60 * 1000);

  // restart total time limit (example: 15 min)
  const GAME_TOTAL_MS = (this.gameType==="rapid"?15:this.gameType==="blitz"?5:60) * 60 * 1000;
  const whiteTimeLeft = GAME_TOTAL_MS - this.player1TimeConsumed;
  const blackTimeLeft = GAME_TOTAL_MS - this.player2TimeConsumed;

  this.moveTimer = setTimeout(() => {
    this.endGame("TIME_UP",this.board.turn() ? "black" : "white");
  }, isWhiteTurn ? whiteTimeLeft : blackTimeLeft);

  // save move in DB
  await saveMovesInDb(this.RoomId, move, this.board.fen(), this.moveCount, timeTaken);

  // notify both players about their moves + timers
  connectionManager.sendMessageToAll(
    this.RoomId,
    JSON.stringify({
      type: MOVE,
      payload: {
        user,
        move,
        whiteTimeLeft,
        blackTimeLeft,
        timeTaken:timeTaken
      },
    })
  );

  // end game check
  if (this.board.isGameOver()) {
    const winner = this.board.isDraw()
      ? "DRAW"
      : this.board.turn() === "b"
      ? "WHITE_WINS"
      : "BLACK_WINS";

    this.endGame("COMPLETED", winner);
  }
}


  async exitGame(user: User) {
    this.endGame(
      "PLAYER_EXIT",
      user.userId === this.player2Id ? "white" : "black"
    );
  }

  async endGame(status: GAME_STATUS, result: string) {
  if (this.moveTimer) {
    clearTimeout(this.moveTimer);
    this.moveTimer = null;
  }
  if (this.abandonTimer) {
    clearTimeout(this.abandonTimer);
    this.abandonTimer = null;
  }

    const updateEndgameMessage = await endGameDB(this.RoomId, status, result);
    console.log(updateEndgameMessage);
    

    connectionManager.sendMessageToAll(
      this.RoomId,
      JSON.stringify({
        type: GAME_ENDED,
        payload: {
          result,
          status,
        },
      })
    );
  }
}
