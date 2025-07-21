import { Router, Request, Response } from "express";
import prisma from "../db";
import { MessageType, User } from "@prisma/client";

const interactionRoute = Router();

type Message={
    type:string,
    message:string,
    senderId:string
    senderProfile:string,
    senderUserName:string
}

interactionRoute.get("/getPlayer", async(req: Request, res: Response) => {
  try {
    const searchedPlayer = req.query.searchedPlayer as string;
    const userId =req.query.userId as string;

    const PlayerDB =await prisma.user.findMany({
      where: {
        OR: [
          {
            id: {
              startsWith: searchedPlayer,
              mode: "insensitive",
            },
          },
          {
            username: {
              startsWith: searchedPlayer,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        username:true,
        name: true,
        profile: true,
         sentRequests: {
      where: {
        receiverId: userId,
      },
      select: { status: true },
    },
    receivedRequests: {
      where: {
        senderId: userId,
      },
      select: { status: true },
    },
      },
      take: 10,
    });
    if (PlayerDB)
      res
        .status(200)
        .send({ message: "Player found successfully...!!", players: PlayerDB });
    else res.status(404).send({ message: "Player not found" });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong..!!", error: error });
  }
});

interactionRoute.post("/reqPlayer", async(req: Request, res: Response) => {
  try {
    const senderId = req.body.senderId as string;
    const receiverId = req.body.receiverId as string;
    console.log("igot triggered");
    


    const reqExist =await prisma.friendRequest.findFirst({
      where:{
        OR: [
        {
          senderId,
          receiverId
        },
        {
          senderId: receiverId,
          receiverId: senderId
        }
      ]}
      });
    if (reqExist)
    {
        console.log("req exists : ",reqExist);
        
         if (
      reqExist.senderId === receiverId &&
      reqExist.receiverId === senderId &&
      reqExist.status === "PENDING"
    ) {
      // Accept their request instead of creating a new one
      const accepted = await prisma.friendRequest.update({
        where: { id: reqExist.id },
        data: { status: "ACCEPTED" }
      });
     res.status(200)
        .send({ message: "Both Players are friends now", accepted: accepted ,status:"friends"});
    }
    else{
        console.log("Reqest sent already...!!");
        
        res.status(400)
        .send({ message: "Request sent already...!!!"});
    }
}else
{
      const requested = await prisma.friendRequest.create({
        data:{
            senderId:senderId,
            receiverId:receiverId,
            status:"PENDING"
        },
        include:{
          sender:true,receiver:true
        }
      });
      console.log(requested);
      
      res.status(200)
        .send({ message: "Friend Request sent Successfully...!!", requested : requested ,status:"Request_Sent"});
}
  } catch (error) {
     console.error("Friend request error:", error); // 👈 Add this
    res.status(400).send({ message: "Something went wrong..!!", error: error });
  }
});


interactionRoute.get("/friends", async(req: Request, res: Response) => {
  try {
    const userId =req.query.userId as string;
    console.log("igt triggered");
    

    const acceptedReq =await prisma.friendRequest.findMany({
      where: {
            status:"ACCEPTED",
            OR: [
      { senderId: userId },
      { receiverId: userId },
    ],
      },include: {
    sender: {
      select: {
        id: true,
        username: true,
        name: true,
        profile: true,
      },
    },
    receiver: {
      select: {
        id: true,
        username: true,
        name: true,
        profile: true,
      },
    },
  },
});
    if (acceptedReq){
    const Friends = acceptedReq.map((req) => {
      const isSender = req.senderId === userId;
      return isSender ? req.receiver : req.sender;
    });
        console.log("found friends :",Friends);
        
      res
        .status(200)
        .send({ message: "Friends found successfully...!!", Friends: Friends });}
    else 
        res.status(404).send({ message: "Friends not found" });
  } catch (error) {
    console.log("Error happend while getting Friends",error);
    res.status(400).send({ message: "Something went wrong..!!", error: error });
  }
})



interactionRoute.post("/message", async(req: Request, res: Response) => {
  try {
    const receiverId=req.body.friendId as string;
    const user =req.body.user as User;
    const message=req.body.message as string;
    const type =req.body.type as MessageType;

    console.log("igot triggered message",user);
    
    const sentMessage = await prisma.message.create({
      data:{
        receiverId:receiverId,
        senderId:user.id,
        message:message,
        messageType:type,
      }
    })
    
     res.status(200)
        .send({ message: "Message sent to friend",sentMessage:sentMessage});
    

  } catch (error) {
     console.error("Friend request error:", error); // 👈 Add this
    res.status(400).send({ message: "Something went wrong..!!", error: error });
  }
})


interactionRoute.get("/getmessage", async(req: Request, res: Response) => {
  try {
    const receiverId = req.query.userId as string;

    console.log("igot triggered getmessage ");
    
    const MyMessageBox =await prisma.message.findMany({
      where:{
       receiverId:receiverId
      }
      ,include:{
        sender:true
      }
      });
    if (MyMessageBox)
    {
        console.log("Received Message : ",MyMessageBox);

     res.status(200)
        .send({ message: "Message Recieved :",messages:MyMessageBox});
    }
   else
{
      res.status(400)
        .send({ message: "friend not found in db"});
}
  } catch (error) {
     console.error("Friend request error:", error); // 👈 Add this
    res.status(400).send({ message: "Something went wrong..!!", error: error });
  }
})


interactionRoute.post("/deletemessage", async(req: Request, res: Response) => {
  try {
    const messageId = req.body.messageId as string;

    console.log("igot triggered deletemessage ");
    
    const deletedMessage = await prisma.message.delete({
      where: { id: messageId },
    });

    res.status(200).send({ message: "Message deleted successfully", deleted: deletedMessage });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).send({ message: "Failed to delete message", error });
  }
})

interactionRoute.post("/deletefriend", async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId as string;
    const friendId = req.body.friendId as string;

    // Find the accepted FriendRequest between the two users
    const existingFriend = await prisma.friendRequest.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
    });

    if (existingFriend) {
          // Delete the friend connection
    await prisma.friendRequest.delete({
      where: { id: existingFriend.id },
    });

    res.status(200).send({ message: "Friend deleted successfully" });
    }
    else
    res.status(400).send({ message: "No Connection found..!!" });

  } catch (error) {
    console.error("Error deleting friend:", error);
    res.status(500).send({ message: "Failed to delete friend", error });
  }
});







// interactionRoute.post("/deletemessage", async(req: Request, res: Response) => {
// try {
//     const messageId = req.body.messageId as string;

//     if (!messageId) {
//       return res.status(400).send({ message: "Message ID is required" });
//     }




// })

export default interactionRoute;



// seen message logic

// interactionRoute.post("/messageSeen", async(req: Request, res: Response) => {
//   try {
//     const userId = req.body.userId as string;
//     const senderId=req.body.senderId as string

//     console.log("igot triggered get message ");
    
// const MyMessageBox =await prisma.user.findUnique({
//       where:{
//        id:userId
//       }
//       ,select:{
//         messages:true
//       }
//       });
//     if (MyMessageBox)
//     {
//         console.log("req exists : ",MyMessageBox);

//      res.status(200)
//         .send({ message: "Message Recieved :",messages:MyMessageBox});
//     }
//    else
// {
//       res.status(400)
//         .send({ message: "friend not found in db"});
// }
//   } catch (error) {
//      console.error("Friend request error:", error); // 👈 Add this
//     res.status(400).send({ message: "Something went wrong..!!", error: error });
//   }
// });


