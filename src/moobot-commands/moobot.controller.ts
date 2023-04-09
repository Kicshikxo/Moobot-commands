import { Controller, Get } from '@nestjs/common'
import { MoobotService } from './moobot.service'

@Controller()
export class MoobotController {
    constructor(private readonly moobotService: MoobotService) {}

    @Get('/')
    getHello() {
        return this.moobotService.getHello()
    }
}
