import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RightAssignmentTokensService } from './right-assignment-tokens.service';
import { CreateRightAssignmentTokenDto } from './dto/create-right-assignment-token.dto';
import { UpdateRightAssignmentTokenDto } from './dto/update-right-assignment-token.dto';

@Controller('right-assignment-tokens')
export class RightAssignmentTokensController {
  constructor(private readonly rightAssignmentTokensService: RightAssignmentTokensService) {}

  @Post()
  create(@Body() createRightAssignmentTokenDto: CreateRightAssignmentTokenDto) {
    return this.rightAssignmentTokensService.create(createRightAssignmentTokenDto);
  }

  @Get()
  findAll() {
    return this.rightAssignmentTokensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rightAssignmentTokensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRightAssignmentTokenDto: UpdateRightAssignmentTokenDto) {
    return this.rightAssignmentTokensService.update(+id, updateRightAssignmentTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rightAssignmentTokensService.remove(+id);
  }
}
