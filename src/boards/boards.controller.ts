import { Body, Controller, Delete, Get, Param, Post, Put, Req, Request, UseGuards } from "@nestjs/common";
import { CreateBoardDto } from "./dto/create-board.dto";
import { BoardsService } from "./boards.service";
import { UpdateBoardDto } from "./dto/update-board.dto";

@Controller("users/:userId/boards")
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  async getAllBoards(@Param("userId") userId: number) {
    return this.boardsService.getAllBoards(userId);
  }

  @Put(":boardId/update")
  async updateBoardWithColumns(@Param("boardId") boardId: number, @Body() newColumns: any) {
    console.log(newColumns);
    return this.boardsService.updateBoardWithColumns(boardId, newColumns);
  }

  @Put(":boardId")
  async updateBoard(@Param("userId") userId: number, @Param("boardId") boardId: number, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardsService.updateBoard(userId, boardId, updateBoardDto);
  }
  @Get(":boardId")
  async getBoardById(@Param("boardId") boardId: number) {
    return this.boardsService.getBoardById(boardId);
  }

  @Post()
  async createBoard(@Param("userId") userId: number, @Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.createBoardForUser(userId, createBoardDto);
  }

  @Post(":boardId")
  async addUserInBoard(@Param("userId") userId: number, @Param("boardId") boardId: number) {
    return this.boardsService.addUserInBoard(userId, boardId);
  }
  @Post(":boardId/invite")
  async inviteUser(@Param("userId") userId: number, @Param("boardId") boardId: number) {
    return this.boardsService.inviteUser(userId, boardId);
  }
  @Delete(":boardId/deleteUser")
  async deleteUserFromBoard(@Param("userId") userId: number, @Param("boardId") boardId: number) {
    return this.boardsService.deleteUserFromBoard(userId, boardId);
  }

  @Delete(":boardId")
  async deleteBoard(@Param("userId") userId: number, @Param("boardId") boardId: number) {
    return this.boardsService.deleteBoard(userId, boardId);
  }
}
