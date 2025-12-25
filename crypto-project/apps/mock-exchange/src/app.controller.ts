import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get('ticker')
    getTicker() {
        return this.appService.getTicker();
    }

    @Post('order')
    createOrder(@Body() orderDto: any) {
        return this.appService.placeOrder(orderDto);
    }
}
