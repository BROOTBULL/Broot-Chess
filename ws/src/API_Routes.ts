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