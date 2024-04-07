import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Board } from "src/boards/boards.model";
import { State } from "src/states/states.model";
import { Task } from "src/tasks/tasks.model";
import { User } from "src/users/user.model";
import { SubTask } from "./subtasks.model";
import { createSubTask } from "./subtasks.dto";
import { SocketService } from "src/socket.service";
import { Notification } from "src/notification/notifications.model";

@Injectable()
export class SubTasksService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(State) private stateRepository: typeof State,
    @InjectModel(Task) private taskRepository: typeof Task,
    @InjectModel(SubTask) private subTaskRepository: typeof SubTask,
    private socketService: SocketService
  ) {}

  async getSubTasks(userId: number, boardId: number, stateId: number, taskId: number) {
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
    const task = await this.taskRepository.findByPk(taskId);
    if (!task) {
      throw new NotFoundException("Task not found");
    }
    const subtasks = await this.subTaskRepository.findAll({
      where: { taskId: taskId },
    });
    return subtasks;
  }

  async createSubTask(userId: number, boardId: number, stateId: number, taskId: number, createSubTaskDto: createSubTask) {
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
    const task = await this.taskRepository.findByPk(taskId);
    if (!task) {
      throw new NotFoundException("Task not found");
    }
    const subTask = new SubTask();
    subTask.title = createSubTaskDto.title;
    subTask.taskId = taskId;
    await subTask.save();
  }
  async updateSubTaskIsCompleted(userId: number, boardId: number, stateId: number, taskId: number, subTaskId: number, updateTaskDto: any) {
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

    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      include: [
        {
          model: User,
          through: { attributes: [] },
          attributes: ["id", "email", "firstName", "lastName", "middleName"],
        },
      ],
    });
    if (!task) {
      throw new NotFoundException("Task not found");
    }

    console.log(task);
    const subtask = await this.subTaskRepository.findByPk(subTaskId);
    if (!subtask) {
      throw new NotFoundException("subtask not found");
    }

    subtask.isCompleted = updateTaskDto.isCompleted;

    await subtask.save();
    const allSubTasks = await this.subTaskRepository.findAll({ where: { taskId } });
    const allCompleted = allSubTasks.every((sub) => sub.isCompleted === true);

    // Проверяем, все ли подзадачи выполнены
    if (allCompleted) {
      if (task) {
        task.isCompleted = true; // Если все выполнены, ставим статус задачи как выполненной
        const notif = new Notification();
        notif.title = "Задача завершена";
        notif.message = `Задача ${task.title} завершена`;
        notif.userId = null;
        notif.boardId = boardId;
        notif.fromUserId = null;
        notif.save();

        const title = `Задача завершена`;
        const message = `Задача ${task.title} завершена`;

        this.socketService.sendNotif(null, title, message, boardId);

        await task.save();
      }
    } else {
      if (task) {
        task.isCompleted = false; // Если хотя бы одна подзадача не выполнена, ставим статус задачи как невыполненной
        await task.save();
      }
    }
    return subtask;
  }
}
