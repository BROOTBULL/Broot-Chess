import axios from "axios";
import { gamedata } from "./Game";

axios.defaults.withCredentials=true;
axios.defaults.baseURL="http://localhost:3000"

export const createGameInDb=async(gameData:gamedata)=>{

    try {

        const gameSent=await axios.post("/gameData/savegame",gameData)
        console.log("game data sent to backed ", gameSent.data.message);
        
    } catch (error) {
        console.log(error);
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