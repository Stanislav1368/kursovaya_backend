export class UpdateTaskDto {
    readonly newStateId: number;
    readonly isCompleted: boolean;
    readonly isArchived: boolean;
}