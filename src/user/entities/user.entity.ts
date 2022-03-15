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

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @OneToMany(() => TextEntity, (text) => text.user)
  texts: TextEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
