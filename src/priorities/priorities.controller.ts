import { Controller, Get, Param, Body, Post, Delete, Put } from "@nestjs/common";
import { PrioritiesService } from "./priorities.service";
import { CreatePriorityDto } from "./dto/create-priority.dto";

@Controller("boards/:boardId/priorities")
export class PrioritiesController {
  constructor(private prioritiesService: PrioritiesService) {}
  @Get()
  async getPriorities(@Param("boardId") boardId: number) {
    return this.prioritiesService.getPriorities(boardId);
  }
  @Get("/:priorityId")
  async getPriority(@Param("boardId") boardId: number, @Param("priorityId") priorityId: number) {
    return this.prioritiesService.getPriority(boardId, priorityId);
  }

  @Post()
  async createPriority(@Param("boardId") boardId: number, @Body() createPriorityDto: CreatePriorityDto) {
    return this.prioritiesService.createPriority(boardId, createPriorityDto);
  }
  @Delete("/:priorityId")
  async deletePriority(@Param("boardId") boardId: number, @Param("priorityId") priorityId: number) {
    return this.prioritiesService.deletePriority(boardId, priorityId);
  }
  @Put("/:priorityId")
  async updatePriority(@Param("boardId") boardId: number, @Param("priorityId") priorityId: number, @Body() createPriorityDto: CreatePriorityDto) {
    return this.prioritiesService.updatePriority(boardId, priorityId, createPriorityDto);
  }
}
