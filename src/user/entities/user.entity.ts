import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { TextEntity } from 'src/text/entities/text.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @OneToMany(() => TextEntity, (text) => text.user, { onDelete: 'CASCADE' })
  texts: TextEntity[];

  @OneToMany(() => PermissionEntity, (permission) => permission.user, {
    onDelete: 'CASCADE',
  })
  permissions: PermissionEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
