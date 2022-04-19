import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from './subcategory.entity';

@Injectable()
export class SubCategorysService extends AbstractService {
  constructor(
    @InjectRepository(SubCategory)
    private subcategoryRepository: Repository<SubCategory>,
  ) {
    super(subcategoryRepository);
  }
  // async getCategoryById(id: string) {
  //   const category = await this.categoryRepository.findOne(id);
  //   if (!category) {
  //     throw new NotFoundException('Category not found: ' + id);
  //   }
  //   return category;
  // }
  async getSubCategoryById(id: string) {
    const subcategory = await this.subcategoryRepository.findOne(id);
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }
    return subcategory;
  }
  async createSub(createSub): Promise<any> {
    const { category } = createSub;
    const subcategory = await this.subcategoryRepository.create({
      ...createSub,
      category: { id: category },
    });
    return await this.subcategoryRepository.save(subcategory);
  }
  async updateSubCategory(id: string, updateSubCategory): Promise<SubCategory> {
    const subcategory = await this.subcategoryRepository.findOne(id);
    if (!subcategory) {
      throw new NotFoundException('Product not found');
    }
    const newSubCategory = { ...subcategory, ...updateSubCategory };
    return await this.subcategoryRepository.save(newSubCategory);
  }
  async deleteSubCategory(id: string) {
    const subcategory = this.getSubCategoryById(id);
    if (subcategory) {
      await this.subcategoryRepository.delete(id);
    }
  }
}
