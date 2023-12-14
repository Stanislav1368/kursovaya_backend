import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/users/user.model";
import { Board } from "./boards.model";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UserBoards } from "./user-boards.model";
import { UsersService } from "src/users/users.service";
import { State } from "src/states/states.model";
import { UpdateBoardTitleDto } from "./dto/update-board-title.dto";
import { StatesService } from "src/states/states.service";
import { RolesService } from "src/roles/roles.service";

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(UserBoards) private userBoardsRepository: typeof UserBoards,
    private statesService: StatesService
  ) {}

  async getAllBoards(userId: number): Promise<Board[]> {
    const user = await User.findByPk(userId, { include: Board });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user.boards;
  }
  async updateBoard(userId: number, boardId: number, updateBoardTitleDto: UpdateBoardTitleDto) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
      throw new NotFoundException("Board not found");
    }
    board.title = updateBoardTitleDto.title;

    await board.save();
    return board;
  }
  async getBoardById(boardId: number) {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      include: {
        model: State,
        as: "states",
        attributes: ["id", "title", "boardId"],
      },
    });

    if (!board) {
      throw new NotFoundException("Board not found");
    }

    return board;
  }
  async createBoardForUser(userId: number, createBoardDto: CreateBoardDto): Promise<Board> {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const board = await this.boardRepository.create(createBoardDto);
    await UserBoards.create({ userId, boardId: board.id, isOwner: true });

    return board;
  }

  async addUserInBoard(userId: number, boardId: number) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
      throw new NotFoundException("Board not found");
    }

    const userboards = await UserBoards.create({ userId, boardId: board.id, isOwner: false });
    return userboards;
  }
  async deleteBoard(userId: number, boardId: number) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const board = await Board.findByPk(boardId);
    if (!board) {
      throw new Error("Board not found");
    }
    const states: State[] = await this.statesService.getStatesByBoardId(boardId);

    for (const state of states) {
      for (const task of state.tasks) {
        await task.destroy();
      }
      await state.destroy();
    }
    await board.destroy();
  }
}
