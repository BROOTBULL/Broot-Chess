import { User } from ".";
import type { WebSocket as WSWebSocket } from "ws";


class ConnectionManager {
  private static instance: ConnectionManager;
  private roomUserMap: Map<string, User[]>;
  private userToRoom: Map<string, string>;
  private userToSocket: Map<string, WSWebSocket> = new Map();

  private constructor() {
    this.roomUserMap = new Map<string, User[]>();
    this.userToRoom = new Map<string, string>();
    this.userToSocket = new Map<string, WSWebSocket>();
  }

  static getInstance() {
    if (ConnectionManager.instance) return ConnectionManager.instance;

    ConnectionManager.instance = new ConnectionManager();
    return ConnectionManager.instance;
  }

  addUserRoomMap(user: User, roomId: string) {
    this.roomUserMap.set(roomId, [
      ...(this.roomUserMap.get(roomId) || []),
      user,
    ]);
    this.userToRoom.set(user.userId, roomId); //user.userId is key and roomid is value so id one player send multiple roomId or init multiple time only last count
  }

  addUserSocket(userId: string, socket: WSWebSocket) {
    this.userToSocket.set(userId, socket);
  }

  removeUserSocket(userId: string) {
    this.userToSocket.delete(userId);
  }

  sendMessageToUser(userId: string, message: string) {
    const socket = this.userToSocket.get(userId);
    if (socket) {
      socket.send(message);
    } else {
      console.warn("User", userId, "not connected.");
    }
  }

  removeUserRoomMap(user: User) {
    const RoomID = this.userToRoom.get(user.userId);
    if (!RoomID) {
      console.log(user.name, " was removed from the room");
      return;
    }
    const UsersInRoom = this.roomUserMap.get(RoomID) || [];
    const OtherUsers = UsersInRoom.filter((u) => u.userId !== user.userId);

    this.roomUserMap.set(RoomID, OtherUsers);

    if (this.roomUserMap.get(RoomID)?.length === 0)
      this.roomUserMap.delete(RoomID);

    this.userToRoom.delete(user.userId);
  }

  sendMessageToAll(roomId: string, message: string) {
    const users = this.roomUserMap.get(roomId);
    if (!users) {
      console.error("No users in room?");
      return;
    }

    users.forEach((user) => {
      user.socket.send(message);
    });
  }

  getPlayersInfo(roomId: string) {
    return this.roomUserMap.get(roomId);
  }

  getmapInfo() {
    return this.userToSocket;
  }
}

export const connectionManager = ConnectionManager.getInstance();
