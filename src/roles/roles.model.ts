import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Board } from "src/boards/boards.model";
import { UserBoards } from "src/boards/user-boards.model";
import { State } from "src/states/states.model";

interface RoleCreationAttr {
  name: string;

  canEditBoardInfo: boolean;

  canAddColumns: boolean;

  canAddUsers: boolean;

  canAddPriorities: boolean;

  canCreateRoles: boolean;

  canAccessStatistics: boolean;

  canCreateReports: boolean;

  canAccessArchive: boolean;
}

@Table({ tableName: "roles" })
export class Role extends Model<Role, RoleCreationAttr> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canEditBoardInfo: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canAddColumns: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canAddUsers: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canAddPriorities: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canCreateRoles: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canAccessStatistics: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canCreateReports: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  canAccessArchive: boolean;

  @BelongsTo(() => Board)
  board: Board;

  @ForeignKey(() => Board)
  @Column({ type: DataType.INTEGER, allowNull: true })
  boardId: number;

  @HasMany(() => UserBoards)
  userBoards: UserBoards[];
}
