import { BadRequestException } from '@nestjs/common';
import { isMysqlError } from '../errors/mysql.error';

export function HandleDBExceptions(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (isMysqlError(error)) {
          switch (error.code) {
            case 'ER_DUP_ENTRY':
              throw new BadRequestException(error.sqlMessage);
            default:
              throw error;
          }
        }
        throw error;
      }
    };

    return descriptor;
  };
}
