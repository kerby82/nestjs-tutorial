import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { Catch, NotFoundException, ArgumentsHost } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    GqlArgumentsHost.create(host);

    return new NotFoundException('Entity not found');
  }
}
