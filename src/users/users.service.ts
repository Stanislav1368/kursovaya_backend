import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { Board } from "src/boards/boards.model";
import { UserBoards } from "src/boards/user-boards.model";
import { IncludeThroughOptions } from "sequelize";
import { UpdatePrivilegeDto } from "./dto/update-privilege.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role } from "src/roles/roles.model";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(UserBoards) private userBoardsRepository: typeof UserBoards,
    @InjectModel(Role) private roleRepository: typeof Role
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.middleName = dto.middleName;
    await user.save();

    return user;
  }

  async getAllUsersByBoard(boardId: number) {
    const users = await User.findAll({
      attributes: ["id", "email", "firstName", "lastName", "middleName"],
      include: [
        {
          model: Board,
          through: {
            model: UserBoards,
            attributes: [],
          } as IncludeThroughOptions,
          where: { id: boardId },
          attributes: [],
        },
      ],
      group: ["User.id", "User.email", "User.firstName", "User.lastName", "User.middleName"],
    });

    const usersWithRole = await Promise.all(
      users.map(async (user) => {
        const userBoard = await this.userBoardsRepository.findOne({
          where: { userId: user.id, boardId: boardId },
        });
        const role = await this.roleRepository.findOne({
          where: { id: userBoard.roleId, boardId: boardId },
        });

        const userInfo = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName,
          email: user.email,
          isOwner: userBoard.isOwner,
          roleId: userBoard.roleId,
          roleName: role?.name,
          canEditBoardInfo: role?.canEditBoardInfo,
          canAddColumns: role?.canAddColumns,
          canAddUsers: role?.canAddUsers,
          canAddPriorities: role?.canAddPriorities,
          canCreateRoles: role?.canCreateRoles,
          canAccessStatistics: role?.canAccessStatistics,
          canCreateReports: role?.canCreateReports,
          canAccessArchive: role?.canAccessArchive,
        };

        return userInfo;
      })
    );

    return usersWithRole;
  }

  async getRoleOnBoard(userId: number, boardId: number) {
    const userBoard = this.userBoardsRepository.findOne({
      where: { userId: userId, boardId: boardId },
    });
    return (await userBoard).isOwner;
  }

  async getCurrentRole(userId: number, boardId: number) {
    const userBoard = this.userBoardsRepository.findOne({
      where: { userId: userId, boardId: boardId },
    });

    const role = this.roleRepository.findOne({
      where: { id: (await userBoard).roleId },
    });

    return role;
  }

  async updateRoleOnBoard(userId: number, boardId: number, updatePrivilegeDto: UpdatePrivilegeDto) {
    const userBoard = await this.userBoardsRepository.findOne({
      where: { userId: userId, boardId: boardId },
    });
    userBoard.isOwner = updatePrivilegeDto.newPrivilege ? true : false;
    await userBoard.save();
    return userBoard.isOwner;
  }
  async updateRole(userId: number, boardId: number, updateRoleDto: UpdateRoleDto) {
    const userBoard = await this.userBoardsRepository.findOne({
      where: { userId: userId, boardId: boardId },
    });
    console.log(updateRoleDto.roleId);
    userBoard.roleId = updateRoleDto.roleId;
    await userBoard.save();
    console.log(userBoard);
    return userBoard.roleId;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.findByPk(userId, {
      include: { all: true },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async updateUser(userId: number, body: any) {
    const user = await this.userRepository.findByPk(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }
    await user.save();
    return { user };
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    await user.destroy();
    return { message: "User deleted successfully" };
  }
}
