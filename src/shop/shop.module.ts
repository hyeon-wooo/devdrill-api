import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { ProductEntity } from './infra/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './app/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ShopController],
  providers: [ShopService, ProductService],
})
export class ShopModule {}
