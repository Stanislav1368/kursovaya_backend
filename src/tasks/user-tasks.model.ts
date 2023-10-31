import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Task } from "./tasks.model";
import { User } from "src/users/user.model";

@Table({ tableName: "user-tasks", createdAt: false, updatedAt: false })
export class UserTasks extends Model<UserTasks> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  userId: number;

  @ForeignKey(() => Task)
  @Column({ type: DataType.INTEGER, allowNull: true })
  taskId: number;
}
