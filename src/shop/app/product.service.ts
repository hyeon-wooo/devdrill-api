import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { ProductEntity } from '../infra/product.entity';

@Injectable()
export class ProductService extends CRUDService<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity) repo: Repository<ProductEntity>,
  ) {
    super(repo);
  }

  async findAvailableProducts(platform: 'ios' | 'android') {
    return this.findMany({
      where: { platform, isActive: true },
      order: { displayOrder: 'DESC' },
    });
  }
}
