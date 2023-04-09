import { Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { MoobotService } from './moobot.service'

@Controller()
@ApiTags('Команды')
export class MoobotController {
    constructor(private readonly moobotService: MoobotService) {}

    @Get('ask')
    @ApiOperation({ summary: 'Ответить на вопрос да или нет' })
    @ApiOkResponse({
        schema: {
            type: 'string',
            example: 'Ответ на вопрос команда крутая? - Да'
        },
        description: 'Ответ на вопрос'
    })
    @ApiQuery({
        name: 'full-answer',
        description:
            "Использовать полный ответ на вопрос по шаблону: 'Ответ на вопрос ${question} - ${answer}' (по умолчанию true)",
        type: Boolean,
        required: false,
        example: true
    })
    @ApiQuery({
        name: 'random',
        description: 'Отвечать на вопрос рандомно, или всегда отвечать на одинаковые вопросы одинаково (по умолчанию true)',
        type: Boolean,
        required: false,
        example: false
    })
    @ApiQuery({
        name: 'question',
        description: 'Текст вопроса',
        type: String,
        required: true,
        example: 'команда крутая?'
    })
    ask(
        @Query('question') question: string,
        @Query('random') random: boolean,
        @Query('full-answer') fullAnswer: boolean
    ): string {
        return this.moobotService.ask({
            question: question,
            random: random ?? true,
            fullAnswer: fullAnswer ?? true
        })
    }

    @Get('gpt')
    @ApiOperation({ summary: 'Задать вопрос ChatGPT' })
    @ApiOkResponse({
        schema: {
            type: 'string',
            example: 'Привет! Чем я могу Вам помочь?'
        },
        description: 'Ответ на вопрос'
    })
    @ApiQuery({
        name: 'question',
        description: 'Текст вопроса',
        type: String,
        required: true,
        example: 'Привет'
    })
    @ApiQuery({
        name: 'key',
        description: 'OpenAI API Key',
        type: String,
        required: true,
        example: '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'
    })
    async gpt(@Query('question') question: string, @Query('key') key: string): Promise<string | undefined> {
        return await this.moobotService.gpt({ question, key })
    }
}
