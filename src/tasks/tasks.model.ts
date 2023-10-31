import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model,Table } from "sequelize-typescript";
import { Board } from "src/boards/boards.model";
import { State } from "src/states/states.model";
import { User } from "src/users/user.model";
import { UserTasks } from "./user-tasks.model";
import { Priority } from "src/priorities/priorities.model";


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

    @BelongsToMany(() => User, () => UserTasks)
    users: User[];

    @BelongsTo(() => Priority)
    priority: Priority;
  
    @ForeignKey(() => Priority)
    @Column({ type: DataType.INTEGER, allowNull: true })
    priorityId: number;
}