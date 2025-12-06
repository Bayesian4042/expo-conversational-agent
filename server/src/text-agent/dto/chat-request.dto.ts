import { UIMessage } from 'ai';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  @IsOptional()
  patientId?: string;

  @IsString()
  @IsOptional()
  clinicId?: string;

  @IsNotEmpty()
  messages: UIMessage[];
}
