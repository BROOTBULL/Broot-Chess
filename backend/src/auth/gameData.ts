import { Router,Request,Response } from "express";
import prisma from "../db";

const gameRoute =Router()

gameRoute.post("/savegame",async (req:Request,res:Response)=>{
try {
    const gameData=req.body;

    const game=await prisma.game.create({
        data:{
            id:gameData.id,
            timeControl:gameData.timeControl,
            status:gameData.status,
            startAt:gameData.startAt,
            currentFen:gameData.currentFen,
            whitePlayer:{
                connect:{
                    id:gameData.whitePlayerId,
                }
            },
            blackPlayer:{
                connect:{
                    id:gameData.blackPlayerId,
                }
            }
        },
        include:{
            whitePlayer:true,
            blackPlayer:true
        }
    });
    console.log("Game Data saved in Data Base",game);
    res.status(200).send({message:"Game saved in DataBase successfully..!!"})
    
} catch (error) {
    res.status(400).send({error:error,message:"game not saved...!!!"})
}
})

export default gameRoute;