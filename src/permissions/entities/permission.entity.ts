import { TextEntity } from 'src/text/entities/text.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permission: string;

  @ManyToOne(() => UserEntity, (user) => user.permissions)
  user: UserEntity;

  @ManyToOne(() => TextEntity, (text) => text.permission)
  text: TextEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
