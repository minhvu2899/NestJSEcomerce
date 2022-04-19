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
import { SubCategorysService } from './sub-categorys.service';

@Controller('subcategories')
export class SubCategorysController {
  constructor(private subcategorysService: SubCategorysService) {}
  @Get()
  async all() {
    return this.subcategorysService.all();
  }
  @Post()
  createSub(@Body() createSub) {
    return this.subcategorysService.createSub(createSub);
  }
  @Patch('/:id')
  updateSubCategory(@Body() updateSubCategory, @Param('id') id: string) {
    return this.subcategorysService.updateSubCategory(id, updateSubCategory);
  }
  @Get('/:id')
  getSubCategoryByID(@Param('id') id: string) {
    return this.subcategorysService.getSubCategoryById(id);
  }
  //   @Patch('/:id')
  //   updateProduct(
  //     @Body() updateProduct: UpdateProductDto,
  //     @Param('id') id: string,
  //   ) {
  //     return this.productsService.updateProduct(id, updateProduct);
  //   }
  @Delete('/:id')
  deleteSubCategory(@Param('id') id: string) {
    return this.subcategorysService.delete(id);
  }
}
