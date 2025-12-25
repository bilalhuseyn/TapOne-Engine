import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Currency, TransactionType, TransactionStatus } from '@prisma/client';

@Injectable()
export class WalletService {
    constructor(private prisma: PrismaService) { }

    async fundAccount(userId: string, currency: Currency, amount: number) {
        const amountDecimal = amount; // Prisma handles number to Decimal conversion usually, or we pass string/Decimal.
        // However, the schema uses Decimal. Let's start transaction.

        return this.prisma.$transaction(async (tx) => {
            // 1. Ensure account exists (Upsert)
            const account = await tx.account.upsert({
                where: {
                    userId_currency: {
                        userId,
                        currency,
                    },
                },
                update: {},
                create: {
                    userId,
                    currency,
                    balance: 0,
                    lockedBalance: 0,
                },
            });

            // 2. Increment balance
            const updatedAccount = await tx.account.update({
                where: { id: account.id },
                data: {
                    balance: { increment: amountDecimal },
                },
            });

            // 3. Create Transaction record
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    idempotencyKey: `deposit-${Date.now()}-${Math.random()}`, // Simple idempotency for now
                    type: TransactionType.DEPOSIT,
                    status: TransactionStatus.COMPLETED,
                    amountIn: amountDecimal,
                    amountOut: 0,
                    feeAmount: 0,
                },
            });

            // 4. Create Ledger record
            await tx.ledger.create({
                data: {
                    transactionId: transaction.id,
                    accountId: updatedAccount.id,
                    amount: amountDecimal,
                    balanceAfter: updatedAccount.balance,
                },
            });

            return updatedAccount.balance;
        });
    }

    async getBalances(userId: string) {
        const accounts = await this.prisma.account.findMany({
            where: { userId },
        });
        return accounts.reduce((acc, account) => {
            acc[account.currency] = account.balance;
            return acc;
        }, {} as Record<Currency, any>); // Using any for Decimal to JSON serialization usually handled by Nest/ClassValidator or just sent as string/number
    }

    async getUserTransactions(userId: string) {
        const transactions = await this.prisma.transaction.findMany({
            where: { userId },
            include: {
                ledgers: {
                    include: {
                        account: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });

        return transactions.map((tx) => {
            let currency = 'AZN'; // Fallback
            let amount = tx.amountIn;
            let sign = '+';

            if (tx.type === 'DEPOSIT') {
                const depositLedger = tx.ledgers.find((l) => l.amount.toNumber() > 0);
                if (depositLedger) {
                    currency = depositLedger.account.currency;
                    amount = depositLedger.amount;
                }
                sign = '+';
            } else if (tx.type === 'BUY') {
                currency = 'USDT';
                amount = tx.amountOut;
                sign = '+';
            } else if (tx.type === 'SELL') {
                currency = 'USDT';
                amount = tx.amountIn;
                sign = '-';
            }

            return {
                id: tx.id,
                type: tx.type,
                status: tx.status,
                amount: amount,
                currency: currency,
                sign: sign,
                createdAt: tx.createdAt,
            };
        });
    }

    async getSystemTreasury() {
        const aggregate = await this.prisma.transaction.aggregate({
            _sum: {
                feeAmount: true,
            },
            where: {
                status: 'COMPLETED',
            },
        });

        return {
            totalRevenueAZN: aggregate._sum.feeAmount || 0,
        };
    }

    getMarketPrice() {
        const min = 1.6800;
        const max = 1.7200;
        const price = Math.random() * (max - min) + min;
        return { price: price };
    }
}
