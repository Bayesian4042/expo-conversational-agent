import { IsString, IsOptional, IsIn } from 'class-validator';

export class GenerateSpeechDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsIn(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'])
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
}



