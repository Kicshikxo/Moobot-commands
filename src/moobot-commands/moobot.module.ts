import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { MoobotController } from './moobot.controller'
import { MoobotService } from './moobot.service'

@Module({
    imports: [],
    controllers: [MoobotController],
    providers: [MoobotService, PrismaService]
})
export class MoobotModule {}
