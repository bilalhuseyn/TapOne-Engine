import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [TradeController],
    providers: [TradeService, PrismaService],
})
export class TradeModule { }
