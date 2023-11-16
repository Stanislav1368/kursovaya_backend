import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model,Table } from "sequelize-typescript";
import { Board } from "src/boards/boards.model";
import { Task } from "src/tasks/tasks.model";



interface StateCreationAttr {
    title: string;
}

@Table({tableName: 'states'})
export class State extends Model<State, StateCreationAttr> {
    @Column({type:DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type:DataType.STRING, allowNull: false})    
    title: string;

    @BelongsTo(() => Board, { onDelete: 'CASCADE' })
    board: Board;

    @ForeignKey(() => Board)
    @Column({ type: DataType.INTEGER, allowNull: true })
    boardId: number;

    @HasMany(() => Task)
    tasks: Task[];

}