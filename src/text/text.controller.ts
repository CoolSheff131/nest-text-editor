import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { CreateTextDto } from './dto/create-text.dto';
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
  @Post()
  create(@User() userId: number, @Body() createTextDto: CreateTextDto) {
    return this.textService.create(createTextDto, userId);
  }

  @Get('me')
  getMe() {
    return 'this.textService.getMine(userId)';
  }
}
