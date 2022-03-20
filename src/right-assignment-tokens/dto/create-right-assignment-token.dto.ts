import { Permission } from 'src/permissions/entities/Permission';

export class CreateRightAssignmentTokenDto {
  textId: number;
  permission: Permission;
}
