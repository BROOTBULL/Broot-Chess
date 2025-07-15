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
            fenHistory:[gameData.currentFen],
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

gameRoute.get("/getgame",async (req:Request,res:Response)=>{

     const gameId=req.query.gameId as string;
    try {
        const game=await prisma.game.findUnique({
        where:{
            id:gameId
        },
        include:{
            whitePlayer:true,
            blackPlayer:true
        }
    })
    if(game)
    {
        res.status(200).send({message:"Game found..!!",game:game})
    }else
    {
        res.status(404).send({message:"Game not found in DB..!!"})
        return;
    }
    } catch (error) {
    console.log("Error in checkAuth", error);
    res.status(401).json({error:error, message: "Error while fetching Game" });     
    }
})


export default gameRoute;