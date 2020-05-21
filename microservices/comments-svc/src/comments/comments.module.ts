import { Module } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'
import { SequelizeModule } from '@nestjs/sequelize'

import { Comment } from './comment.model'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'

@Module({
  imports: [LoggerModule, SequelizeModule.forFeature([Comment])],
  providers: [{ provide: 'CommentsService', useClass: CommentsService }],
  controllers: [CommentsController]
})
export class CommentsModule {}
