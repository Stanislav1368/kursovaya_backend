import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from "@nestjs/common";
import { CreateBoardDto } from "./dto/create-board.dto";
import { BoardsService } from "./boards.service";

@Controller("users/:userId/boards")
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  async getAllBoards(@Param("userId") userId: number) {
    return this.boardsService.getAllBoards(userId);
  }

  @Get(':boardId')
  async getBoardById(@Param('boardId') boardId: number) {
    return this.boardsService.getBoardById(boardId);
  }

  @Post()
  async createBoard(
    @Param("userId") userId: number,
    @Body() createBoardDto: CreateBoardDto
  ) {
    return this.boardsService.createBoardForUser(userId, createBoardDto);
  }

  @Post(":boardId")
  async addUserInBoard(
    @Param("userId") userId: number,
    @Param("boardId") boardId: number
  ) {
    return this.boardsService.addUserInBoard(userId, boardId);
  }

  @Delete(":boardId")
  async deleteBoard(
    @Param("userId") userId: number,
    @Param("boardId") boardId: number
  ) {
    return this.boardsService.deleteBoard(userId, boardId);
  }
}
