import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Board } from "src/boards/boards.model";
import { State } from "src/states/states.model";
import { User } from "src/users/user.model";
import { Task } from "./tasks.model";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { UserTasks } from "./user-tasks.model";
import { IncludeThroughOptions } from "sequelize";
import { Priority } from "src/priorities/priorities.model";

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(State) private stateRepository: typeof State,
    @InjectModel(Task) private taskRepository: typeof Task,
    @InjectModel(UserTasks) private userTasksRepository: typeof UserTasks
  ) {}
  async getTasksInfo(userId: number, boardId: number, stateId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const board = await this.boardRepository.findOne({ where: { id: boardId } });
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
      where: { stateId }
    });
    console.log(tasks)
    // const tasksWithUserData = tasks.map((task) => {
    //   const user = task.users[0]; // Получение первого связанного пользователя
    //   const userResp = user.name; // Имя пользователя
    //   const title = task.title;
    //   const description = task.description;

    //   return { userResp, title, description };
    // });

    return tasks;
  }
  async getCheckedTasks(userId: number, boardId: number) {
    const tasks = await Task.findAll({
      where: {isArchived: true},
      include: [
        {
          model: State,
          where: { boardId: boardId },
          include: [
            {
              model: Board,
              where: { id: boardId }
            }
          ]
        }
      ]
    });
    console.log(tasks)
    return tasks;
  }
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
  async getTaskById(userId: number, boardId: number, stateId: number, taskId: number) {
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
      where: { id: stateId, boardId },
    });
    if (!state) {
      throw new NotFoundException("State not found");
    }

    const task = await this.taskRepository.findOne({
      where: { id: taskId, stateId },
      include: [
        {
          model: User,
          through: { attributes: [] },
          attributes: ["id", "email", "name"],
        },
        {
          model: Priority,
          attributes: ["name", "index", "color"],
        },
      ],
    });
    if (!task) {
      throw new NotFoundException("Task not found");
    }
    console.log(task.users[1])
    return task;
  }

  async createTask(userId: number, boardId: number, stateId: number, createTaskDto: CreateTaskDto) {
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

    const task = new Task();

    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.stateId = state.id;
    task.priorityId = createTaskDto.priorityId;
    task.deadline = createTaskDto.deadline;
    const maxOrder = await this.findMaxOrderInState(stateId);
    task.order = maxOrder + 1;
    await task.save();

    const userIds = createTaskDto.userIds; // Получаем массив идентификаторов пользователей

    for (const uid of userIds) {
      const userTasks = new UserTasks();
      userTasks.userId = uid;
      userTasks.taskId = task.id;
      await userTasks.save();
    }

    return task;
  }
  async findMaxOrderInState(stateId: number): Promise<number> {
    const maxOrderTask = await this.taskRepository.findOne({
      where: { stateId },
      order: [["order", "DESC"]],
    });
    return maxOrderTask ? maxOrderTask.order : 0;
  }
  async reorderTasksInState(stateId: number) {
    const tasks = await this.taskRepository.findAll({ where: { stateId }, order: [["order", "ASC"]] });
    let order = 1;
    await Promise.all(
      tasks.map(async (t) => {
        t.order = order;
        await t.save();
        order++;
      })
    );
  }

  async updateTaskIsCompleted(userId: number, boardId: number, stateId: number, taskId: number, updateTaskDto: UpdateTaskDto) {

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


    task.isCompleted = updateTaskDto.isCompleted;
 
    await task.save();
    return task;
  }
  
  async taskToArchive(userId: number, boardId: number, stateId: number, taskId: number, updateTaskDto: UpdateTaskDto) {

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

    const oldStateId = task.stateId;
    task.isArchived = updateTaskDto.isArchived;
    await task.save();
    return task;
  }
  async updateTask(userId: number, boardId: number, stateId: number, taskId: number, updateTaskDto: UpdateTaskDto) {

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

    const oldStateId = task.stateId;
    task.stateId = updateTaskDto.newStateId;
    if (oldStateId !== updateTaskDto.newStateId) {
      const maxOrderInNewState = await this.findMaxOrderInState(updateTaskDto.newStateId);
      task.order = maxOrderInNewState === 0 ? 1 : maxOrderInNewState + 1;
      // await this.reorderTasksInState(oldStateId);
      // await this.reorderTasksInState(updateTaskDto.newStateId);

    }

    await task.save();
    return task;
  }
  async deleteTaskById(userId: number, boardId: number, stateId: number, taskId: number) {
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
      throw new NotFoundException(`State not found`);
    }

    const task = await this.taskRepository.findByPk(taskId);
    if (!task) {
      throw new NotFoundException(`Task not found`);
    }

    await task.destroy();
    return { message: "Task deleted successfully" };
  }
}
