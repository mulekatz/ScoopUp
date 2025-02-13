import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class ValidateImageDto {
  @IsString()
  @IsOptional()
  public firstImage: string | null;

  @IsString()
  @IsOptional()
  public secondImage: string | null;

  @IsString()
  @IsOptional()
  public thirdImage: string | null;

  @IsString()
  @IsNotEmpty()
  @Length(42, 42) // 42 is the length of an Vechain address including the 0x prefix
  public address: string;

  @IsString()
  @IsNotEmpty()
  public deviceID: string;
}
