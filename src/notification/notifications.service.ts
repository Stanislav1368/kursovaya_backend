import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Notification } from "./notifications.model";
import { SocketService } from "src/socket.service";
import { User } from "src/users/user.model";
import { Board } from "src/boards/boards.model";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification) private readonly notificationRepository: typeof Notification,
    private socketService: SocketService
  ) {}

  async getAllNotifications(userId: number) {
    const notifications = await this.notificationRepository.findAll({ where: { userId } });
    console.log(notifications);

    const notifWithInviter: any[] = await Promise.all(
      notifications.map(async (notif) => {
        const inviterId = notif.fromUserId;
        const inviter = await User.findOne({ where: { id: inviterId } });
        return {
          id: notif.id,
          title: notif.title,
          message: notif.message,
          userId: notif.userId,
          boardId: notif.boardId,
          inviterUserId: notif.fromUserId,
          inviterFirstName: inviter.firstName,
          inviterLastName: inviter.lastName,
          inviterMiddleName: inviter.middleName,
        };
      })
    );
    console.log(notifWithInviter);
    return notifWithInviter;
  }

  async createNotification(title: string, message: string, userId: number, boardId: number, fromUserId: number) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      const board = await Board.findByPk(boardId);
      if (!board) {
        throw new NotFoundException("Board not found");
      }

      const notif = new Notification();
      notif.title = title;
      notif.message = message;
      notif.userId = userId;
      notif.boardId = boardId;
      notif.fromUserId = fromUserId;
      await notif.save();

      this.socketService.sendInvite(userId);
    } catch (error) {
      console.error("Error creating notification:", error);
      throw new Error("Failed to create notification");
    }
  }

  async deleteNotification(userId: number, notificationId: number) {
    const notification = await this.notificationRepository.findOne({ where: { id: notificationId, userId } });
    if (!notification) {
      throw new NotFoundException(`Notification with id ${notificationId} not found for user with id ${userId}`);
    }
    await notification.destroy();
    return { message: `Notification with id ${notificationId} deleted successfully` };
  }
}
