import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Board } from "src/boards/boards.model";
import { State } from "src/states/states.model";
import { User } from "src/users/user.model";
import { UserTasks } from "./user-tasks.model";
import { Priority } from "src/priorities/priorities.model";

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

  @BelongsTo(() => State, { onDelete: 'CASCADE' })
  state: State;

  @Column({ type: DataType.INTEGER, allowNull: true })
  order: number;

  @Column({ type: DataType.DATE, allowNull: true }) 
  startDate: Date

  @Column({ type: DataType.DATE, allowNull: true }) 
  endDate: Date;

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
}
