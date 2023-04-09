import { Module } from '@nestjs/common'
import { MoobotController } from './moobot.controller'
import { MoobotService } from './moobot.service'
import { PrismaService } from './prisma/prisma.service'

@Module({
    imports: [],
    controllers: [MoobotController],
    providers: [MoobotService, PrismaService]
})
export class MoobotModule {}
