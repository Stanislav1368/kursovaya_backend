import { Controller, Get, Param, Body, Post, Put, Delete } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";

@Controller("roles")
export class RolesController {
  constructor(private rolesService: RolesService) {}
  @Get()
  async getRoles() {
    return this.rolesService.getRoles();
  }
  @Get("/:roleId")
  async getRole(@Param("roleId") roleId: number) {
    return this.rolesService.getRole(roleId);
  }

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

}
