import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Board } from "src/boards/boards.model";
import { Role } from "./roles.model";
import { CreateRoleDto } from "./dto/create-role.dto";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(Role) private roleRepository: typeof Role
  ) {}

  async getRoles(boardId: number): Promise<Role[]> {
    const board = await this.boardRepository.findByPk(boardId, { include: Role });
    if (!board) {
      throw new NotFoundException("board not found");
    }

    return board.roles;
  }

  async getRole(boardId: number, roleId: number) {
    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
      throw new NotFoundException("board not found");
    }
    const role = await this.roleRepository.findByPk(roleId);
    if (!role) {
      throw new NotFoundException("role not found");
    }

    return role;
  }

  async createRole(boardId: number, createRoleDto: CreateRoleDto) {
    const board = await this.boardRepository.findByPk(boardId);
    if (!board) {
      throw new NotFoundException("board not found");
    }
    console.log(createRoleDto);
    const role = new Role();
    role.name = createRoleDto.name;

    role.canEditBoardInfo = createRoleDto.canEditBoardInfo ?? false;
    role.canAddColumns = createRoleDto.canAddColumns ?? false;
    role.canAddUsers = createRoleDto.canAddUsers ?? false;
    role.canAddPriorities = createRoleDto.canAddPriorities ?? false;
    role.canCreateRoles = createRoleDto.canCreateRoles ?? false;
    role.canAccessStatistics = createRoleDto.canAccessStatistics ?? false;
    role.canCreateReports = createRoleDto.canCreateReports ?? false;
    role.canAccessArchive = createRoleDto.canAccessArchive ?? false;

    role.boardId = board.id;
    await role.save();
    console.log(role);
    return role;
  }
}
