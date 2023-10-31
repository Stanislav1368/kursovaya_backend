
import { BelongsTo, Column, DataType, ForeignKey, Model, Table, BelongsToMany } from "sequelize-typescript";
import { Board } from "src/boards/boards.model";
import { UserBoards } from "src/boards/user-boards.model";
import { Task } from "src/tasks/tasks.model";
import { UserTasks } from "src/tasks/user-tasks.model";



interface UserCreationAttr {
    email: string;
    password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttr> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  banReason: string;

  @Column({ type: DataType.STRING, allowNull: true })
  image: string; 

  @BelongsToMany(() => Board, () => UserBoards)
  boards: Board[];

  @BelongsToMany(() => Task, () => UserTasks)
  tasks: Task[];

}