import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import axios from 'axios';

@Injectable()
export class TradeService {
    constructor(private prisma: PrismaService) { }

    // MOCK EXCHANGE URL
    private readonly EXCHANGE_API = 'http://127.0.0.1:3000';

    // --- SIMULATED PRICE GENERATOR ---
    private generateSimulatedPrice(): Decimal {
        const min = 1.6800;
        const max = 1.7200;
        const price = Math.random() * (max - min) + min;
        return new Decimal(price);
    }

    // --- ALIM (BUY) İŞLEMİ ---
    async executeBuy(userId: string, amountInUSDT: number) {
        const amount = new Decimal(amountInUSDT);

        // 1. Fiyatı Çek
        // let priceData;
        // try {
        //     const response = await axios.get(`${this.EXCHANGE_API}/ticker?symbol=AZNUSDT`);
        //     priceData = response.data;
        // } catch (e) {
        //     console.error(e);
        //     throw new InternalServerErrorException('Borsa Fiyatı Alınamadı');
        // }

        const marketPrice = this.generateSimulatedPrice();
        console.log(`[TradeService] Buy Execution Price: ${marketPrice.toFixed(4)}`);
        // const marketPrice = new Decimal(priceData.price);
        // %1.5 Komisyonlu Alış Fiyatı (Pahalıdan satıyoruz)
        const executionPrice = marketPrice.mul(1.015);

        // Cost in AZN
        const totalCost = amount.mul(executionPrice); // User pays this
        const rawCost = amount.mul(marketPrice); // Real value
        const feeValue = totalCost.minus(rawCost);

        // 2. ACID Transaction
        return await this.prisma.$transaction(async (tx) => {
            // a. AZN Bakiyesi Var mı?
            const aznAccount = await tx.account.findFirst({
                where: { userId, currency: 'AZN' },
            });

            if (!aznAccount || aznAccount.balance.lessThan(totalCost)) {
                throw new BadRequestException('Yetersiz AZN Bakiyesi - Cost: ' + totalCost);
            }

            // b. İşlem Kaydı (PENDING)
            const transaction = await tx.transaction.create({
                data: {
                    idempotencyKey: `tx_buy_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                    type: 'BUY',
                    status: 'PENDING',
                    amountIn: totalCost,
                    amountOut: amount,
                    feeAmount: feeValue,
                    // DÜZELTME BURADA: 'User' yerine 'user' (küçük harf)
                    user: { connect: { id: userId } }
                },
            });

            // c. Borsa Emri
            // try {
            //     await axios.post(`${this.EXCHANGE_API}/order`, {
            //         symbol: 'AZNUSDT',
            //         side: 'BUY',
            //         quantity: amount.toNumber(),
            //         type: 'MARKET'
            //     });
            // } catch (e) {
            //     throw new InternalServerErrorException('Borsa Emri Başarısız');
            // }

            // d. Bakiyeleri Güncelle
            const updatedAzn = await tx.account.update({
                where: { id: aznAccount.id },
                data: { balance: { decrement: totalCost } },
            });

            // USDT Hesabını bul veya oluştur
            let usdtAccount = await tx.account.findFirst({ where: { userId, currency: 'USDT' } });
            if (!usdtAccount) {
                usdtAccount = await tx.account.create({
                    data: { userId, currency: 'USDT', balance: new Decimal(0), lockedBalance: new Decimal(0) }
                });
            }

            const updatedUsdt = await tx.account.update({
                where: { id: usdtAccount.id },
                data: { balance: { increment: amount } },
            });

            // e. Defter Kayıtları (Ledger)
            await tx.ledger.create({
                data: { transactionId: transaction.id, accountId: aznAccount.id, amount: totalCost.negated(), balanceAfter: updatedAzn.balance }
            });
            await tx.ledger.create({
                data: { transactionId: transaction.id, accountId: usdtAccount.id, amount: amount, balanceAfter: updatedUsdt.balance }
            });

            // f. Tamamla
            return await tx.transaction.update({
                where: { id: transaction.id },
                data: { status: 'COMPLETED' },
            });
        });
    }

    // --- SATIŞ (SELL) İŞLEMİ [YENİ EKLENDİ] ---
    async executeSell(userId: string, amountInUSDT: number) {
        const amount = new Decimal(amountInUSDT);

        // 1. Fiyatı Çek
        // let priceData;
        // try {
        //     const response = await axios.get(`${this.EXCHANGE_API}/ticker?symbol=AZNUSDT`);
        //     priceData = response.data;
        // } catch (e) {
        //     console.error(e);
        //     throw new InternalServerErrorException('Borsa Fiyatı Alınamadı');
        // }

        const marketPrice = new Decimal(1.70);
        // const marketPrice = new Decimal(priceData.price);

        // 🔥 MÜŞTERİ DOSTU SPREAD: %0.5 
        // Piyasa fiyatının %99.5'inden geri alıyoruz.
        const executionPrice = marketPrice.mul(0.995);

        // Kaç AZN Edecek?
        // USDT * SatışFiyatı = AZN
        const userReceives = amount.mul(executionPrice);
        const rawValue = amount.mul(marketPrice);
        const feeValue = rawValue.minus(userReceives);

        // 2. ACID Transaction
        return await this.prisma.$transaction(async (tx) => {

            // a. USDT Bakiyesi Var mı?
            const usdtAccount = await tx.account.findFirst({
                where: { userId, currency: 'USDT' },
            });

            if (!usdtAccount || usdtAccount.balance.lessThan(amount)) {
                throw new BadRequestException('Yetersiz USDT Bakiyesi');
            }

            // b. İşlem Kaydı (PENDING)
            const transaction = await tx.transaction.create({
                data: {
                    idempotencyKey: `tx_sell_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                    type: 'SELL',
                    status: 'PENDING',
                    amountIn: amount,      // USDT giriyoruz
                    amountOut: userReceives, // AZN çıkıyor
                    feeAmount: feeValue,
                    // DÜZELTME BURADA: 'User' yerine 'user' (küçük harf)
                    user: { connect: { id: userId } }
                },
            });

            // c. Borsa Emri (SATIŞ)
            // try {
            //     await axios.post(`${this.EXCHANGE_API}/order`, {
            //         symbol: 'AZNUSDT',
            //         side: 'SELL',
            //         quantity: amount.toNumber(),
            //         type: 'MARKET'
            //     });
            // } catch (e) {
            //     throw new InternalServerErrorException('Borsa Satış Emri Başarısız');
            // }

            // d. Bakiyeleri Güncelle

            // USDT Düş
            const updatedUsdt = await tx.account.update({
                where: { id: usdtAccount.id },
                data: { balance: { decrement: amount } },
            });

            // AZN Ekle (AZN hesabı kesin vardır ama yine de findFirst yapalım)
            const aznAccount = await tx.account.findFirst({ where: { userId, currency: 'AZN' } });
            const updatedAzn = await tx.account.update({
                where: { id: aznAccount.id },
                data: { balance: { increment: userReceives } },
            });

            // e. Defter Kayıtları (Ledger)
            // USDT Çıkışı
            await tx.ledger.create({
                data: { transactionId: transaction.id, accountId: usdtAccount.id, amount: amount.negated(), balanceAfter: updatedUsdt.balance }
            });
            // AZN Girişi
            await tx.ledger.create({
                data: { transactionId: transaction.id, accountId: aznAccount.id, amount: userReceives, balanceAfter: updatedAzn.balance }
            });

            // f. Tamamla
            return await tx.transaction.update({
                where: { id: transaction.id },
                data: { status: 'COMPLETED' },
            });
        });
    }
}