import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Test Kullanıcısı Oluştur (Yoksa ekle, varsa geç)
    const user = await prisma.user.upsert({
        where: { bankCustomerId: 'bank_user_01' },
        update: {},
        create: {
            bankCustomerId: 'bank_user_01',
            kycLevel: 1,
        },
    });

    console.log(`✅ User created: ${user.id} (Bank ID: bank_user_01)`);

    // 2. Bu kullanıcıya 10.000 AZN Bakiye Ekle
    const account = await prisma.account.upsert({
        where: {
            userId_currency: {
                userId: user.id,
                currency: 'AZN',
            },
        },
        update: {
            // Eğer zaten varsa bakiyeyi tekrar 10.000 yap (Testi sıfırlamak için)
            balance: new Decimal(10000)
        },
        create: {
            userId: user.id,
            currency: 'AZN',
            balance: new Decimal(10000),
            lockedBalance: new Decimal(0),
        },
    });

    console.log(`💰 Account loaded with 10,000 AZN`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });