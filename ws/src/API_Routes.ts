import axios from "axios";
import { GAME_RESULT, GAME_STATUS, gamedata } from "./Game";
import { Move } from "chess.js";
import { GameType } from "./GameManager";

axios.defaults.withCredentials=true;
axios.defaults.baseURL="https://broot-chess-backend.onrender.com"
type message = { sender: string; message: string };

export const createGameInDb=async(gameData:gamedata)=>{
    console.log("igotlogged");
    

    try {

        const gameSent=await axios.post("/gameData/savegame",gameData)
        console.log("game data sent to backed ", gameSent.data.message);
        
    } catch (error) {
        console.log("Error occured while saving game");
    }  
}

export const getGameFromDb=async(gameId:string)=>{

    try {

        const gameRecieved=await axios.get("/gameData/getgame",{params:{gameId:gameId}})
        console.log(gameRecieved.data.message," ,Game recieved : ",gameRecieved.data.game);
        return gameRecieved.data.game;
        
    } catch (error) {
        console.log(error);
    }  
}

// Game recieved :  {
//   id: '2cb120dc-4805-445e-ae1e-c7c87951e6b9',
//   whitePlayerId: '7583ccfe-5779-4cba-aee3-5b046b101b5c',
//   blackPlayerId: 'e9aaa771-d217-4925-b08f-8d7d7bd78225',
//   status: 'IN_PROGRESS',
//   result: null,
//   timeControl: 'CLASSICAL',
//   startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
//   currentFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
//   fenHistory: [ 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' ],
//   startAt: '2025-07-15T21:13:44.928Z',
//   endAt: null,
//   opening: null,
//   event: null,
//   whitePlayer: {
//     id: '7583ccfe-5779-4cba-aee3-5b046b101b5c',
//     username: 'Arjit',
//     name: 'Arjit',
//     email: 'arjit0228@gmail.com',
//     profile: 'https://lh3.googleusercontent.com/a/ACg8ocJoKmUXcqeZm_qTXIlqKo54S4LnhtFvTaZiJnmSL2UfO7iJcec=s96-c',
//     provider: 'GOOGLE',
//     password: null,
//     rating: 500,
//     createdAt: '2025-07-14T20:20:36.370Z',
//     lastLogin: null
//   },
//   blackPlayer: {
//     id: 'e9aaa771-d217-4925-b08f-8d7d7bd78225',
//     username: 'ARJIT123',
//     name: 'ARJIT123',
//     email: 'arjit123',
//     profile: null,
//     provider: 'EMAIL',
//     password: '116312',
//     rating: 500,
//     createdAt: '2025-07-15T21:13:20.497Z',
//     lastLogin: null
//   }
// }

export const saveMessageInDb=async(gameId:string,message:message)=>{

    try {

        const saveMessage=await axios.post("/gameData/saveMessage",{gameId:gameId,message:message})
        console.log(saveMessage.data.message);
        
    } catch (error) {
        console.log(error);
    }  
}

export const saveMovesInDb=async(gameId:string,move:Move,fen:string,moveCount:number,timeTaken:number)=>{

    try {

        const saveMoves=await axios.post("/gameData/saveMoves",{gameId:gameId,move:move,fen:fen,moveCount:moveCount,timeTaken:timeTaken})//didnt want to change my prisma soo i just put timeleft for the player when this move happend in timetaken
        console.log(saveMoves.data.message);
        
    } catch (error) {
        console.log(error);
    }  
}

export const deleteMovesfromDb=async(gameId:string,undoCount:number,moveCount:number,fen:string)=>
{
       try {

        const saveMoves=await axios.post("/gameData/deleteMoves",{gameId:gameId,moveCount:moveCount,fen:fen,undoCount:undoCount})
        console.log(saveMoves.data.message);
        return saveMoves.data.game;
        
    } catch (error) {
        console.log(error);
    }   
}


export const endGameDB=async(gameId:string,status:GAME_STATUS,result:string)=>{

    try {

        const saveGameResult=await axios.post("/gameData/endGame",{gameId:gameId,status:status,result:result})
        console.log(saveGameResult.data.message);
        return "Game End Saved in DB"
        
    } catch (error) {
        console.log(error);
    }  
}


export const updateRaingDB=async(whitePlayerId:string,blackPlayerId:string,result:string,gameType:GameType)=>{

    try {

        const updatePlayerRating=await axios.post("/gameData/updateRating",{whitePlayerId:whitePlayerId,blackPlayerId:blackPlayerId,result:result,gameType:gameType})
        console.log(updatePlayerRating.data.message);
        return "Players rating Updated succesfully"
        
    } catch (error) {
        console.log(error);
    }  
}













    // const gameId = req.body.gameId as string;
    // const undoCount = req.body.undoCount as number;
    // const moveCount = req.body.moveCount as number;
    // const fen = req.body.fen as string;
