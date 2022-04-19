import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './products.entity';
import { PaginatedResult } from './../common/paginated-result.interface';
import { Variants } from './variants.entity';
import { Color } from './color.entity';
import { Size } from './size.entity';

import { getManager } from 'typeorm';
import { query } from 'express';
@Injectable()
export class ProductsService extends AbstractService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Variants)
    private productVariantsRepository: Repository<Variants>,
    @InjectRepository(Color)
    private colorsRepository: Repository<Color>,
    @InjectRepository(Size)
    private sizesRepository: Repository<Size>,
  ) {
    super(productRepository);
  }
  async createProduct(createProduct: CreateProductDto): Promise<Product> {
    const {
      category,
      subcategory,
      brand,
      attributes,
      variants,
      ...productDto
    } = createProduct;
    const product = await this.productRepository.create({
      ...productDto,
    });
    product.attributes = attributes;
    product.category = category;
    product.subcategory = subcategory;
    product.variants = variants;
    product.brand = brand;
    console.log(product);
    return await this.productRepository.save(product);
  }
  async getProduct(
    filterProduct: FilterProductDto,
    relations,
  ): Promise<PaginatedResult> {
    const query = this.productRepository.createQueryBuilder('product');
    const {
      _page,
      _limit,
      category_id,
      _sort,
      salePrice_gte,
      salePrice_lte,
      _search,
      subcategory_id,
      brand_id,
      isActive,
      rate,
      isFreeShip,
    } = filterProduct;
    console.log(filterProduct);
    const page = _page ? _page : 1;
    const limit = _limit ? Number(_limit) : 16;
    const offset = (page - 1) * limit;
    query.limit(limit).offset(offset);
    query.addSelect(
      '(product.originalPrice - product.originalPrice * product.discountPercent * 0.01)',
      'saleprice',
    );

    if (_search) {
      console.log(_search);
      const search = this.removeAccents(_search);
      // query.andWhere(
      //   '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.full_description) LIKE LOWER(:search))',
      //   { search: `%${_search}%` },
      // );
      query
        .andWhere('product.product_tvc @@ plainto_tsquery(:query)', {
          query: search,
        })
        .orderBy(
          'ts_rank(product.product_tvc,plainto_tsquery(:query))',
          'DESC',
        );
    }
    if (salePrice_gte) {
      query.andWhere(
        '(product.originalPrice - product.originalPrice * product.discountPercent * 0.01)  > :salePrice_gte',
        {
          salePrice_gte,
        },
      );
    }
    if (salePrice_lte) {
      query.andWhere(
        '(product.originalPrice - product.originalPrice * product.discountPercent * 0.01)  < :salePrice_lte',
        {
          salePrice_lte,
        },
      );
    }
    if (category_id) {
      query.andWhere('product.category = :category_id', { category_id });
    }
    if (brand_id) {
      query.andWhere('product.brand = :brand_id', { brand_id });
    }
    if (_sort) {
      console.log(_sort);

      if (_sort === 'salePrice:ASC') {
        query.orderBy('saleprice', 'ASC');
      }
      if (_sort === 'salePrice:DESC') {
        query.orderBy('saleprice', 'DESC');
      }
      if (_sort === 'top_seller') {
        query.orderBy('product.countInStock', 'DESC');
      }
      if (_sort === 'newest') {
        query.orderBy('product.created_at', 'DESC');
      }
    }

    if (category_id) {
      query.andWhere('product.category = :category_id', { category_id });
    }
    if (subcategory_id) {
      query.andWhere('product.subcategory = :subcategory_id', {
        subcategory_id,
      });
    }
    if (isFreeShip) {
      query.andWhere('product.isFreeShip = :isFreeShip', {
        isFreeShip,
      });
    }
    // if (relations.length > 0) {
    //   relations.map((relation) => {
    //     query.leftJoinAndSelect(`product.${relation}`, `${relation}`);
    //   });
    // }
    // query.leftJoinAndSelect(`product.category`, `category`);
    // query.leftJoinAndSelect(`product.subcategory`, `subcategory`);
    query.leftJoinAndSelect(`product.comments`, `comments`);
    // query.andWhere('product.isActive =:isActive', { isActive: true });
    // query.andWhere('product.averageRate =:averageRate', { averageRate: 5 });
    if (isActive) {
      query.andWhere('product.isActive =:isActive', { isActive: true });
    }
    if (rate) {
      query.andWhere('product.averageRate =:averageRate', {
        averageRate: rate,
      });
    }
    const data = await query.getMany();
    console.log(query.getSql());

    return {
      data,
      pagination: {
        total: await query.getCount(),
        current_page: +filterProduct._page || 1,
        limit: +filterProduct._limit || 10,
      },
    };
  }
  async getProductAdmin(
    filterProduct: FilterProductDto,
    relations,
  ): Promise<PaginatedResult> {
    const query = this.productRepository.createQueryBuilder('product');
    const {
      _page,
      _limit,
      category_id,
      _sort,
      salePrice_gte,
      salePrice_lte,
      _search,
      subcategory_id,
      brand_id,
      isFreeShip,
    } = filterProduct;
    console.log(filterProduct);
    const page = _page ? _page : 1;
    const limit = _limit ? Number(_limit) : 16;
    const offset = (page - 1) * limit;
    query.limit(limit).offset(offset);
    query.addSelect(
      '(product.originalPrice - product.originalPrice * product.discountPercent * 0.01)',
      'saleprice',
    );

    if (_search) {
      console.log(_search);
      query.andWhere(
        '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.full_description) LIKE LOWER(:search))',
        { search: `%${_search}%` },
      );
    }
    if (salePrice_gte) {
      query.andWhere(
        '(product.originalPrice - product.originalPrice * product.discountPercent * 0.01)  > :salePrice_gte',
        {
          salePrice_gte,
        },
      );
    }
    if (salePrice_lte) {
      query.andWhere(
        '(product.originalPrice - product.originalPrice * product.discountPercent * 0.01)  < :salePrice_lte',
        {
          salePrice_lte,
        },
      );
    }
    if (category_id) {
      query.andWhere('product.category = :category_id', { category_id });
    }
    if (brand_id) {
      query.andWhere('product.brand = :brand_id', { brand_id });
    }
    if (isFreeShip) {
      query.andWhere('product.isFreeShip = :isFreeShip', {
        isFreeShip: Boolean(isFreeShip),
      });
    }
    if (_sort) {
      console.log(_sort);

      if (_sort === 'salePrice:ASC') {
        query.orderBy('saleprice', 'ASC');
      }
      if (_sort === 'salePrice:DESC') {
        query.orderBy('saleprice', 'DESC');
      }
      if (_sort === 'top_seller') {
        query.orderBy('product.countInStock', 'DESC');
      }
      if (_sort === 'newest') {
        query.orderBy('product.created_at', 'DESC');
      }
    }

    if (category_id) {
      query.andWhere('product.category = :category_id', { category_id });
    }
    if (subcategory_id) {
      query.andWhere('product.subcategory = :subcategory_id', {
        subcategory_id,
      });
    }
    // if (relations.length > 0) {
    //   relations.map((relation) => {
    //     query.leftJoinAndSelect(`product.${relation}`, `${relation}`);
    //   });
    // }
    // query.leftJoinAndSelect(`product.category`, `category`);
    // query.leftJoinAndSelect(`product.subcategory`, `subcategory`);
    query.leftJoinAndSelect(`product.comments`, `comments`);
    if (isFreeShip) {
      query.andWhere('product.isFreeShip = :isFreeShip', {
        isFreeShip: true,
      });
    }
    // query.andWhere('product.averageRate =:averageRate', { averageRate: 5 });
    const data = await query.getMany();
    console.log(query.getSql());

    return {
      data,
      pagination: {
        total: await query.getCount(),
        current_page: +filterProduct._page || 1,
        limit: +filterProduct._limit || 10,
      },
    };
  }
  async getProductById(id: string): Promise<{ product: Product; type: any }> {
    const product = await this.productRepository.findOne(id, {
      relations: [
        'category',
        'subcategory',
        'variants',
        'comments',
        'comments.reply',
        'images',
        'attributes',
        'brand',
      ],
    });
    // const product = await this.productRepository
    //   .createQueryBuilder('p')
    //   .leftJoinAndSelect('p.category', 'category')
    //   .leftJoinAndSelect('category.category_attributes', 'category_attributes')
    //   .leftJoinAndSelect('p.subcategory', 'subcategory')
    //   .leftJoinAndSelect('p.brand', 'brand')
    //   .leftJoinAndSelect('p.variants', 'variants')
    //   .leftJoinAndSelect('variants.color', 'color')
    //   .leftJoinAndSelect('variants.size', 'size')
    //   .leftJoinAndSelect('p.comments', 'comments')
    //   .leftJoinAndSelect('p.attributes', 'attributes')
    //   .leftJoinAndSelect('p.images', 'images')
    //   .where('p.id =:productID', { productID: id })
    //   .getOne();
    // const color = { id: 'de044890-4c4f-4aa0-a6d5-f6dcb2accbf5' };
    // const variant = await this.productVariantsRepository.find({
    //   product,
    //   color,
    // });
    // console.log(variant);
    // const sizes =
    //   this.productVariantsRepository.createQueryBuilder('product_variants');

    // .getRawMany();

    const colors = await getManager()
      .createQueryBuilder()
      .select('pv.color_id', 'id')
      .addSelect('color.name', 'name')

      .from(Variants, 'pv')
      .innerJoin(Color, 'color', 'pv.color_id = color.id')
      .where('pv.product_id = :productID', {
        productID: id,
      })
      .groupBy('pv.color_id')
      .addGroupBy('color.name')

      .getRawMany();
    const sizes = await getManager()
      .createQueryBuilder()
      .select('pv.size_id', 'id')
      .addSelect('size.name', 'name')

      .from(Variants, 'pv')
      .innerJoin(Size, 'size', 'pv.size_id = size.id')
      .where('pv.product_id = :productID', {
        productID: id,
      })
      .groupBy('pv.size_id')
      .addGroupBy('size.name')
      .getRawMany();
    console.log(sizes);
    // const colors = [
    //   {
    //     id: 'bd418390-1fd6-4e06-9110-6e8ed6c98940',
    //     name: 'Đỏ',
    //   },
    //   {
    //     id: 'de044890-4c4f-4aa0-a6d5-f6dcb2accbf5',
    //     name: 'Xanh',
    //   },
    // ];
    // product.colors = colors;
    // product.sizes = sizes;

    if (!product) {
      throw new NotFoundException(`Product not found with id: ${id}`);
    }
    const type = { sizes, colors };
    return { product, type };
  }
  async getSizeColor(dataBody) {
    const { size, color, productId } = dataBody;
    if (size && color) {
      const data = await this.productVariantsRepository.findOne({
        where: { size, color, product: productId },
        relations: ['color', 'size'],
      });
      return data;
    }
    if (size) {
      const data = await this.productVariantsRepository.find({
        where: { size, product: productId },
        relations: ['color'],
      });
      return data;
    }
    if (color) {
      const data = await this.productVariantsRepository.find({
        where: { color, product: productId },
        relations: ['size'],
      });
      return data;
    }
  }
  async updateProduct(
    id: string,
    updateProduct: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const newProduct = { ...product, ...updateProduct };
    product.variants = updateProduct.variants;
    // console.log(product);
    return await this.productRepository.save(newProduct);
  }
  async updateReview(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
    product.countRate = product.comments.length;
    product.averageRate = Math.round(
      product.comments.reduce((sum, comment) => sum + comment.rate, 0) /
        product.comments.length,
    );
    return await this.productRepository.save(product);
  }
  removeAccents(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }
  async searchProduct(str) {
    const search = this.removeAccents(str);
    console.log(search, str);
    const query = this.productRepository
      .createQueryBuilder('product')
      .where('product.product_tvc @@ plainto_tsquery(:query)', {
        query: search,
      })
      .orderBy('ts_rank(product.product_tvc,plainto_tsquery(:query))', 'DESC');
    console.log(query.getSql());
    return await query.getMany();
  }
  async getVariant(id) {
    return this.productVariantsRepository.findOne(id);
  }
  async save(variant) {
    return this.productVariantsRepository.save(variant);
  }
}
