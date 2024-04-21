import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Board } from "src/boards/boards.model";
import { State } from "src/states/states.model";
import { User } from "src/users/user.model";
import { UserTasks } from "./user-tasks.model";
import { Priority } from "src/priorities/priorities.model";
import { Comments } from "./comments.model";
import { SubTask } from "src/subtasks/subtasks.model";
import { Notification } from "src/notification/notifications.model";
import { File } from "src/file/file.model";

interface TaskCreationAttr {
  title: string;
  description: string;
}

@Table({ tableName: "tasks" })
export class Task extends Model<Task, TaskCreationAttr> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isCompleted: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isArchived: boolean;

  @BelongsTo(() => State, { onDelete: "CASCADE" })
  state: State;

  @Column({ type: DataType.INTEGER, allowNull: true })
  order: number;

  @Column({ type: DataType.DATE, allowNull: true })
  startDate: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  endDate: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  actualEndDate: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  hours: number;

  @ForeignKey(() => Task)
  @Column({ type: DataType.INTEGER, allowNull: true })
  dependentTaskId: number;

  @BelongsTo(() => Task, { as: "dependentTask", foreignKey: "dependentTaskId" })
  parentTask: Task;

  @ForeignKey(() => State)
  @Column({ type: DataType.INTEGER, allowNull: true })
  stateId: number;

  @BelongsToMany(() => User, () => UserTasks)
  users: User[];

  @BelongsTo(() => Priority)
  priority: Priority;

  @ForeignKey(() => Priority)
  @Column({ type: DataType.INTEGER, allowNull: true })
  priorityId: number;

  @HasMany(() => SubTask)
  subTasks: SubTask[];

  @HasMany(() => File)
  files: File[];

  @HasMany(() => Notification)
  notifications: Notification[];
}
