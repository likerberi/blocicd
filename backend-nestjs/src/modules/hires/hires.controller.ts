import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';
import { Roles } from '../../common/auth/decorators/roles.decorator';
import { JwtUser } from '../../common/auth/strategies/jwt.strategy';
import { UserRole } from '../../common/enums/user-role.enum';
import { ProposalsService } from '../proposals/proposals.service';

@Controller('hires')
export class HiresController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post(':proposalId/finalize')
  @Roles(UserRole.COMPANY_USER, UserRole.ADMIN)
  async finalize(
    @Param('proposalId', ParseIntPipe) proposalId: number,
    @CurrentUser() user: JwtUser,
  ) {
    const proposal = await this.proposalsService.finalizeHire(proposalId, user.sub);
    return {
      proposal,
      policy: 'UNMASK_CONTACT_AND_WRITE_PII_AUDIT_LOG',
    };
  }
}
