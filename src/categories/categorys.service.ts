import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from './subcategory.entity';
import { CategoryAttribute } from './category-attribute.entity';

@Injectable()
export class CategorysService extends AbstractService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CategoryAttribute)
    private categoryatRepository: Repository<CategoryAttribute>,
  ) {
    super(categoryRepository);
  }
  async createAt(body) {
    const at = this.categoryatRepository.create({ ...body });
    return await this.categoryatRepository.save(at);
  }
  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new NotFoundException('Category not found: ' + id);
    }
    return category;
  }
  async getAttributeByCategoryId(id: string) {
    const category = await this.categoryRepository.findOne(id, {
      relations: ['category_attributes'],
    });

    if (!category) {
      throw new NotFoundException('Category not found: ' + id);
    }
    return category.category_attributes;
  }
  async updateCategory(id: string, updateCategory): Promise<Category> {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new NotFoundException('Product not found');
    }
    const newCategory = { ...category, ...updateCategory };
    return await this.categoryRepository.save(newCategory);
  }
  async deleteCategory(id: string) {
    const category = this.getCategoryById(id);
    if (category) {
      await this.categoryRepository.delete(id);
    }
  }
  async statisticCategoryByProduct() {
    const statistic = await this.categoryRepository.query(`
    Select category.name,count(*) from product INNer Join category on category.id=product.category_id GROUP BY category.id,category.name
 `);
    return statistic;
  }
}
