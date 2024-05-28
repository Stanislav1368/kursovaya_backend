import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Board } from "./boards.model";
import { User } from "src/users/user.model";
import { Role } from "src/roles/roles.model";

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

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  favorite: boolean;

  @BelongsTo(() => Role)
  role: Role;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: true })
  roleId: number;
}
