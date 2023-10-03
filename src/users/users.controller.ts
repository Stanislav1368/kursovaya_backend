import { Body, Controller, Delete, Get, Param, Post, Put, Req, Request, UseGuards,  } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { BoardsService } from 'src/boards/boards.service';
import { CreateBoardDto } from 'src/boards/dto/create-board.dto';


@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService, private boardsService: BoardsService) {}

    @Post(':userId/boards')
    async createBoard(@Param('userId') userId: number, @Body() createBoardDto: CreateBoardDto) {
      return this.boardsService.createBoardForUser(userId, createBoardDto);
    }

    @Post()
    createUser(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }       

    @Post(':userId')
    async updateUser(@Param('userId') userId: number, @Body() body: any) {
        // const user = await this.usersService.getUserById(id);
        const updatedUser = await this.usersService.updateUser(userId, body);
        return {
            message: 'User updated successfully',
            user: updatedUser,
        };
        
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllUsers() {
        return this.usersService.getAllUsers();
    }


    @Get('byBoardId/:boardId')
    getAllUsersByBoard(@Param('boardId') boardId: number) {
        return this.usersService.getAllUsersByBoard(boardId);
    }
    @Get(':userId/getRoleByBoardId/:boardId')
    getRoleOnBoard(@Param('userId') userId: number, @Param('boardId') boardId: number) {
        return this.usersService.getRoleOnBoard(userId,boardId);
    }
    @UseGuards(JwtAuthGuard)
    @Get('currentUser')
    getCurrentUser(@Request() req) {
        return this.usersService.getUserById(req.user.id);
    }
    
    
    @Get(':userId')
    getUser(@Param('id') userId: number) {
        return this.usersService.getUserById(userId);
    }


    @UseGuards(JwtAuthGuard)
    @Delete(':userId')
    deleteUser(@Param('userId') userId: number) {
        return this.usersService.deleteUser(userId);
    }

    
}