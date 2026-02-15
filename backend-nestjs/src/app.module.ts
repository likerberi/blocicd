import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/auth/guards/jwt-auth.guard';
import { RolesGuard } from './common/auth/guards/roles.guard';
import { PrismaService } from './common/db/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { ChatGateway } from './modules/chat/chat.gateway';
import { HiresController } from './modules/hires/hires.controller';
import { ProposalsController } from './modules/proposals/proposals.controller';
import { ProposalsService } from './modules/proposals/proposals.service';

@Module({
  imports: [AuthModule],
  controllers: [ProposalsController, HiresController],
  providers: [
    ProposalsService,
    ChatGateway,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
