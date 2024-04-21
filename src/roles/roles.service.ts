import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Board } from "src/boards/boards.model";
import { Role } from "./roles.model";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UserBoards } from "src/boards/user-boards.model";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(Role) private roleRepository: typeof Role
  ) {}

  async getRoles(): Promise<Role[]> {
    const roles = await this.roleRepository.findAll();

    return roles;
  }

  async getRole(roleId: number) {
    const role = await this.roleRepository.findByPk(roleId);
    if (!role) {
      throw new NotFoundException("role not found");
    }

    return role;
  }

  async createRole(createRoleDto: CreateRoleDto) {
    console.log(createRoleDto);
    const role = new Role();
    role.name = createRoleDto.name;
    await role.save();
    console.log(role);
    return role;
  }
}
