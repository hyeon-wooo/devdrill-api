import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './app/product.service';
import { sendSuccessRes } from 'src/common/generateResponse';

@Controller('shop')
export class ShopController {
  constructor(private readonly productService: ProductService) {}

  @Get('/product')
  async getProducts(@Query('platform') platform: 'ios' | 'android') {
    const products = await this.productService.findAvailableProducts(platform);
    return sendSuccessRes({ list: products });
  }
}
