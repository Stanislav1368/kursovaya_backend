export class CreateRoleDto {
  readonly name: string;

  readonly canEditBoardInfo: boolean;

  readonly canAddColumns: boolean;

  readonly canAddUsers: boolean;

  readonly canAddPriorities: boolean;

  readonly canCreateRoles: boolean;

  readonly canAccessStatistics: boolean;

  readonly canCreateReports: boolean;

  readonly canAccessArchive: boolean;
}


