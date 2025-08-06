import { Router, Request, Response } from "express";
import prisma from "../db";

type Move = { to: string; from: string };
const gameRoute = Router();
type message = { sender: string; message: string };
export type GAME_RESULT = "WHITE_WINS" | "BLACK_WINS" | "DRAW";
export type GAME_STATUS =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED"
  | "TIME_UP"
  | "PLAYER_EXIT";

gameRoute.post("/savegame", async (req: Request, res: Response) => {
  try {
    const gameData = req.body;

    const game = await prisma.game.create({
      data: {
        id: gameData.id,
        timeControl: gameData.timeControl,
        status: gameData.status,
        startAt: gameData.startAt,
        currentFen: gameData.currentFen,
        fenHistory: [gameData.currentFen],
        whitePlayer: {
          connect: {
            id: gameData.whitePlayerId,
          },
        },
        blackPlayer: {
          connect: {
            id: gameData.blackPlayerId,
          },
        },
      },
      include: {
        whitePlayer: true,
        blackPlayer: true,
      },
    });
    //console.log("Game Data saved in Data Base",game);
    res
      .status(200)
      .send({ message: "Game saved in DataBase successfully..!!" });
  } catch (error) {
    res.status(400).send({ error: error, message: "game not saved...!!!" });
  }
});

gameRoute.get("/getgame", async (req: Request, res: Response) => {
  const gameId = req.query.gameId as string;
  try {
    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        whitePlayer: true,
        blackPlayer: true,
        moves: true,
      },
    });
    if (game) {
      res.status(200).send({ message: "Game found..!!", game: game });
    } else {
      res.status(404).send({ message: "Game not found in DB..!!" });
      return;
    }
  } catch (error) {
    //console.log("Error in checkAuth", error);
    res
      .status(401)
      .json({ error: error, message: "Error while fetching Game" });
  }
});

gameRoute.post("/saveMessage", async (req: Request, res: Response) => {
  try {
    const gameId = req.body.gameId as string;
    const message = req.body.message as message;

    const gameData = await prisma.game.findUnique({
      where: { id: gameId },
      select: { chat: true },
    });
    const messages = (gameData?.chat as message[]) ?? [];
    messages.push(message);
    const gameDataUpdate = await prisma.game.update({
      where: { id: gameId },
      data: {
        chat: messages,
      },
    });

    //console.log("Massages saved in Db Successfully!!",gameDataUpdate);
    res
      .status(200)
      .send({ message: "Messages saved in DataBase successfully..!!" });
  } catch (error) {
    res.status(400).send({ error: error, message: "game not saved...!!!" });
  }
});

gameRoute.post("/saveMoves", async (req: Request, res: Response) => {
  try {
    const gameId = req.body.gameId as string;
    const moveCount = req.body.moveCount as number;
    const move = req.body.move as Move;
    const fen = req.body.fen as string;

    const movesSaved = await prisma.$transaction([
      prisma.move.create({
        data: {
          gameId: gameId,
          moveNumber: moveCount,
          from: move.from,
          to: move.to,
        },
      }),
      prisma.game.update({
        data: {
          currentFen: fen,
          fenHistory: {
            push: fen,
          },
        },
        where: {
          id: gameId,
        },
      }),
    ]);

    // console.log("Moves saved in Db Successfully!!",movesSaved);
    res
      .status(200)
      .send({ message: "Moves saved in DataBase successfully..!!" });
  } catch (error) {
    res.status(400).send({ error: error, message: "game not saved...!!!" });
  }
});

gameRoute.post("/deleteMoves", async (req: Request, res: Response) => {
  try {
    const gameId = req.body.gameId as string;
    const undoCount = req.body.undoCount as number;
    const moveCount = req.body.moveCount as number;
    const fen = req.body.fen as string;

    // Fetch current FEN history
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { fenHistory: true },
    });

    const updatedHistory = game?.fenHistory?.slice(0, -undoCount) || [];

    // Build delete query based on undoCount
    const moveDeleteQuery =
      undoCount === 1
        ? prisma.move.deleteMany({
            where: {
              gameId: gameId,
              moveNumber: moveCount,
            },
          })
        : prisma.move.deleteMany({
            where: {
              gameId: gameId,
              moveNumber: {
                in: [moveCount - 1, moveCount - 2],
              },
            },
          });

    const result = await prisma.$transaction([
      moveDeleteQuery,
      prisma.game.update({
        data: {
          currentFen: fen,
          fenHistory: updatedHistory,
        },
        where: {
          id: gameId,
        },
      }),
    ]);

    // console.log("Moves deleted and game updated successfully!", result);
    res
      .status(200)
      .send({ message: "Moves deleted successfully.", game: result });
  } catch (error) {
    console.error("Error deleting moves:", error);
    res.status(400).send({ error, message: "Failed to delete moves." });
  }
});

gameRoute.post("/endGame", async (req: Request, res: Response) => {
  try {
    const gameId = req.body.gameId as string;
    const status = req.body.status as GAME_STATUS;
    const colorWins = req.body.result as string;
    const result =
      colorWins === "white"
        ? "WHITE_WINS"
        : colorWins === "black"
        ? "BLACK_WINS"
        : ("DRAW" as GAME_RESULT);

    const gameSaved = await prisma.game.update({
      data: {
        status,
        result: result,
      },
      where: {
        id: gameId,
      },
      include: {
        moves: true,
        blackPlayer: true,
        whitePlayer: true,
      },
    });
    // console.log("Moves saved in Db Successfully!!",movesSaved);
    res
      .status(200)
      .send({ message: "Game ended and saved in DataBase successfully..!!" });
  } catch (error) {
    res.status(400).send({ error: error, message: "game not saved...!!!" });
  }
});

gameRoute.get("/games", async (req: Request, res: Response) => {
  const userId = req.query.userId as string;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        gamesAsWhite: {
          include: { blackPlayer: true },
        },
        gamesAsBlack: {
          include: { whitePlayer: true },
        },
      },
    });

    if (!user) {
      res.status(404).send({ message: "User not found." });
    return;
  }

    const mergedGames = [
      ...(user.gamesAsWhite || []).map((game) => ({
        id: game.id,
        opponent: game.blackPlayer ?? "Unknown",
        timeControl: game.timeControl,
        startAt: game.startAt,
        result: getPerspectiveResult(game.result, "white"),
        playedAs:"white"
      })),
      ...(user.gamesAsBlack || []).map((game) => ({
        id: game.id,
        opponent: game.whitePlayer ?? "Unknown",
        timeControl: game.timeControl,
        startAt: game.startAt,
        result: getPerspectiveResult(game.result, "black"),
        playedAs:"black"
      })),
    ];

    res.status(200).json({
      message: "Games found..!!",
      games: mergedGames,
    });
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({
      message: "Error while fetching Game",
      error,
    });
  }
});

// helper to format result from player's perspective
function getPerspectiveResult(
  result: string | null,
  color: "white" | "black"
): string {
  if (!result) return "Pending";

  const outcomes = {
    WHITE_WINS: color === "white" ? "Win" : "Loss",
    BLACK_WINS: color === "black" ? "Win" : "Loss",
    DRAW: "Draw",
  };

  return outcomes[result as keyof typeof outcomes] ?? "Unknown";
}

export default gameRoute;
