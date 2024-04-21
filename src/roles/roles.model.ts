import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Board } from "src/boards/boards.model";
import { UserBoards } from "src/boards/user-boards.model";
import { State } from "src/states/states.model";

interface RoleCreationAttr {
  name: string;
}

@Table({ tableName: "roles" })
export class Role extends Model<Role, RoleCreationAttr> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canCreateRole: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canEditRole: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canAccessArchive: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canCreatePriorities: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canAddColumns: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canAddTasks: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canInviteUsers: boolean;

  @BelongsTo(() => Board)
  board: Board;

  @ForeignKey(() => Board)
  @Column({ type: DataType.INTEGER, allowNull: true })
  boardId: number;

  @HasMany(() => UserBoards)
  userBoards: UserBoards[];
}
