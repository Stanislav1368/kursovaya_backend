import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { BoardsService } from "src/boards/boards.service";
import { CreateBoardDto } from "src/boards/dto/create-board.dto";
import { UpdatePrivilegeDto } from "./dto/update-privilege.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Controller("users")
export class UsersController {
  constructor(
    private usersService: UsersService,
    private boardsService: BoardsService
  ) {}

  // @Post(":userId/boards")
  // async createBoard(@Param("userId") userId: number, @Body() createBoardDto: CreateBoardDto) {
  //   return this.boardsService.createBoardForUser(userId, createBoardDto);
  // }

  @Post()
  createUser(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @Get("byEmail")
  getUserByEmail(@Query('email') email: string) {
    console.log(email);
    return this.usersService.getUserByEmail(email);
  }

  @Post(":userId")
  async updateUser(@Param("userId") userId: number, @Body() body: any) {
    // const user = await this.usersService.getUserById(id);
    const updatedUser = await this.usersService.updateUser(userId, body);
    return {
      message: "User updated successfully",
      user: updatedUser,
    };
  }

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get("byBoardId/:boardId")
  getAllUsersByBoard(@Param("boardId") boardId: number) {
    return this.usersService.getAllUsersByBoard(boardId);
  }
  @Get(":userId/roleByBoardId/:boardId")
  getRoleOnBoard(@Param("userId") userId: number, @Param("boardId") boardId: number) {
    return this.usersService.getRoleOnBoard(userId, boardId);
  }
  @Get(":userId/roleOnBoard/:boardId")
  getCurrentRole(@Param("userId") userId: number, @Param("boardId") boardId: number) {
    return this.usersService.getCurrentRole(userId, boardId);
  }

  @Put(":userId/roleOnBoard/:boardId")
  updateRole(@Param("userId") userId: number, @Param("boardId") boardId: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.usersService.updateRole(userId, boardId, updateRoleDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get("currentUser")
  getCurrentUser(@Request() req: any) {
    return this.usersService.getUserById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":userId")
  getUser(@Param("userId") userId: number) {

    return this.usersService.getUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":userId")
  deleteUser(@Param("userId") userId: number) {
    return this.usersService.deleteUser(userId);
  }
}
