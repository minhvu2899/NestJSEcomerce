export class FilterProductDto {
  _limit?: number;
  _page?: number;
  category_id?: string;
  _sort?: string;
  _brand?: string;
  salePrice_gte?: number;
  salePrice_lte?: number;
  _search?: string;
  subcategory_id?: string;
  brand_id?: string;
  isActive?: boolean;
  rate?: number;
  isFreeShip?: boolean;
}
