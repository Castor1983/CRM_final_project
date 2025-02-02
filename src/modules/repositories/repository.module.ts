import { Global, Module } from '@nestjs/common';

import { ManagerRepository } from './services/manager.repository';
import {OrderRepository} from "./services/order.repository";
import {RefreshTokenRepository} from "./services/refresh-token.repository";
import {CommentRepository} from "./services/comment.repository";
import {GroupRepository} from "./services/group.repository";
const repositories = [ManagerRepository, OrderRepository, RefreshTokenRepository, CommentRepository, GroupRepository];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
