import { 
    ClassSerializerInterceptor, 
    Controller, Get, Post, Query, Res, 
    UseGuards, 
    UseInterceptors 
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrderService } from './order.service';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { Order } from './order-entity';
import { OrderItem } from './order-item.entity';
import { HasPermission } from 'src/permission/has-permission.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@HasPermission('users')
@Controller()
export class OrderController {
    constructor(private orderService: OrderService) {
    }
    @Get('orders')
    @HasPermission('orders')
    async all(@Query('page') page = 1) {
        //return this.orderService.all(['order_items'])
        return this.orderService.paginate(page, ['order_items']);
    }

    @Post('export')
    @HasPermission('orders') 
    async export(@Res() res: Response) {
        const parser = new Parser({
            fields: ['Id', 'Name', 'Email', 'Product Title', 'Quantity']
        });

        const orders = await this.orderService.all(['order_items']);

        const json = []

        orders.forEach((o: Order) => {
            json.push({
                ID: o.id,
                Name: o.name,
                Email: o.email,
                'Product Title': '',
                Price: '',
                Quantity: ''
            });

            o.order_items.forEach((i: OrderItem) => {
                json.push({
                    ID: o.id,
                    Name: o.name,
                    Email: o.email,
                    'Product Title': i.product_title,
                    Price: i.price,
                    Quantity: i.quantity
                });
            })
        });

        const csv = parser.parse(json);
        res.header('Content-Type', 'text/csv');
        res.attachment('orders.csv');
        return res.send(csv);
    }

    @Get('chart')
    @HasPermission('orders')
    async chart() {
        return this.orderService.chart();
    }
}
