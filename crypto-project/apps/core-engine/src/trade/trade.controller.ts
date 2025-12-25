import { Controller, Post, Body } from '@nestjs/common';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
    constructor(private readonly tradeService: TradeService) { }

    // ALIM KAPISI (Zaten vardı)
    @Post('buy')
    async buy(@Body() body: { userId: string; amount: number }) {
        return await this.tradeService.executeBuy(body.userId, body.amount);
    }

    // SATIŞ KAPISI (Bunu eklememişiz, şimdi ekliyoruz) 🚀
    @Post('sell')
    async sell(@Body() body: { userId: string; amount: number }) {
        return await this.tradeService.executeSell(body.userId, body.amount);
    }
}