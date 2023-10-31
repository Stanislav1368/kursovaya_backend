import { Controller, Get, Param, Body, Post } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";

@Controller("boards/:boardId/roles")
export class RolesController {
  constructor(private rolesService: RolesService) {}
  @Get()
  async getRoles(@Param("boardId") boardId: number) {
    return this.rolesService.getRoles(boardId);
  }
  @Get("/:roleId")
  async getRole(@Param("boardId") boardId: number, @Param("roleId") roleId: number) {
    return this.rolesService.getRole(boardId, roleId);
  }

  @Post()
  async createRole(@Param("boardId") boardId: number, @Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(boardId, createRoleDto);
  }
}
