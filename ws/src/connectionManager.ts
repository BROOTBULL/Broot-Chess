import { User } from ".";

class ConnectionManager {
  private static instance: ConnectionManager;
  private roomUserMap: Map<string, User[]>;
  private userToRoom: Map<string, string>;

  private constructor() {
    this.roomUserMap = new Map<string, User[]>();
    this.userToRoom = new Map<string, string>();
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
    this.userToRoom.set(user.userId, roomId);
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

  getPlayersInfo(roomId:string)
  {
    return this.roomUserMap.get(roomId)
  }
}

export const connectionManager = ConnectionManager.getInstance()