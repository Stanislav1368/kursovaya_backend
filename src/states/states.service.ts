import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateStateDto } from "./dto/create-state.dto";
import { where } from "sequelize";
import { Task } from "src/tasks/tasks.model";
import { TasksService } from "src/tasks/tasks.service";
import { User } from "../users/user.model";
import { Board } from "../boards/boards.model";
import { State } from "./states.model";
import { Priority } from "src/priorities/priorities.model";
@Injectable()
export class StatesService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(State) private stateRepository: typeof State,
    private taskService: TasksService
  ) {}

  async getStatesByBoardId(boardId: number) {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    }); 
    if (!board) {
      throw new NotFoundException("Board not found");
    }

    const states: State[] = await this.stateRepository.findAll({
      where: { boardId },
      include: [
        {
          model: Task,
          as: "tasks",
          attributes: ["id", "title", "description", "stateId", "order"],
          include: [
            {
              model: User,
              through: { attributes: [] },
              attributes: ["name"],
            },
            {
              model: Priority,
              attributes: ["name", "index", "color"],
            },
          ],
        },
      ],
    });

    return states;
  }
  async getBoardStateById(userId: number, boardId: number, stateId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    if (!board) {
      throw new NotFoundException("Board not found");
    }

    const state = await this.stateRepository.findOne({
      where: { id: stateId },
      include: {
        model: Task,
        as: "tasks",
        attributes: ["id", "title", "description", "stateId"],
      },
    });
    if (!state) {
      throw new NotFoundException("State not found");
    }

    return state;
  }
  async createState(userId: number, boardId: number, createStateDto: CreateStateDto) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
      throw new NotFoundException("Board not found");
    }
    const state = new State();
    state.title = createStateDto.title;
    state.boardId = board.id;
    await state.save();

    return state;
  }
  async deleteState(userId: number, boardId: number, stateId: number) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
      throw new NotFoundException("Board not found");
    }

    const state = await this.stateRepository.findByPk(stateId);
    if (!state) {
      throw new NotFoundException("State not found");
    }

    // const tasks: Task[] = await this.taskService.getTasks(
    //   userId,
    //   boardId,
    //   stateId
    // );
    // for (const task of tasks) {
    //   await task.destroy();
    // }

    await state.destroy();
    return { message: "State deleted successfully" };
  }
}
