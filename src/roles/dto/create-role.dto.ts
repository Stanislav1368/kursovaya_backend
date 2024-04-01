export class CreateRoleDto {
  readonly name: string;

  readonly canCreateRole: boolean;

  readonly canEditRole: boolean;
  
  readonly canAccessArchive: boolean;
  
  readonly canCreatePriorities: boolean;
  
  readonly canAddColumns: boolean;
  
  readonly canAddTasks: boolean;
  
  readonly canInviteUsers: boolean;
}


