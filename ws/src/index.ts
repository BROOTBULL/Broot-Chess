import { WebSocketServer, WebSocket } from "ws";
import { GameManager } from "./GameManager";
import url from "url";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { connectionManager } from "./connectionManager";
import http from "http";

export class User {
  public socket: WebSocket;
  public id: string;
  public profile: string;
  public rating: number;
  public userId: string;
  public name: string;
  public isGuest?: boolean;

  constructor(socket: WebSocket, user: userJwtClaims) {
    this.socket = socket;
    this.userId = user.userId;
    this.id = randomUUID();
    this.name = user.name;
    this.rating = user.rating;
    this.profile = user.profile;
    this.isGuest = user.isGuest;
  }
}

export interface userJwtClaims {
  userId: string;
  name: string;
  rating: number;
  isGuest?: boolean;
  profile: string;
}

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "SECRETKEY";
const server = http.createServer(); // Create HTTP server it automaically handles https traffic 
const wss = new WebSocketServer({ server });// Create a new WebSocket server instance that listens on the defined port
const gameManager = new GameManager(); // Create an instance of the GameManager to manage users and game rooms


wss.on("connection", function connection(ws, req) {
  // In frontend new Websocket(URL) is trigger this function and that websocket is sent here as ws

  console.log("Client connected");

  //@ts-ignore => to ignore token type error
  const token: string = url.parse(req.url!, true).query.token;
  if (!token) {
    console.warn("🔴 No token provided. Closing connection.");
    ws.close(4001, "Missing token");
    return;
  }
  // console.log("token:", token);

  let user: User;
  try {
    user = extractAuthUser(token, ws);
    // console.log("user: ",user);    
  } catch (err) {
    console.error("🔴 Invalid token:", err);
    ws.close(4002, "Invalid token");
    return;
  }
  connectionManager.addUserSocket(user.userId, ws);
  gameManager.addUser(user); //that ws is added in the room as player or pending player

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    // just for debugging purposes
    console.log("received: %s", data);
  });

  ws.send("Welcome! Connection established.");

  ws.on("disconnect", () => {
    console.log("disconnected");

    gameManager.removeUser(ws);
  });
});

const extractAuthUser = (token: string, ws: WebSocket): User => {
  const decoded = jwt.verify(token, JWT_SECRET) as userJwtClaims;
  // console.log("decoded: ", decoded);

  return new User(ws, decoded);
};

const PORT = parseInt(process.env.PORT || "8080", 10);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 WebSocket server running on 0.0.0.0:${PORT}`);
});
