import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";

@Controller("users/:userId/notifications")
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getAllNotifications(@Param("userId") userId: number) {
    return this.notificationsService.getAllNotifications(userId);
  }

  @Post()
  async createNotification(@Body() body: any) {
    try {
      const { title, message, userId, boardId, fromUserId } = body;
      console.log(userId);
      await this.notificationsService.createNotification(title, message, userId, boardId, fromUserId);
      return "Notification created successfully";
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Delete(":notificationId")
  async deleteNotification(@Param("userId") userId: number, @Param("notificationId") notificationId: number) {
    return this.notificationsService.deleteNotification(userId, notificationId);
  }
}
