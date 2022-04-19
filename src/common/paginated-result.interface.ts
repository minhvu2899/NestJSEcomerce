export class PaginatedResult {
  data: any[];
  pagination: {
    current_page: number;
    limit: number;
    total: number;
  };
}
