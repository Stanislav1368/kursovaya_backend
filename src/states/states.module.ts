import { Module } from '@nestjs/common';
import { StatesService } from './states.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { Board } from 'src/boards/boards.model';
import { State } from './states.model';
import { StatesController } from './states.controller';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  providers: [StatesService],
  controllers: [StatesController],
  imports: [
    SequelizeModule.forFeature([User, Board, State]),
    TasksModule
  ]
})
export class StatesModule {}
