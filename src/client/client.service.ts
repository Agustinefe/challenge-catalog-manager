import { Injectable } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { ClientDto } from './dto/client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) { }

  async findById(id: number): Promise<ClientDto | null> {
    return await this.clientRepository.findOne(id);
  }
}
