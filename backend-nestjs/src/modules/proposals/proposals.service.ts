import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProposalStatus as PrismaProposalStatus } from '@prisma/client';
import { PrismaService } from '../../common/db/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';

type ProposalRecord = {
  id: bigint;
  companyProfileId: bigint;
  jobSeekerProfileId: bigint;
  positionTitle: string;
  offerSalaryMin: number;
  offerSalaryMax: number;
  workType: string | null;
  message: string;
  status: PrismaProposalStatus;
  expiresAt: Date;
  createdAt: Date;
  acceptedAt: Date | null;
  rejectedAt: Date | null;
  finalizedAt: Date | null;
};

@Injectable()
export class ProposalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProposalDto, actorUserId: number) {
    if (dto.offerSalaryMin > dto.offerSalaryMax) {
      throw new BadRequestException('offerSalaryMin must be <= offerSalaryMax');
    }

    const proposal = await this.prisma.$transaction(async (tx) => {
      const created = await tx.proposal.create({
        data: {
          companyProfileId: BigInt(dto.companyProfileId),
          jobSeekerProfileId: BigInt(dto.jobSeekerProfileId),
          positionTitle: dto.positionTitle,
          offerSalaryMin: dto.offerSalaryMin,
          offerSalaryMax: dto.offerSalaryMax,
          workType: dto.workType,
          message: dto.message,
          status: PrismaProposalStatus.PENDING,
          expiresAt: new Date(dto.expiresAt),
        },
      });

      await tx.proposalStatusLog.create({
        data: {
          proposalId: created.id,
          fromStatus: null,
          toStatus: PrismaProposalStatus.PENDING,
          actorUserId: BigInt(actorUserId),
        },
      });
      return created;
    });

    return this.toView(proposal);
  }

  async list(status?: string) {
    const validStatus =
      status && Object.values(PrismaProposalStatus).includes(status as PrismaProposalStatus)
        ? (status as PrismaProposalStatus)
        : undefined;

    const proposals = await this.prisma.proposal.findMany({
      where: validStatus ? { status: validStatus } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return proposals.map((proposal) => this.toView(proposal));
  }

  async accept(proposalId: number, actorUserId: number) {
    const proposal = await this.findById(proposalId);
    if (proposal.status !== PrismaProposalStatus.PENDING) {
      throw new BadRequestException('Only PENDING proposal can be accepted');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.proposal.update({
        where: { id: proposal.id },
        data: {
          status: PrismaProposalStatus.ACCEPTED,
          acceptedAt: new Date(),
        },
      });
      await tx.proposalStatusLog.create({
        data: {
          proposalId: proposal.id,
          fromStatus: proposal.status,
          toStatus: PrismaProposalStatus.ACCEPTED,
          actorUserId: BigInt(actorUserId),
        },
      });
      return result;
    });

    return this.toView(updated);
  }

  async reject(proposalId: number, actorUserId: number) {
    const proposal = await this.findById(proposalId);
    if (proposal.status !== PrismaProposalStatus.PENDING) {
      throw new BadRequestException('Only PENDING proposal can be rejected');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.proposal.update({
        where: { id: proposal.id },
        data: {
          status: PrismaProposalStatus.REJECTED,
          rejectedAt: new Date(),
        },
      });
      await tx.proposalStatusLog.create({
        data: {
          proposalId: proposal.id,
          fromStatus: proposal.status,
          toStatus: PrismaProposalStatus.REJECTED,
          actorUserId: BigInt(actorUserId),
        },
      });
      return result;
    });

    return this.toView(updated);
  }

  async markChatting(proposalId: number, actorUserId?: number) {
    const proposal = await this.findById(proposalId);
    if (proposal.status !== PrismaProposalStatus.ACCEPTED) {
      throw new BadRequestException('Only ACCEPTED proposal can move to CHATTING');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.proposal.update({
        where: { id: proposal.id },
        data: { status: PrismaProposalStatus.CHATTING },
      });

      if (actorUserId) {
        await tx.proposalStatusLog.create({
          data: {
            proposalId: proposal.id,
            fromStatus: proposal.status,
            toStatus: PrismaProposalStatus.CHATTING,
            actorUserId: BigInt(actorUserId),
          },
        });
      }
      return result;
    });

    return this.toView(updated);
  }

  async finalizeHire(proposalId: number, actorUserId: number) {
    const proposal = await this.findByIdWithJobSeeker(proposalId);
    if (proposal.status !== PrismaProposalStatus.CHATTING) {
      throw new BadRequestException('Only CHATTING proposal can be finalized');
    }

    const targetUserId = proposal.jobSeekerProfile?.userId;
    if (!targetUserId) {
      throw new NotFoundException('Job seeker user not found for proposal');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.proposal.update({
        where: { id: proposal.id },
        data: {
          status: PrismaProposalStatus.FINAL_HIRED,
          finalizedAt: new Date(),
        },
      });

      await tx.proposalStatusLog.create({
        data: {
          proposalId: proposal.id,
          fromStatus: proposal.status,
          toStatus: PrismaProposalStatus.FINAL_HIRED,
          actorUserId: BigInt(actorUserId),
        },
      });

      await tx.piiAccessLog.create({
        data: {
          actorUserId: BigInt(actorUserId),
          targetUserId: targetUserId,
          eventType: 'UNMASK_PROFILE',
          proposalId: proposal.id,
        },
      });

      return result;
    });

    return this.toView(updated);
  }

  private async findById(proposalId: number) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: BigInt(proposalId) },
    });
    if (!proposal) throw new NotFoundException('Proposal not found');
    return proposal;
  }

  private async findByIdWithJobSeeker(proposalId: number) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: BigInt(proposalId) },
      include: { jobSeekerProfile: { select: { userId: true } } },
    });
    if (!proposal) throw new NotFoundException('Proposal not found');
    return proposal;
  }

  private toView(proposal: ProposalRecord) {
    return {
      id: Number(proposal.id),
      companyProfileId: Number(proposal.companyProfileId),
      jobSeekerProfileId: Number(proposal.jobSeekerProfileId),
      positionTitle: proposal.positionTitle,
      offerSalaryMin: proposal.offerSalaryMin,
      offerSalaryMax: proposal.offerSalaryMax,
      workType: proposal.workType,
      message: proposal.message,
      status: proposal.status,
      expiresAt: proposal.expiresAt.toISOString(),
      createdAt: proposal.createdAt.toISOString(),
      acceptedAt: proposal.acceptedAt ? proposal.acceptedAt.toISOString() : null,
      rejectedAt: proposal.rejectedAt ? proposal.rejectedAt.toISOString() : null,
      finalizedAt: proposal.finalizedAt ? proposal.finalizedAt.toISOString() : null,
    };
  }
}
