import { Controller, Post, Logger } from '@nestjs/common';
import axios from 'axios';

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name);

    // Core Engine Adresi
    private readonly CORE_ENGINE_URL = 'http://localhost:3000/trade/buy';

    @Post('trigger-test')
    async triggerTest() {
        this.logger.log('🚀 TEST BAŞLATILIYOR: Ahmet kripto alıyor...');

        // Seed işleminden gelen User ID (Senin ekran görüntündeki ID)
        // Eğer veritabanını sıfırlarsan burayı güncellemen gerekebilir.
        const TEST_USER_ID = 'da4a1026-fae3-4a44-9f76-9b46b4c779c0';
        const AMOUNT = 100; // 100 AZN'lik alım

        try {
            this.logger.log(`📡 Core Engine'e istek atılıyor: ${this.CORE_ENGINE_URL}`);

            const response = await axios.post(this.CORE_ENGINE_URL, {
                userId: TEST_USER_ID,
                amount: AMOUNT
            });

            this.logger.log('✅ İŞLEM BAŞARILI! Gelen Yanıt:');
            this.logger.log(response.data);
            return response.data;

        } catch (error) {
            this.logger.error('❌ İŞLEM BAŞARISIZ OLDU!');
            if (error.response) {
                this.logger.error(`Hata Detayı: ${JSON.stringify(error.response.data)}`);
                return error.response.data;
            }
            this.logger.error(error.message);
            return { error: error.message };
        }
    }
}