import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
    @ApiProperty({ description: 'Order ID of the payment' })
    @IsNotEmpty()
    @IsString()
    orderId: string;

    @ApiProperty({ description: 'Amount to be paid', example: 50000 })
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty({ description: 'Description of the order' })
    @IsNotEmpty()
    @IsString()
    orderDescription: string;
}
