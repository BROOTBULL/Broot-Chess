import axios from "axios";
import { useChessContext } from "./contextHook";

export const useGetBestMove=()=>{
  const {stockFishDepth}=useChessContext()

     async function getBestMove(fen: string) {
       try {
         const res = await axios.get(`/stockfish/bestmove`, {
           params: { fen: fen, depth: stockFishDepth },
         });
         const move = res.data.bestmove.split(" ")[1];
         const from = move.slice(0, 2);
         const to = move.slice(2, 4);
         const p = move.slice(4);
         return { from, to, p };
       } catch (err) {
         console.error("Error fetching Stockfish move:", err);
         return null;
       }
     }
   
     return{getBestMove}
    
}