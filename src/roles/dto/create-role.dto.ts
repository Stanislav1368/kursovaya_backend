export class CreateRoleDto {
    readonly name: string;
    readonly isRead: boolean;
    readonly isCreate: boolean;
    readonly isDelete: boolean;
}