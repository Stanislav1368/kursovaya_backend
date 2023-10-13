import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Board } from "src/boards/boards.model";
import { UserBoards } from "src/boards/user-boards.model";
import { State } from "src/states/states.model";

interface RoleCreationAttr {
  name: string;
  isRead: boolean;
  isCreate: boolean;
  isDelete: boolean;
}

@Table({ tableName: "roles" })
export class Role extends Model<Role, RoleCreationAttr> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isRead: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isCreate: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isDelete: boolean;

  @BelongsTo(() => Board)
  board: Board;

  @ForeignKey(() => Board)
  @Column({ type: DataType.INTEGER, allowNull: true })
  boardId: number;

  @HasMany(() => UserBoards)
  userBoards: UserBoards[];
}
