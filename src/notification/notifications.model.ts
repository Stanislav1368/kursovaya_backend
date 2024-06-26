import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Board } from "src/boards/boards.model";
import { UserBoards } from "src/boards/user-boards.model";
import { State } from "src/states/states.model";
import { Task } from "src/tasks/tasks.model";
import { User } from "src/users/user.model";

interface NotifCreationAttr {
  title: string;
  message: string;
}
@Table({ tableName: "notifications" })
export class Notification extends Model<Notification, NotifCreationAttr> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  message: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  userId: number;

  @BelongsTo(() => Task, { onDelete: "CASCADE" })
  task: Task;

  @ForeignKey(() => Task)
  @Column({ type: DataType.INTEGER, allowNull: true })
  taskId: number;

  @BelongsTo(() => Board, { onDelete: "CASCADE" })
  board: Board;

  @ForeignKey(() => Board)
  @Column({ type: DataType.INTEGER, allowNull: true })
  boardId: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  isRead: boolean;
}
