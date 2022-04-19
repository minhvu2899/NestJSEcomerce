import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategorysService } from './categorys.service';

@Controller('categories')
export class CategorysController {
  constructor(private categorysService: CategorysService) {}
  @Get()
  async all() {
    return this.categorysService.all(['subcategory']);
  }
  @Post()
  createProduct(@Body() createProduct) {
    return this.categorysService.create(createProduct);
  }
  @Post('/at')
  createAt(@Body() createProduct) {
    return this.categorysService.createAt(createProduct);
  }
  @Get('/categoryByProduct')
  getCategoryByProduct() {
    return this.categorysService.statisticCategoryByProduct();
  }
  @Get('/:id')
  getCategoryByID(@Param('id') id: string) {
    return this.categorysService.getCategoryById(id);
  }
  @Get('/:id/attributes')
  getAttrinutesByCategoryID(@Param('id') id: string) {
    return this.categorysService.getAttributeByCategoryId(id);
  }
  @Patch('/:id')
  updateCategory(@Body() updateCategory, @Param('id') id: string) {
    return this.categorysService.updateCategory(id, updateCategory);
  }

  @Delete('/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categorysService.delete(id);
  }
}
