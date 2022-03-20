import { Permission } from '../entities/Permission';

export class CreatePermissionDto {
  textId: number;
  permission: Permission;
  userId: number;
}
