import { Global, Module } from '@nestjs/common';

import { ManagerRepository } from './services/manager.repository';
const repositories = [ManagerRepository];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
