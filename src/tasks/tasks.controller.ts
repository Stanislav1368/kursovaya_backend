import { Body, Controller, Param, Post, Get, Put, Delete } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { CreateStateDto } from 'src/states/dto/create-state.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('users/:userId/boards/:boardId/')
export class TasksController {
    constructor(private tasksService: TasksService) {}
    @Get('tasks')
    async getIsCheckedTasks(@Param('userId') userId: number, @Param('boardId') boardId: number, @Param('stateId') stateId: number, @Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.getCheckedTasks(userId, boardId);
    }
    @Get('states/:stateId/tasks')
    async getTasksInfo(@Param('userId') userId: number, @Param('boardId') boardId: number, @Param('stateId') stateId: number) {
        return this.tasksService.getTasksInfo(userId, boardId, stateId);
    }
    // - `GET /users/{user_id}/boards/{board_id}/states/{state_id}/tasks/{task_id}` - получение информации о конкретной задаче
    @Get('states/:stateId/tasks/:taskId')
    async getTaskById(@Param('userId') userId: number, @Param('boardId') boardId: number, @Param('stateId') stateId: number,@Param('taskId') taskId: number) {
        return this.tasksService.getTaskById(userId, boardId, stateId, taskId);
    }
    // - `POST /users/{user_id}/boards/{board_id}/states/{state_id}/tasks` - создание новой задачи
    @Post('states/:stateId/tasks')
    async createTask(@Param('userId') userId: number, @Param('boardId') boardId: number, @Param('stateId') stateId: number, @Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.createTask(userId, boardId, stateId, createTaskDto);
    }
    // - `PUT /users/{user_id}/boards/{board_id}/states/{state_id}/tasks/{task_id}` - обновление информации о задаче
    @Put('states/:stateId/tasks/:taskId')
    async updateTask(@Param('userId') userId: number, @Param('boardId') boardId: number, @Param('stateId') stateId: number,@Param('taskId') taskId: number, @Body() updateTaskDto: UpdateTaskDto) {
      return this.tasksService.updateTask(userId, boardId, stateId, taskId, updateTaskDto);
    }
    @Put('states/:stateId/tasks/:taskId/archive')
    async taskToArchive(@Param('userId') userId: number, @Param('boardId') boardId: number, @Param('stateId') stateId: number,@Param('taskId') taskId: number, @Body() updateTaskDto: UpdateTaskDto) {
      return this.tasksService.taskToArchive(userId, boardId, stateId, taskId, updateTaskDto);
    }
    @Put('states/:stateId/tasks/:taskId/isCompleted')
    async updateTaskIsCompleted(@Param('userId') userId: number, @Param('boardId') boardId: number, @Param('stateId') stateId: number,@Param('taskId') taskId: number, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.updateTaskIsCompleted(userId, boardId, stateId, taskId, updateTaskDto);
    }
    // - `DELETE /users/{user_id}/boards/{board_id}/states/{state_id}/tasks/{task_id}` - удаление задачи
    @Delete('states/:stateId/tasks/:taskId')
    async deleteTask(
        @Param('userId') userId: number,
        @Param('boardId') boardId: number,
        @Param('stateId') stateId: number,
        @Param('taskId') taskId: number
    ) {
        
        return this.tasksService.deleteTaskById(userId, boardId, stateId, taskId);
    }
}
