export class CreateTaskDto {
    readonly title: string;
    readonly description: string;
    readonly userIds: number[];   
    readonly priorityId: number;
    readonly startDate: Date;
    readonly endDate: Date;
}