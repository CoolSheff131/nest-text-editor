import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';
import { TextService } from './text.service';
import { v4 as uuidv4 } from 'uuid';
import path, { join } from 'path';
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

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/textImages',
        filename: (req, file, cb) => {
          const extension = file.originalname.split('.').pop();
          const filename = file.originalname.replace(/\s/g, '') + uuidv4();
          cb(null, `${filename}.${extension}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file) {
    return { url: `http://localhost:3000/text/image/${file.filename}` };
  }

  @Get('image/:imagename')
  getImage(@Param('imagename') imagename, @Res() res) {
    return res.sendFile(join(process.cwd(), 'uploads/textImages/' + imagename));
  }
}
