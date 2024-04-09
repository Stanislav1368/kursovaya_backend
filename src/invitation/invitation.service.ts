import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { SocketService } from "src/socket.service";
import { Invitation } from "./invitation.model";
import { User } from "src/users/user.model";
import { Board } from "src/boards/boards.model";

@Injectable()
export class InvitationService {
  constructor(
    @InjectModel(Invitation) private readonly InvitationRepository: typeof Invitation,
    private socketService: SocketService
  ) {}
  async getAllInviteNotifications(userId: number) {
    const invitations = await this.InvitationRepository.findAll({ where: { userId } });
    console.log(invitations);

    const notifWithInviter: any[] = await Promise.all(
      invitations.map(async (invite) => {
        const inviterId = invite.fromUserId;
        const inviter = await User.findOne({ where: { id: inviterId } });
        return {
          id: invite.id,
          title: invite.title,
          message: invite.message,
          userId: invite.userId,
          boardId: invite.boardId,
          inviterUserId: invite.fromUserId,
          inviterFirstName: inviter.firstName,
          inviterLastName: inviter.lastName,
          inviterMiddleName: inviter.middleName,
        };
      })
    );
    return notifWithInviter;
  }

  async createInviteNotification(title: string, message: string, userId: number, boardId: number, fromUserId: number) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      const board = await Board.findByPk(boardId);
      if (!board) {
        throw new NotFoundException("Board not found");
      }

      const invite = new Invitation();
      invite.title = title;
      invite.message = message;
      invite.userId = userId;
      invite.boardId = boardId;
      invite.fromUserId = fromUserId;
      await invite.save();

      this.socketService.sendInvite(userId, title, message, null);
    } catch (error) {
      console.error("Error creating notification:", error);
      throw new Error("Failed to create notification");
    }
  }

  async deleteInviteNotification(userId: number, invitationId: number) {
    const invitation = await this.InvitationRepository.findOne({ where: { id: invitationId, userId } });
    if (!invitation) {
      throw new NotFoundException(`Invitation with id ${invitationId} not found for user with id ${userId}`);
    }
    await invitation.destroy();
    return { message: `Invitation with id ${invitationId} deleted successfully` };
  }
}
