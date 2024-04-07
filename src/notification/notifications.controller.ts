import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";

@Controller("users/:userId/notifications")
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getAllNotifications(@Query("boardId") boardId: number) {
    console.log({ boardId });
    return this.notificationsService.getAllNotifications(boardId);
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

  @Get("inviteNotif")
  async getAllInviteNotifications(@Param("userId") userId: number) {
    return this.notificationsService.getAllInviteNotifications(userId);
  }

  @Post("inviteNotif")
  async createInviteNotification(@Body() body: any) {
    try {
      const { title, message, userId, boardId, fromUserId } = body;
      console.log(userId);
      await this.notificationsService.createInviteNotification(title, message, userId, boardId, fromUserId);
      return "Notification created successfully";
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Delete("inviteNotif/:notificationId")
  async deleteInviteNotification(@Param("userId") userId: number, @Param("notificationId") notificationId: number) {
    return this.notificationsService.deleteInviteNotification(userId, notificationId);
  }
}
