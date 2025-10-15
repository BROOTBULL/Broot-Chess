import { Router,Request,Response } from "express";

const stockfishRouter = Router();

stockfishRouter.get("/bestmove", async (req:Request, res:Response) => {
    console.log("hello");
    
  const { fen, depth = 12 } = req.query;

  try {
    const response = await fetch(
      `https://stockfish.online/api/s/v2.php?fen=${fen}&depth=${depth}`
    );
    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching Stockfish move:", error);
    res.status(500).json({ error: "Failed to fetch Stockfish move" });
  }
});

export default stockfishRouter;