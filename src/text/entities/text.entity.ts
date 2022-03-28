import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('texts')
export class TextEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.texts)
  user: UserEntity;

  @OneToMany(() => PermissionEntity, (permission) => permission.text, {
    onDelete: 'CASCADE',
  })
  permissions: PermissionEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
