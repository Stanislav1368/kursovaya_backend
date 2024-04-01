import { Controller, Get, Param, Body, Post, Put, Delete } from "@nestjs/common";
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
  @Put("/:roleId")
  async updateRole(@Param("roleId") roleId: number, @Body() updateRoleDto: CreateRoleDto) {
    console.log(roleId, updateRoleDto);
    return this.rolesService.changeRole(roleId, updateRoleDto);
  }

  @Delete("/:roleId")
  async deleteRole(@Param("roleId") roleId: number) {
    console.log(123);
    return this.rolesService.deleteRoleByRoleId(roleId);
  }
}
