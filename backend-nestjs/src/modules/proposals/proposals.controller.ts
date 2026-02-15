import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';
import { Roles } from '../../common/auth/decorators/roles.decorator';
import { JwtUser } from '../../common/auth/strategies/jwt.strategy';
import { ProposalStatus } from '../../common/enums/proposal-status.enum';
import { UserRole } from '../../common/enums/user-role.enum';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { ProposalsService } from './proposals.service';

@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  @Roles(UserRole.COMPANY_USER, UserRole.ADMIN)
  async create(@Body() dto: CreateProposalDto, @CurrentUser() user: JwtUser) {
    return await this.proposalsService.create(dto, user.sub);
  }

  @Get()
  @Roles(UserRole.JOB_SEEKER, UserRole.COMPANY_USER, UserRole.ADMIN)
  async list(@Query('status') status?: ProposalStatus) {
    return await this.proposalsService.list(status);
  }

  @Post(':proposalId/accept')
  @Roles(UserRole.JOB_SEEKER, UserRole.ADMIN)
  async accept(
    @Param('proposalId', ParseIntPipe) proposalId: number,
    @CurrentUser() user: JwtUser,
  ) {
    const proposal = await this.proposalsService.accept(proposalId, user.sub);
    return {
      proposal,
      policy: 'CHAT_ROOM_SHOULD_BE_CREATED',
    };
  }

  @Post(':proposalId/reject')
  @Roles(UserRole.JOB_SEEKER, UserRole.ADMIN)
  async reject(
    @Param('proposalId', ParseIntPipe) proposalId: number,
    @CurrentUser() user: JwtUser,
  ) {
    return await this.proposalsService.reject(proposalId, user.sub);
  }
}
