import { Permission } from 'src/permissions/entities/Permission';
import { TextEntity } from 'src/text/entities/text.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity('right_assignment_tokens')
export class RightAssignmentTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  token: string;

  @ManyToOne(() => TextEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'textId' })
  text: TextEntity;

  @Column()
  permission: Permission;

  @Column({ default: false, nullable: false })
  isConstant: boolean;
}
