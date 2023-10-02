import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Board } from "./boards.model";
import { User } from "src/users/user.model";

@Table({ tableName: "user-boards", createdAt: false, updatedAt: false})
export class UserBoards extends Model<UserBoards> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;   

  @Column({type:DataType.BOOLEAN, allowNull: false})    
  isOwner: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  userId: number;

  @ForeignKey(() => Board)
  @Column({ type: DataType.INTEGER, allowNull: true })
  boardId: number;
}
