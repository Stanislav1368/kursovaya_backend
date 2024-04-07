import { Body, Controller, Param, Post, Get, Put, Delete } from "@nestjs/common";
import { SubTasksService } from "./subtasks.service";
import { createSubTask } from "./subtasks.dto";

@Controller("users/:userId/boards/:boardId/")
export class SubTasksController {
  constructor(private subTasksService: SubTasksService) {}

  @Post("states/:stateId/tasks/:taskId/subtasks")
  async createSubTask(
    @Param("userId") userId: number,
    @Param("boardId") boardId: number,
    @Param("stateId") stateId: number,
    @Param("taskId") taskId: number,
    @Body() createSubTaskDto: createSubTask
  ) {
    return this.subTasksService.createSubTask(userId, boardId, stateId, taskId, createSubTaskDto);
  }

  @Get("states/:stateId/tasks/:taskId/subtasks")
  async getSubTasks(
    @Param("userId") userId: number,
    @Param("boardId") boardId: number,
    @Param("stateId") stateId: number,
    @Param("taskId") taskId: number
  ) {
    return this.subTasksService.getSubTasks(userId, boardId, stateId, taskId);
  }

  @Put("states/:stateId/tasks/:taskId/subtasks/:subTaskId/isCompleted")
  async updateTaskIsCompleted(
    @Param("userId") userId: number,
    @Param("boardId") boardId: number,
    @Param("stateId") stateId: number,
    @Param("taskId") taskId: number,
    @Param("subTaskId") subTaskId: number,
    @Body() updateTaskDto: any
  ) {
    return this.subTasksService.updateSubTaskIsCompleted(userId, boardId, stateId, taskId, subTaskId, updateTaskDto);
  }
}
