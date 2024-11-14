import { Module } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { PrismaUtil } from 'src/utils/prisma.util'
import { HarassmentPhraseController } from './harasment-phrase.controller'
import { HarassmentPhraseService } from './harasment-phrase.service'

@Module({
  controllers: [HarassmentPhraseController],
  providers: [HarassmentPhraseService, PrismaService, PrismaUtil],
  exports: [HarassmentPhraseService],
})
export class HarassmentPhraseModule {}
