import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class MoobotService {
    constructor(private readonly prismaService: PrismaService) {}

    async getHello() {
        return this.prismaService.test.findMany()
    }
}
