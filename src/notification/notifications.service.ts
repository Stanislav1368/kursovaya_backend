import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Notification } from "./notifications.model";
import { SocketService } from "src/socket.service";
import { User } from "src/users/user.model";
import { Board } from "src/boards/boards.model";
import { Task } from "src/tasks/tasks.model";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification) private readonly notificationRepository: typeof Notification,
    private socketService: SocketService
  ) {}

  async getAllNotifications(boardId: number) {
    const notifications = await this.notificationRepository.findAll({
      where: { boardId: boardId },
      include: [
        {
          model: Task,
        },
        {
          model: User,
        },
        {
          model: Board,
        },
      ],
    });
    notifications.forEach((notif) => {
      console.log(notif.dataValues);
    });
    return notifications;
  }
  async getAllUserNotifications(userId: number) {
    console.log(userId);
    const notifications = await this.notificationRepository.findAll({
      where: { userId: userId },
      include: [
        {
          model: Task,
        },
        {
          model: User,
        },
        {
          model: Board,
        },
      ],
    });
    notifications.forEach((notif) => {
      console.log(notif.dataValues);
    });
    return notifications;
  }
  async createNotification(title: string, message: string, userId: number, boardId: number, taskId: number) {}

  async deleteNotification(userId: number, notificationId: number) {}

  async markNotificationsAsRead(notificationIds: number[]) {
    notificationIds.forEach(async (notifId) => {
      const notification = await this.notificationRepository.findOne({ where: { id: notifId } });
      notification.isRead = true;
      notification.save();
    });
  }
}
