import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RightAssignmentTokensService } from './right-assignment-tokens.service';
import { CreateRightAssignmentTokenDto } from './dto/create-right-assignment-token.dto';
import { UpdateRightAssignmentTokenDto } from './dto/update-right-assignment-token.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('right-assignment-tokens')
export class RightAssignmentTokensController {
  constructor(
    private readonly rightAssignmentTokensService: RightAssignmentTokensService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('activate/:id')
  activate(@User() userId: number, @Param('id') id: number) {
    return this.rightAssignmentTokensService.activate(userId, id);
  }
  @Post()
  create(@Body() createRightAssignmentTokenDto: CreateRightAssignmentTokenDto) {
    return this.rightAssignmentTokensService.create(
      createRightAssignmentTokenDto,
    );
  }

  @Get()
  findAll() {
    return this.rightAssignmentTokensService.findAll();
  }

  @Get('text/:id')
  findTokensForText(@Param('id') id: string) {
    return this.rightAssignmentTokensService.findForText(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rightAssignmentTokensService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRightAssignmentTokenDto: UpdateRightAssignmentTokenDto,
  ) {
    return this.rightAssignmentTokensService.update(
      +id,
      updateRightAssignmentTokenDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rightAssignmentTokensService.remove(id);
  }
}
