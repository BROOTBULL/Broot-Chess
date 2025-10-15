import axios from "axios";

export const useGetBestMove=()=>{

     async function getBestMove(fen: string, depth: number = 12) {
       try {
         const res = await axios.get(`/stockfish/bestmove`, {
           params: { fen: fen, depth: depth },
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