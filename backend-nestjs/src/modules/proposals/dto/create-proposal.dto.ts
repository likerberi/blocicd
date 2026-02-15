import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export enum WorkType {
  ONSITE = 'ONSITE',
  HYBRID = 'HYBRID',
  REMOTE = 'REMOTE',
}

export class CreateProposalDto {
  @IsInt()
  @Min(1)
  companyProfileId!: number;

  @IsInt()
  @Min(1)
  jobSeekerProfileId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  positionTitle!: string;

  @IsInt()
  @Min(0)
  offerSalaryMin!: number;

  @IsInt()
  @Min(0)
  offerSalaryMax!: number;

  @IsEnum(WorkType)
  workType!: WorkType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message!: string;

  @IsDateString()
  expiresAt!: string;
}
