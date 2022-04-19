import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
  constructor(private brandService: BrandsService) {}
  @Get()
  getAll() {
    return this.brandService.getAll();
  }
  @Get('/:id')
  getBrandById(@Param('id') id: string) {
    return this.brandService.getBrandById(id);
  }
  @Post()
  createBrand(@Body() brandDto) {
    return this.brandService.createBrand(brandDto);
  }
  @Patch('/:id')
  updateBrand(@Body() brandDto, @Param('id') id: string) {
    return this.brandService.updateBrand(id, brandDto);
  }
  @Delete('/:id')
  deleteCategory(@Param('id') id: string) {
    return this.brandService.deleteBrand(id);
  }
}
