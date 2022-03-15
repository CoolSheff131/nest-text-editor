import { IsEmail, Length } from 'class-validator';
import { UniqueOnDatabase } from 'src/auth/validations/UniqueValidation';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto {
  @Length(3, 32, { message: 'Минимум 3' })
  fullname: string;

  @IsEmail(undefined, { message: 'Неверная почта' })
  @UniqueOnDatabase(UserEntity, { message: 'Такая почта уже занята' })
  email: string;

  @Length(6, 32, { message: 'Минимум 6' })
  password?: string;
}
