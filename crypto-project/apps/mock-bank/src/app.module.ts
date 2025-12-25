import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
    imports: [],
    controllers: [AppController], // <-- İşte buraya ekledik!
    providers: [],
})
export class AppModule { }