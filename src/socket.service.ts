import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
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
}
