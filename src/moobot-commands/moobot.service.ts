import { Injectable } from '@nestjs/common'
import { createHash } from 'crypto'
import { Configuration, OpenAIApi } from 'openai'
import { PrismaService } from './prisma/prisma.service'

@Injectable()
export class MoobotService {
    constructor(private readonly prismaService: PrismaService) {}

    ask(options: { question: string; random: boolean; fullAnswer: boolean }): string {
        const answer =
            options.random == true
                ? Math.random() >= 0.5
                : createHash('sha256')
                      .update(options.question.toLowerCase())
                      .digest('hex')
                      .replace(/[^\d]/g, '')
                      .split('')
                      .map(parseFloat)
                      .reduce((acc, value) => acc + value) %
                      2 ==
                  0

        return options.fullAnswer
            ? `Ответ на вопрос ${options.question} - ${answer ? 'Да' : 'Нет'}`
            : `${answer ? 'Да' : 'Нет'}`
    }

    async gpt(options: { question: string; key: string }): Promise<string | undefined> {
        const openai = new OpenAIApi(new Configuration({ apiKey: options.key }))
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 0.3,
            messages: [{ role: 'user', content: options.question }]
        })
        return response.data.choices.at(0)?.message?.content
    }
}
