import { Controller, Get, Post, Delete, Param, Body, NotFoundException } from "@nestjs/common";
import { InvitationService } from "./invitation.service";

@Controller("users/:userId/invitations")
export class InvitationController {
  constructor(private invitationService: InvitationService) {}
  @Get()
  async getAllInviteInvitations(@Param("userId") userId: number) {
    return this.invitationService.getAllInviteNotifications(userId);
  }

  @Post()
  async createInvitation(@Body() body: any) {
    try {
      const { title, message, userId, boardId, fromUserId } = body;
      console.log(userId);
      await this.invitationService.createInviteNotification(title, message, userId, boardId, fromUserId);
      return "Notification created successfully";
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Delete(":notificationId")
  async deleteInvitation(@Param("userId") userId: number, @Param("notificationId") notificationId: number) {
    return this.invitationService.deleteInviteNotification(userId, notificationId);
  }
}
