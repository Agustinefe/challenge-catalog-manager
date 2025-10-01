import { ApiProperty } from '@nestjs/swagger';

export class ClientDto {
  @ApiProperty({
    example: 1,
    description: 'Identificador único del cliente',
  })
  id: number;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del cliente',
  })
  firstName: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del cliente',
  })
  lastName: string;

  @ApiProperty({
    example: 'Av. Siempre Viva 123, CABA',
    description: 'Dirección del cliente',
  })
  address: string;

  @ApiProperty({
    example: '20-12345678-9',
    description: 'CUIT del cliente',
  })
  cuit: string;
}
