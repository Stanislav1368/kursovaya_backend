import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from 'src/tasks/tasks.model';
import { File } from './file.model';

@Module({
  providers: [FileService],
  controllers: [FileController],
  imports: [SequelizeModule.forFeature([Task, File])],
  exports: [FileService],
})
export class FileModule {}
