import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { Board } from "src/boards/boards.model";
import { UserBoards } from "src/boards/user-boards.model";
import { IncludeThroughOptions } from "sequelize";
import { UpdatePrivilegeDto } from "./dto/update-privilege.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(UserBoards) private userBoardsRepository: typeof UserBoards
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    user.name = "MockName" + user.id;
    await user.save();

    return user;
  }

  async getAllUsersByBoard(boardId: number) { 
    const users = await User.findAll({ 
      attributes: ["id", "email", "name"], 
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
      group: ["User.id", "User.email", "User.name"], 
    }); 
  
    const usersWithRole = await Promise.all(users.map(async (user) => { 
      const userBoard = await this.userBoardsRepository.findOne({ 
        where: { userId: user.id, boardId: boardId } 
      }); 
      const userInfo = { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        isOwner: userBoard.isOwner 
      }; 
  
      return userInfo; 
    })); 
  
    
    return usersWithRole; 
  }
  
  async getRoleOnBoard(userId: number, boardId: number) {
    const userBoard = this.userBoardsRepository.findOne({
      where: { userId: userId, boardId: boardId },
    });
    return (await userBoard).isOwner;
  }
  async updateRoleOnBoard(userId: number, boardId: number, updatePrivilegeDto: UpdatePrivilegeDto) { 
    console.log(userId, boardId, updatePrivilegeDto.newPrivilege ? true : false) 
    const userBoard = await this.userBoardsRepository.findOne({ 
      where: { userId: userId, boardId: boardId }, 
    }); 
    userBoard.isOwner = updatePrivilegeDto.newPrivilege ? true : false; 
    await userBoard.save(); 
    return userBoard.isOwner; 
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
