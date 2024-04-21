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
import { SocketService } from "src/socket.service";
import { UserTasks } from "src/tasks/user-tasks.model";
import { SubTask } from "src/subtasks/subtasks.model";
@Injectable()
export class StatesService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(State) private stateRepository: typeof State,
    private taskService: TasksService,
    private socketService: SocketService
  ) {}

  async updateBoardWithColumns(boardId: number, newColumns: any[]) {
    console.log(newColumns);
    console.log(boardId);
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    if (!board) {
      throw new NotFoundException("Board not found");
    }

    const states: State[] = await this.stateRepository.findAll({
      where: { boardId: boardId },
      include: {
        model: Task,
      },
    });

    // Преобразуем данные для вывода только нужных полей
    const statesData = states.map((state) => ({
      id: state.id,
      title: state.title,
      tasks: state.tasks,
    }));

    console.log(statesData);

    const allTasks = Object.values(newColumns).reduce((acc: any[], column: any) => {
      // Извлекаем все задачи из текущей колонки и добавляем их в общий массив
      acc.push(
        ...Object.values(column)
          .map((item: any) => item.tasks)
          .flat()
      );
      return acc;
    }, []);

    // Полученный массив с всеми задачами
    console.log(allTasks);
    states?.forEach((state) => {
      state.tasks.forEach(async (task) => {
        const updatedTask = allTasks.find((t: any) => t.id === task.id);
        if (updatedTask) {
          console.log(task.stateId, task.order, task.title, updatedTask.stateId, updatedTask.order);
          task.stateId = updatedTask.stateId;
          task.order = updatedTask.order;
          await task.save();
          console.log(task);
        }
      });
    });

    return "Board updated successfully";
  }

  async getStatesByBoardId(boardId: number) {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    if (!board) {
      throw new NotFoundException("Board not found");
    }
    try {
      const states: State[] = await this.stateRepository.findAll({ 
        where: { boardId }, 
        include: [ 
          { 
            model: Task, 
            as: "tasks", 
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
              { 
                model: SubTask, 
                as: "subTasks", 
                attributes: ["id", "title", "isCompleted"], 
              }, 
              { 
                model: Task, 
                as: "dependentTask" // Включаем зависимую задачу
              }, 
            ], 
          }, 
        ], 
      });
      console.log(states);
      return states;
    } catch (error) {
      console.log(error);
    }
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

    this.socketService.sendNewStateUpdate(state);

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

    const tasks: Task[] = await this.taskService.getTasks(userId, boardId, stateId);
    for (const task of tasks) {
      await task.destroy();
    }

    await state.destroy();
    this.socketService.sendStateDelete();
    return { message: "State deleted successfully" };
  }
  async updateTitle(stateId: number, newTitle: string) {
    console.log(stateId, newTitle);
    const state = await this.stateRepository.findByPk(stateId);
    console.log(state);
    if (!state) {
      throw new NotFoundException("Board not found");
    }
    console.log(stateId);
    state.title = newTitle;
    state.save();
    return state;
  }
}
