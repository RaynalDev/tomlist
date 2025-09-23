import { Global, Module } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory.database';

@Global()
@Module({
  providers: [InMemoryDatabase],
  exports: [InMemoryDatabase],
})
export class SharedModule {}
