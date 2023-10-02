import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { Board } from "src/boards/boards.model";
import { UserBoards } from "src/boards/user-boards.model";
import { IncludeThroughOptions } from "sequelize";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(UserBoards) private userBoardsRepository: typeof UserBoards,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    user.image = "/image/avatar.jpg";
    await user.save();

    return user;
  }

    async getAllUsersByBoard(boardId: number) {
        const users = await User.findAll({
        attributes: ["id", "email"],
        include: [
            {
            model: Board,
            through: { model: UserBoards, attributes: [] } as IncludeThroughOptions,
            where: { id: boardId },
            attributes: [],
            },
        ],
        group: ["User.id", "User.email"],
        });
        return users;
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
