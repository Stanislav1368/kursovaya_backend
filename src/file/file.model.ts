import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Board } from "src/boards/boards.model";
import { UserBoards } from "src/boards/user-boards.model";
import { State } from "src/states/states.model";
import { Task } from "src/tasks/tasks.model";
import { User } from "src/users/user.model";

interface FileCreationAttr {
  name: string;
  path: string;
}
@Table({ tableName: "files" })
export class File extends Model<File, FileCreationAttr> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  path: string;

  @Column({ type: DataType.STRING, allowNull: true })
  type: string;

  @ForeignKey(() => Task)
  @Column({ type: DataType.INTEGER, allowNull: true })
  taskId: number;

  @BelongsTo(() => Task, { onDelete: "CASCADE" })
  task: Task;
}
