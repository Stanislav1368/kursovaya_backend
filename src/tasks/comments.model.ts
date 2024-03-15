
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Task } from "./tasks.model";
import { User } from "src/users/user.model";

@Table({ tableName: "comments", createdAt: false, updatedAt: false }) 
export class Comments extends Model<Comments> { 
  @Column({ 
    type: DataType.INTEGER, 
    autoIncrement: true, 
    primaryKey: true, 
  }) 
  id: number; 
 
  @ForeignKey(() => User) 
  @Column({ type: DataType.INTEGER, allowNull: true, unique: false }) 
  userId: number; 
 
  @ForeignKey(() => Task) 
  @Column({ type: DataType.INTEGER, allowNull: true, unique: false })
  taskId: number; 
 
  @Column({ type: DataType.STRING, allowNull: true })
  comment: string;
}