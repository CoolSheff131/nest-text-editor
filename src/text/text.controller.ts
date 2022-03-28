import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';
import { TextService } from './text.service';

@Controller('text')
export class TextController {
  private readonly logger = new Logger();
  constructor(private readonly textService: TextService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getMine(@User() userId: number) {
    return this.textService.getMine(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/shared')
  getShared(@User() userId: number) {
    return this.textService.shared(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User() userId: number, @Body() createTextDto: CreateTextDto) {
    return this.textService.create(createTextDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/edit')
  findOneToEdit(@User() userId: number, @Param('id') id: string) {
    return this.textService.findByIdToEdit(id, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.textService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @User() userId: number,
    @Body() updateTextDto: UpdateTextDto,
  ) {
    return this.textService.update(id, updateTextDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.textService.remove(+id);
  }
}
