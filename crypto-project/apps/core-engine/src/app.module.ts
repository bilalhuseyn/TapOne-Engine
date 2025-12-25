import { Module } from '@nestjs/common';
import { TradeModule } from './trade/trade.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
    imports: [TradeModule, WalletModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
