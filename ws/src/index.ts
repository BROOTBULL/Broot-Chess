import express, { Response } from "express";
import { WebSocketServer, WebSocket } from "ws";
import { GameManager } from "./GameManager";
import url from "url";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { connectionManager } from "./connectionManager";
import http from "http";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "SECRETKEY";

const app = express();
app.get("/", (_, res:Response) => res.send("WebSocket server up ✅"));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const gameManager = new GameManager();

export interface userJwtClaims {
  userId: string;
  name: string;
  rating: number;
  isGuest?: boolean;
  profile: string;
}

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

const extractAuthUser = (token: string, ws: WebSocket): User => {
  const decoded = jwt.verify(token, JWT_SECRET) as userJwtClaims;
  return new User(ws, decoded);
};

wss.on("connection", function connection(ws, req) {
  const token: string = url.parse(req.url!, true).query.token as string;
  if (!token) {
    ws.close(4001, "Missing token");
    return;
  }

  let user: User;
  try {
    user = extractAuthUser(token, ws);
  } catch {
    ws.close(4002, "Invalid token");
    return;
  }

  connectionManager.addUserSocket(user.userId, ws);
  gameManager.addUser(user);

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send("Welcome! Connection established.");

  ws.on("close", () => {
    gameManager.removeUser(ws);
  });
});

const PORT = parseInt(process.env.PORT || "8080", 10);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 WebSocket server running on http://0.0.0.0:${PORT}`);
});
