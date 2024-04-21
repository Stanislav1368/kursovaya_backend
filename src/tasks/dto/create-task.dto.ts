export class CreateTaskDto {
    readonly title: string;
    readonly description: string;
    readonly userIds: number[];   
    readonly priorityId: number;
    readonly dates: Date[];
    readonly dependentTaskId: number;
    readonly hours: number;
}