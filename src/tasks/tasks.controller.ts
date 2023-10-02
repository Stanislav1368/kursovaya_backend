import { Body, Controller, Param, Post, Get, Put, Delete } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { CreateStateDto } from 'src/states/dto/create-state.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('users/:userId/boards/:boardId/states/:stateId/tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}
    @Get()
    async getTasks(@Param('userId') userId: number, @Param('boardId') boardId: number, @Param('stateId') stateId: number, @Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.getTasks(userId, boardId, stateId);
    }
    // - `GET /users/{user_id}/boards/{board_id}/states/{state_id}/tasks/{task_id}` - получение информации о конкретной задаче
    @Get(':taskId')
    async getTaskById(@Param('userId') userId: number, @Param('boardId') boardId: number, @Param('stateId') stateId: number,@Param('taskId') taskId: number, @Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.getStateTaskById(userId, boardId, stateId, taskId);
    }
    // - `POST /users/{user_id}/boards/{board_id}/states/{state_id}/tasks` - создание новой задачи
    @Post()
    async createTask(@Param('userId') userId: number, @Param('boardId') boardId: number, @Param('stateId') stateId: number, @Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.createStateTask(userId, boardId, stateId, createTaskDto);
    }
    // - `PUT /users/{user_id}/boards/{board_id}/states/{state_id}/tasks/{task_id}` - обновление информации о задаче
    @Put(':taskId')
    async updateTask(@Param('userId') userId: number, @Param('boardId') boardId: number, @Param('stateId') stateId: number,@Param('taskId') taskId: number,@Body() updateTaskDto: UpdateTaskDto) {
      return this.tasksService.updateTask(userId, boardId, stateId, taskId, updateTaskDto);
    }
    // - `DELETE /users/{user_id}/boards/{board_id}/states/{state_id}/tasks/{task_id}` - удаление задачи
    @Delete(':taskId')
    async deleteTask(
        @Param('userId') userId: number,
        @Param('boardId') boardId: number,
        @Param('stateId') stateId: number,
        @Param('taskId') taskId: number
    ) {
        
        return this.tasksService.deleteTaskById(userId, boardId, stateId, taskId);
    }
}
