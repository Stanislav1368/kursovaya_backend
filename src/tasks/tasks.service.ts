import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Board } from "src/boards/boards.model";
import { State } from "src/states/states.model";
import { User } from "src/users/user.model";
import { Task } from "./tasks.model";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(State) private stateRepository: typeof State,
    @InjectModel(Task) private taskRepository: typeof Task
  ) {}

  async getTasks(userId: number, boardId: number, stateId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
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
      where: { id: stateId, boardId },
    });
    if (!state) {
      throw new NotFoundException("State not found");
    }

    const tasks: Task[] = await this.taskRepository.findAll({
      where: { stateId },
    });
    return tasks;
  }
  async getStateTaskById(userId: number, boardId: number, stateId: number, taskId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
        throw new NotFoundException('User not found');
    }

    const board = await this.boardRepository.findOne({
        where: { id: boardId },
    });
    if (!board) {
        throw new NotFoundException('Board not found');
    }

    const state = await this.stateRepository.findOne({
        where: { id: stateId, boardId },
    });
    if (!state) {
        throw new NotFoundException('State not found');
    }

    const task = await this.taskRepository.findOne({
        where: { id: taskId, stateId },
    });
    if (!task) {
        throw new NotFoundException('Task not found');
    }

    return task;
}

async createStateTask(userId: number, boardId: number, stateId: number, createTaskDto: CreateTaskDto) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
        throw new NotFoundException('Board not found');
    }
    const state = await this.stateRepository.findByPk(stateId);
    if (!state) {
        throw new NotFoundException('State not found');
      }
    const task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.stateId = state.id;
    await task.save();

    return task;
}
async updateTask(userId: number, boardId: number, stateId: number, taskId: number, updateTaskDto: UpdateTaskDto) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const state = await this.stateRepository.findByPk(stateId);
    if (!state) {
      throw new NotFoundException('State not found');
    }

    const task = await this.taskRepository.findByPk(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.stateId = updateTaskDto.newStateId;
    await task.save();

    return task;
}
async deleteTaskById(userId: number, boardId: number, stateId: number, taskId: number) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
        throw new NotFoundException('Board not found');
      }

    const state = await this.stateRepository.findByPk(stateId);
    if (!state) {
        throw new NotFoundException(`State not found`);
    }

    const task = await this.taskRepository.findByPk(taskId);
    if (!task) {
        throw new NotFoundException(`Task not found`);
    }

    await task.destroy();
    return { message: 'Task deleted successfully' };
}
}
