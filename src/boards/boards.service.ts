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
import { SocketService } from "src/socket.service";
import { Notification } from "src/notification/notifications.model";
import { Role } from "src/roles/roles.model";

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(UserBoards) private userBoardsRepository: typeof UserBoards,
    private statesService: StatesService,
    private socketService: SocketService
  ) {}

  async updateBoardWithColumns(boardId: number, newColumns: any[]) {
    const board = await this.boardRepository.findByPk(boardId, { include: [{ all: true }] });

    // Проверяем, что доска существует
    if (!board) {
      throw new Error("Board not found");
    }

    const newColumnsArray = Object.values(newColumns);
    console.log(newColumnsArray[0][1].tasks);
    newColumnsArray.map((newColumn, index) => {});
    //НУЖНО ПРОСТО ПЕРЕБРАТЬ ЗАДАЧИ И ЗАМЕНИТЬ У НИх ПОЛЯ!!!
    return "Board updated successfully";
  }

  async getAllBoards(userId: number): Promise<Board[]> {
    console.log(userId);
    const user = await User.findByPk(userId, { include: Board });
    if (!user) {
      throw new NotFoundException("User not found");
    }

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
    board.isArchived = updateBoardDto.isArchived !== undefined ? updateBoardDto.isArchived : board.isArchived;
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
    const roleId = (await Role.findOne({ where: { name: "Читатель" } })).id;
    const userboards = await UserBoards.create({ userId, boardId: board.id, isOwner: false, roleId: roleId });
    return userboards;
  }

  async deleteUserFromBoard(userId: number, boardId: number) {
    // Проверяем существует ли пользователь
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Проверяем существует ли доска
    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
      throw new NotFoundException("Board not found");
    }

    // Удаляем пользователя из доски
    const deletedUserBoard = await UserBoards.destroy({ where: { userId, boardId } });

    // Проверяем успешно ли прошло удаление
    if (!deletedUserBoard) {
      throw new Error("Failed to delete user from board");
    }

    return "User successfully removed from the board";
  }

  async deleteBoard(userId: number, boardId: number) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      include: [
        {
          model: Notification,
        },
      ],
    });

    if (!board) {
      throw new Error("Board not found");
    }
    const notifications = board.notifications;
    for (const notification of notifications) {
      await notification.destroy(); // Удаляем каждое уведомление связанное с доской
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

  async inviteUser(userId: number, boardId: number) {
    console.log(userId, boardId);
  }
}
