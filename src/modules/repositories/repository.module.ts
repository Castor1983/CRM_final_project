import { Global, Module } from '@nestjs/common';

import { ManagerRepository } from './services/manager.repository';
import {OrderRepository} from "./services/order.repository";
import {RefreshTokenRepository} from "./services/refresh-token.repository";
import {CommentRepository} from "./services/comment.repository";
const repositories = [ManagerRepository, OrderRepository, RefreshTokenRepository, CommentRepository];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
