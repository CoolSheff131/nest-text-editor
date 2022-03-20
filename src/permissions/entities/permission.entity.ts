import { TextEntity } from 'src/text/entities/text.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './Permission';

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permission: Permission;

  @ManyToOne(() => UserEntity, (user) => user.permissions)
  user: UserEntity;

  @ManyToOne(() => TextEntity, (text) => text.permissions)
  text: TextEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
