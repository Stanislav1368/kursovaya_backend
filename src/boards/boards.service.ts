import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/users/user.model";
import { Board } from "./boards.model";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UserBoards } from "./user-boards.model";
import { State } from "src/states/states.model";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { StatesService } from "src/states/states.service";
import { Task } from "src/tasks/tasks.model";
import { IncludeThroughOptions } from "sequelize";

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Board) private boardRepository: typeof Board,

    @InjectModel(UserBoards) private userBoardsRepository: typeof UserBoards,
    private statesService: StatesService
  ) {}

  async updateBoardWithColumns(boardId: number, newColumns: any[]) {
    console.log(newColumns);

    const board = await this.boardRepository.findByPk(boardId, { include: [{ all: true }] });

    // Проверяем, что доска существует
    if (!board) {
      throw new Error("Board not found");
    }
    console.log(board);
    // Обновляем состояния (столбцы) доски с новыми данными
    console.log(newColumns);

    const newColumnsArray = Object.values(newColumns);
    console.log(newColumnsArray[0][1].tasks);
    newColumnsArray.map((newColumn, index) => {});
    //НУЖНО ПРОСТО ПЕРЕБРАТЬ ЗАДАЧИ И ЗАМЕНИТЬ У НИх ПОЛЯ!!!
    return "Board updated successfully";
  }

  async getAllBoards(userId: number): Promise<Board[]> {
    const user = await User.findByPk(userId, { include: Board });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    console.log(user.boards);
    return user.boards;
  }
  async updateBoard(userId: number, boardId: number, updateBoardDto: UpdateBoardDto) {
    console.log(updateBoardDto.favorite);
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
      throw new NotFoundException("Board not found");
    }

    board.favorite = updateBoardDto.favorite !== undefined ? updateBoardDto.favorite : board.favorite;
    if (updateBoardDto.title) {
      board.title = updateBoardDto.title;
    }
    await board.save();
    console.log(board.favorite);
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
    console.log(board);
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
