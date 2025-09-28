import { RowDataPacket } from 'mysql2';

export interface UserSessionModel extends RowDataPacket {
  tokenId: string;
  userId: number;
  expiryDate: Date;
}
