import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Currency } from '@prisma/client';

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Post('faucet')
    async fundAccount(
        @Body() body: { userId: string; currency: Currency; amount: number },
    ) {
        return this.walletService.fundAccount(
            body.userId,
            body.currency,
            body.amount,
        );
    }

    @Get('balance/:userId')
    async getBalance(@Param('userId') userId: string) {
        return this.walletService.getBalances(userId);
    }

    @Get('transactions/:userId')
    async getTransactions(@Param('userId') userId: string) {
        return this.walletService.getUserTransactions(userId);
    }

    @Get('treasury')
    async getTreasury() {
        return this.walletService.getSystemTreasury();
    }

    @Get('price')
    async getPrice() {
        return this.walletService.getMarketPrice();
    }
}
