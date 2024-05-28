import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "src/users/user.model";
import { UserBoards } from "./user-boards.model";
import { State } from "src/states/states.model";
import { Role } from "src/roles/roles.model";
import { Priority } from "src/priorities/priorities.model";
import { Notification } from "src/notification/notifications.model";

interface BoardCreationAttr {
  title: string;
}

@Table({ tableName: "boards" })
export class Board extends Model<Board, BoardCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @BelongsToMany(() => User, () => UserBoards)
  users: User[];

  @HasMany(() => State)
  states: State[];

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isArchived: boolean;

  @HasMany(() => Priority)
  priorities: Priority[];

  @HasMany(() => Notification)
  notifications: Notification[];
}
