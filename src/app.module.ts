import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MoobotModule } from './moobot-commands/moobot.module'

@Module({
    imports: [MoobotModule, ConfigModule.forRoot()],
    controllers: [],
    providers: []
})
export class AppModule {}
