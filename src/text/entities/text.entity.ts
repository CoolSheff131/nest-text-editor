import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { RightAssignmentTokenEntity } from 'src/right-assignment-tokens/entities/right-assignment-token.entity';
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

  @Column({
    type: 'text',
    unique: true,
    nullable: true,
  })
  previewUrl: string | null;

  @ManyToOne(() => UserEntity, (user) => user.texts, { eager: true })
  user: UserEntity;

  @OneToMany(() => PermissionEntity, (permission) => permission.text, {
    onDelete: 'CASCADE',
  })
  permissions: PermissionEntity[];

  @OneToMany(
    () => RightAssignmentTokenEntity,
    (rightAssignmentTokenEntity) => rightAssignmentTokenEntity.text,
    {
      onDelete: 'CASCADE',
    },
  )
  rightAssignmentTokenEntity: RightAssignmentTokenEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
