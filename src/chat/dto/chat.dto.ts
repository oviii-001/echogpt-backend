import { IsString, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  provider?: string;
}

export class CreateConversationDto {
  @IsString()
  title: string;
}
