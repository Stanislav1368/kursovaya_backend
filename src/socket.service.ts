import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Task } from "./tasks/tasks.model";
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class SocketService implements OnGatewayConnection {
  handleConnection(client: any, ...args: any[]) {
    // console.log(client);
    // console.log("CONNECTED");
  }
  @WebSocketServer() server: Server;

  sendNewStateUpdate(newState: any) {
    this.server.emit("newState", newState);
  }

  sendStateDelete() {
    this.server.emit("deleteState");
  }

  sendNewTaskUpdate(newTask: any) {
    this.server.emit("newTask", newTask);
  }

  sendTaskDelete() {
    this.server.emit("deleteTask");
  }

  sendNewCommentUpdate(newComment: any) {
    this.server.emit("newComment", newComment);
  }

  sendNotif(userId: number, title: string, message: string, boardId: number, task: Task, notifId: number) {
    this.server.emit("sendNotif", userId, title, message, boardId, task);
  }

  sendInvite(userId: number, title: string, message: string, boardId: number) {
    this.server.emit("sendInvite", userId, title, message, boardId);
  }
}
