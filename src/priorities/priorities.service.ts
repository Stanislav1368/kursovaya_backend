import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Board } from "src/boards/boards.model";
import { Priority } from "./priorities.model";
import { CreatePriorityDto } from "./dto/create-priority.dto";

@Injectable()
export class PrioritiesService {
  constructor(
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(Priority) private roleRepository: typeof Priority
  ) {}

  async getPriorities(boardId: number): Promise<Priority[]> {
    const board = await this.boardRepository.findByPk(boardId, { include: Priority });
    if (!board) {
      throw new NotFoundException("board not found");
    }

    return board.priorities;
  }

  async getPriority(boardId: number, priorityId: number) {
    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
      throw new NotFoundException("board not found");
    }
    const priority = await this.roleRepository.findByPk(priorityId);
    if (!priority) {
      throw new NotFoundException("priority not found");
    }

    return priority;
  }

  async createPriority(boardId: number, createPriorityDto: CreatePriorityDto) {
    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
      throw new NotFoundException("board not found");
    }

    const priority = new Priority();

    priority.name = createPriorityDto.name;


    priority.color = createPriorityDto.color;

    priority.boardId = board.id;

    await priority.save();

    return priority;
  }
  
  async deletePriority(boardId: number, priorityId: number) {
    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
      throw new NotFoundException("board not found");
    }
    const priority = await this.roleRepository.findByPk(priorityId);
    if (!priority) {
      throw new NotFoundException("priority not found");
    }
    priority.destroy();
  }
  async updatePriority(boardId: number, priorityId: number, createPriorityDto: CreatePriorityDto) {
    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
      throw new NotFoundException("board not found");
    }
    const priority = await this.roleRepository.findByPk(priorityId);
    if (!priority) {
      throw new NotFoundException("priority not found");
    }
    priority.name = createPriorityDto.name;
    priority.color = createPriorityDto.color;
    priority.save()
  }
}
