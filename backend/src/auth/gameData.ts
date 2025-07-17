import { Router,Request,Response } from "express";
import prisma from "../db";

type Move={to:string,from:string}
const gameRoute =Router()
type message = { sender: string; message: string };


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
            blackPlayer:true,
            moves:true
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


gameRoute.post("/saveMessage",async (req:Request,res:Response)=>{
try {
    const gameId=req.body.gameId as string;
    const message=req.body.message as message;

    const gameData=await prisma.game.findUnique({
          where: { id: gameId },
          select: { chat: true }
    });
    const messages=(gameData?.chat as message[]) ?? []
    messages.push(message);
    const gameDataUpdate=await prisma.game.update({
          where: { id: gameId },
          data:{
            chat:messages
          }
    });


    console.log("Massages saved in Db Successfully!!",gameDataUpdate);
    res.status(200).send({message:"Messages saved in DataBase successfully..!!"})
    
} catch (error) {
    res.status(400).send({error:error,message:"game not saved...!!!"})
}
})


gameRoute.post("/saveMoves",async (req:Request,res:Response)=>{
try {
    const gameId=req.body.gameId as string;
    const moveCount=req.body.moveCount as number;
    const move=req.body.move as Move;
    const fen=req.body.fen as string;

    const movesSaved=await prisma.$transaction([
      prisma.move.create({
        data: {
          gameId: gameId,
          moveNumber: moveCount + 1,
          from: move.from,
          to: move.to,
        },
      }),
      prisma.game.update({
        data: {
          currentFen:fen,
          fenHistory:{
            push:fen
          }
        },
        where: {
          id: gameId,
        },
      }),
    ]);


    console.log("Moves saved in Db Successfully!!",movesSaved);
    res.status(200).send({message:"Moves saved in DataBase successfully..!!"})
    
} catch (error) {
    res.status(400).send({error:error,message:"game not saved...!!!"})
}
})
export default gameRoute;