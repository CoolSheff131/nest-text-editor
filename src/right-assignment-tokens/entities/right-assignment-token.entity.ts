import { Permission } from 'src/permissions/entities/Permission';
import { TextEntity } from 'src/text/entities/text.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('right_assignment_tokens')
export class RightAssignmentTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @OneToOne(() => TextEntity)
  @JoinColumn()
  text: TextEntity;

  @Column()
  permission: Permission;
}
