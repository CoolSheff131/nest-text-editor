import { PartialType } from '@nestjs/mapped-types';
import { CreateRightAssignmentTokenDto } from './create-right-assignment-token.dto';

export class UpdateRightAssignmentTokenDto extends PartialType(CreateRightAssignmentTokenDto) {}
