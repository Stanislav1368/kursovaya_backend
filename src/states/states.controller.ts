import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateStateDto } from "./dto/create-state.dto";
import { StatesService } from "./states.service";
import { State } from "./states.model";

@Controller("users/:userId/boards/:boardId/states")
export class StatesController {
  constructor(private statesService: StatesService) {}

  @Get()
  async getStatesByBoardId(@Param("boardId") boardId: number) {
    return this.statesService.getStatesByBoardId(boardId);
  }

  @Put("/update")
  async updateBoardWithColumns(@Param("boardId") boardId: number, @Body() newColumns: any) {

    return this.statesService.updateBoardWithColumns(boardId, newColumns);
  }

  @Get("/:boardId")
  async getBoardStateById(@Param("userId") userId: number, @Param("boardId") boardId: number, @Param("stateId") stateId: number) {
    return this.statesService.getBoardStateById(userId, boardId, stateId);
  }
  @Post()
  async createBoardState(@Param("userId") userId: number, @Param("boardId") boardId: number, @Body() createStateDto: CreateStateDto) {
    return this.statesService.createState(userId, boardId, createStateDto);
  }

  // - DELETE /users/{user_id}/boards/{board_id}/states/{state_id} - удаление состояния
  @Delete("/:stateId")
  async deleteBoardState(@Param("userId") userId: number, @Param("boardId") boardId: number, @Param("stateId") stateId: number) {
    return this.statesService.deleteState(userId, boardId, stateId);
  }

  @Put("/:stateId")
  async updateTitle(@Param("stateId") stateId: number, @Body() data: any) {
    console.log(stateId, data);
    return this.statesService.updateTitle(stateId, data.title);
  }
}
