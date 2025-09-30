import { PaginationMetadataDto } from '../../../src/common/dto/pagination-metadata.dto';
import { ListProductsDto } from './list-products.dto';

export class ListProductsResponseDto {
  data: ListProductsDto[];
  meta: PaginationMetadataDto;
}
