import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Board } from "src/boards/boards.model";


interface PriorityCreationAttr {
  name: string;
  color: string;
}

@Table({ tableName: "priorities" })
export class Priority extends Model<Priority, PriorityCreationAttr> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;



  @Column({ type: DataType.STRING, allowNull: false })
  color: string;

  @BelongsTo(() => Board)
  board: Board;

  @ForeignKey(() => Board)
  @Column({ type: DataType.INTEGER, allowNull: true })
  boardId: number;

}
