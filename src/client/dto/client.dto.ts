import { ApiProperty } from '@nestjs/swagger';

export class ClientDto {
  @ApiProperty({
    description: 'Unique identifier of the client',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'First name of the client',
    example: 'Juan',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the client',
    example: 'Pérez',
  })
  lastName: string;

  @ApiProperty({
    description: 'Address of the client',
    example: 'Av. Siempre Viva 123, CABA',
  })
  address: string;

  @ApiProperty({
    description: 'CUIT of the client',
    example: '20123456789',
  })
  cuit: string;
}
