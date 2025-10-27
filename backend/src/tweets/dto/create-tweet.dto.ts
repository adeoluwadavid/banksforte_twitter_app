import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';

export class CreateTweetDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(0)
  sharedWithUserIds?: string[];
}
