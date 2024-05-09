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
import { SocketService } from "src/socket.service";
import { Comments } from "./comments.model";
import { Notification } from "src/notification/notifications.model";
import { SubTask } from "src/subtasks/subtasks.model";

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(State) private stateRepository: typeof State,
    @InjectModel(Task) private taskRepository: typeof Task,
    @InjectModel(UserTasks) private userTasksRepository: typeof UserTasks,
    private socketService: SocketService
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
      where: { stateId },
    });
    console.log(tasks);
    // const tasksWithUserData = tasks.map((task) => {
    //   const user = task.users[0]; // Получение первого связанного пользователя
    //   const userResp = user.name; // Имя пользователя
    //   const title = task.title;
    //   const description = task.description;

    //   return { userResp, title, description };
    // });
    console.log(tasks);
    return tasks;
  }
  async getCheckedTasks(userId: number, boardId: number) {
    const tasks = await Task.findAll({
      where: { isArchived: true },
      include: [
        {
          model: State,
          where: { boardId: boardId },
          include: [
            {
              model: Board,
              where: { id: boardId },
            },
          ],
        },
      ],
    });
    console.log(tasks);
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
          attributes: ["id", "email", "firstName", "lastName", "middleName"],
        },
        {
          model: Priority,
          attributes: ["name", "color"],
        },
      ],
    });
    if (!task) {
      throw new NotFoundException("Task not found");
    }
    console.log(task.users[1]);
    return task;
  }
  async findTaskWithUsers(taskId: number) {
    return await this.taskRepository.findByPk(taskId, { include: [{ model: User }] });
  }
  async createTask(userId: number, boardId: number, stateId: number, createTaskDto: CreateTaskDto) {
    console.log(createTaskDto);
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
    console.log(createTaskDto);
    task.title = createTaskDto.title || "";
    task.description = createTaskDto.description || "";
    task.stateId = state.id || null;
    task.priorityId = createTaskDto.priorityId || null;
    task.dependentTaskId = createTaskDto.dependentTaskId || null;
    task.startDate = createTaskDto.dates ? createTaskDto.dates[0] : null;
    task.endDate = createTaskDto.dates ? createTaskDto.dates[1] : null;
    task.hours = createTaskDto.hours || null;
    task.creater = userId;
    const maxOrder = await this.findMaxOrderInState(stateId);
    task.order = maxOrder + 1;
    await task.save();

    const userIds = createTaskDto.userIds;

    if (userIds && userIds.length > 0) {
      for (const uid of userIds) {
        const userTasks = new UserTasks();
        userTasks.userId = uid;
        userTasks.taskId = task.id;
        await userTasks.save();

        const notif = new Notification();
        notif.title = "Назначение на задачу";
        notif.message = `Вы назначены на задачу "${task.title}"`;
        notif.userId = uid;
        notif.taskId = task.id;
        notif.boardId = boardId;
        await notif.save();

        this.socketService.sendNotif(uid, notif.title, notif.message, boardId, task, notif.id);
      }
    }

    await task.$get("users");

    const taskWithUsers = await this.taskRepository.findByPk(task.id, { include: [{ model: User }, { model: Priority }] });
    this.socketService.sendNewTaskUpdate(taskWithUsers); // Отправляем обновленную задачу с пользователями

    console.log(taskWithUsers); // Выводим объект задачи с пользователями

    return taskWithUsers; // Возвращаем задачу с пользователями
  }

  async commentTask(userId: number, taskId: number, comment: string) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const task = await this.taskRepository.findByPk(taskId);
    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const userTaskCom = new Comments();
    console.log(comment);
    userTaskCom.userId = userId;
    userTaskCom.taskId = taskId;
    userTaskCom.comment = comment;

    // Сохраняем изменения в базе данных
    await userTaskCom.save();
    this.socketService.sendNewCommentUpdate(userTaskCom);
    return userTaskCom;
  }
  async getCommentsTask(taskId: number) {
    try {
      console.log(taskId);
      const task = await Task.findByPk(taskId);

      if (!task) {
        throw new NotFoundException("Task not found");
      }
      console.log(task);
      const allComments = await Comments.findAll({
        where: { taskId: taskId },
      });
      const userComments = allComments.map(async (comment) => {
        const user = await User.findByPk(comment.userId);
        return {
          id: comment.id,
          user: user,
          comment: comment.comment,
        };
      });
      console.log(Promise.all(userComments));
      return Promise.all(userComments);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get comments for the task");
    }
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

    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      include: {
        model: SubTask,
      },
    });
    console.log(task);
    if (!task) {
      throw new NotFoundException("Task not found");
    }

    task.isCompleted = updateTaskDto.isCompleted;
    task.actualEndDate = updateTaskDto.isCompleted ? new Date() : null;
    await task.save();
    if (task.isCompleted) {
      task.subTasks.forEach((subtask) => {
        subtask.isCompleted = true;
        subtask.save();
      });
      console.log(task);
      const notif = new Notification();
      notif.title = "Задача завершена";
      notif.message = `Задача ${task.title} завершена`;
      notif.userId = userId;
      notif.taskId = taskId;
      notif.boardId = boardId;
      notif.save();
      const title = `Задача завершена`;
      const message = `Задача ${task.title} завершена`;

      this.socketService.sendNotif(notif.userId, notif.title, notif.message, notif.boardId, task, notif.id);
    } else {
      task.subTasks.forEach((subtask) => {
        subtask.isCompleted = false;
        subtask.save();
      });
    }

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

  async updateTaskUsers(userId: number, boardId: number, taskId: number, isResponsible: boolean) {
    console.log(userId, boardId, taskId, isResponsible);
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const task = await this.taskRepository.findByPk(taskId);
    if (!task) {
      throw new NotFoundException("Task not found");
    }
    console.log(task);
    if (isResponsible) {
      // Если пользователь должен быть ответственным, добавляем его к задаче
      const userTask = new UserTasks();
      userTask.userId = userId;
      userTask.taskId = taskId;
      await userTask.save();
      console.log();
      const notif = new Notification();
      notif.title = "Назначение на задачу";
      notif.message = `Вы назначены ответственным на задачу "${task.title}"`;
      notif.userId = userId;
      notif.taskId = taskId;
      notif.boardId = boardId;
      console.log(notif);
      await notif.save();

      this.socketService.sendNotif(userId, notif.title, notif.message, notif.boardId, task, notif.id);
    } else {
      // Если пользователь больше не ответственный, удаляем его из задачи
      await UserTasks.destroy({
        where: {
          userId,
          taskId,
        },
      });
    }

    const updatedTask = await this.taskRepository.findByPk(taskId, { include: [{ model: User }, { model: Priority }] });
    // this.socketService.sendUpdatedTaskUpdate(updatedTask); // Отправляем обновленную задачу с пользователями

    console.log(updatedTask); // Выводим объект задачи с пользователями
  }

  async updateTask(boardId: number, userId: number, taskId: number, updateTaskDto: any) {
    console.log(updateTaskDto);
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const task = await this.taskRepository.findByPk(taskId);
    if (!task) {
      throw new NotFoundException("Task not found");
    }
    console.log(updateTaskDto);
 
    task.title = updateTaskDto.title || task.title;
    task.description = updateTaskDto.description || task.description;
    task.priorityId = updateTaskDto.priorityId !== undefined ? updateTaskDto.priorityId : task.priorityId;
    if (updateTaskDto.dates && updateTaskDto.dates.length >= 2) {
      task.startDate = updateTaskDto.dates[0] || task.startDate;
      task.endDate = updateTaskDto.dates[1] || task.endDate;
    }

    await task.save();

    // const userIds = updateTaskDto.userIds; // Получаем массив идентификаторов пользователей

    // // Получаем существующие связи пользователя с задачей
    // const existingUserTasks = await UserTasks.findAll({ where: { taskId } });

    // // Обновляем существующие связи или добавляем новые
    // for (const uid of userIds) {
    //   const existingUserTask = existingUserTasks.find(ut => ut.userId === uid);
    //   if (existingUserTask) {
    //     // Если связь уже существует, необходимо обновить её
    //     existingUserTask.userId = uid;
    //     existingUserTask.taskId = taskId;
    //     await existingUserTask.save();
    //   } else {
    //     // Если связь не существует, добавляем новую
    //     const newUserTask = new UserTasks();
    //     newUserTask.userId = uid;
    //     newUserTask.taskId = taskId;
    //     await newUserTask.save();
    //   }
    // }

    const updatedTask = await this.taskRepository.findByPk(taskId, { include: [{ model: User }, { model: Priority }] });
    // this.socketService.sendUpdatedTaskUpdate(updatedTask); // Отправляем обновленную задачу с пользователями

    console.log(updatedTask); // Выводим объект задачи с пользователями

    return updatedTask; // Возвращаем обновленную задачу с пользователями
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

    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      include: [
        {
          model: Notification,
        },
      ],
    });
    if (!task) {
      throw new NotFoundException(`Task not found`);
    }
    console.log(task);
    task.notifications.forEach((notif) => {
      console.log(notif);
      notif.destroy();
    });
    await task.destroy();
    return { message: "Task deleted successfully" };
  }

  async moveTaskToState(taskId: number, newColumnId: number, newPosition: number): Promise<Task> {
    const task = await this.taskRepository.findByPk(taskId);
    console.log(newColumnId, newPosition);
    if (!task) {
      throw new Error("Card not found");
    }
    console.log(task.id, task.order, task.stateId);
    task.order = newPosition;
    task.stateId = newColumnId; // Обновляем принадлежность к списку
    console.log(task.id, task.order, task.stateId);
    return task.save();
  }
}
