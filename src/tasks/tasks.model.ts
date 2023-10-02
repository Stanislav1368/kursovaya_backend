import { BelongsTo, Column, DataType, ForeignKey, Model,Table } from "sequelize-typescript";
import { Board } from "src/boards/boards.model";
import { State } from "src/states/states.model";


interface TaskCreationAttr {
    title: string;
    description: string;
}

@Table({tableName: 'tasks'})
export class Task extends Model<Task, TaskCreationAttr> {
    @Column({type:DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type:DataType.STRING, allowNull: false})    
    title: string;

    @Column({type:DataType.STRING, allowNull: false})    
    description : string;

    @BelongsTo(() => State)
    state: State;

    @ForeignKey(() => State)
    @Column({ type: DataType.INTEGER, allowNull: true })
    stateId: number;

}