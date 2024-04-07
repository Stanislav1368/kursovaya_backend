import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Task } from "src/tasks/tasks.model";


interface SubTaskCreationAttr {
  title: string;
}

@Table({ tableName: "subtasks" })
export class SubTask extends Model<SubTask, SubTaskCreationAttr> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isCompleted: boolean;

  @BelongsTo(() => Task, { onDelete: "CASCADE" })
  task: Task;

  @ForeignKey(() => Task)
  @Column({ type: DataType.INTEGER, allowNull: true })
  taskId: number;
}
