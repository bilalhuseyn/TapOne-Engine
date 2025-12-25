import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getTicker(): { symbol: string; price: string; timestamp: number } {
        // Random price between 1.69 and 1.71
        const min = 1.69;
        const max = 1.71;
        const price = (Math.random() * (max - min) + min).toFixed(4);

        return {
            symbol: 'AZNUSDT',
            price: price,
            timestamp: Date.now(),
        };
    }

    placeOrder(dto: any): { orderId: string; status: string; executedPrice: string; executedQty: string } {
        // Determine executed price (mock logic)
        const price = this.getTicker().price;

        return {
            orderId: `ex_${Math.floor(Math.random() * 100000)}`,
            status: 'FILLED',
            executedPrice: price,
            executedQty: dto.quantity || '0.00',
        };
    }
}
