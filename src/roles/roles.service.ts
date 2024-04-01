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
    role.canCreateRole = createRoleDto.canCreateRole ?? false;
    role.canEditRole = createRoleDto.canEditRole ?? false;
    role.canAccessArchive = createRoleDto.canAccessArchive ?? false;
    role.canCreatePriorities = createRoleDto.canCreatePriorities ?? false;
    role.canAddColumns = createRoleDto.canAddColumns ?? false;
    role.canAddTasks = createRoleDto.canAddTasks ?? false;
    role.canInviteUsers = createRoleDto.canInviteUsers ?? false;

    role.boardId = board.id;
    await role.save();
    console.log(role);
    return role;
  }

  async changeRole(roleId: number, updateRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.findByPk(roleId);

    role.canCreateRole = updateRoleDto.canCreateRole ?? false;
    role.canEditRole = updateRoleDto.canEditRole ?? false;
    role.canAccessArchive = updateRoleDto.canAccessArchive ?? false;
    role.canCreatePriorities = updateRoleDto.canCreatePriorities ?? false;
    role.canAddColumns = updateRoleDto.canAddColumns ?? false;
    role.canAddTasks = updateRoleDto.canAddTasks ?? false;
    role.canInviteUsers = updateRoleDto.canInviteUsers ?? false;

    await role.save();

    return role;
  }
  async deleteRoleByRoleId(roleId: number) {
    const role = await Role.findByPk(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }
  
    // Update roleId to null for users associated with the deleted role
    await UserBoards.update({ roleId: null }, { where: { roleId } });
  
    // Delete the role
    await role.destroy();
  
    return { message: "Role deleted successfully" };
  }
}
