import { IsOptional, ValidateNested, IsISO8601 } from "class-validator";
import { User } from "src/users/user.entity";

// tslint:disable-next-line: max-classes-per-file
export class GetListensFilterTimeDto {
  @IsISO8601()
  start: string;
  @IsISO8601()
  end: string;
}

// tslint:disable-next-line: max-classes-per-file
export class GetListensFilterDto {
  @IsOptional()
  @ValidateNested()
  time?: GetListensFilterTimeDto;
}

// tslint:disable-next-line: max-classes-per-file
export class GetListensDto {
  user: User;

  @IsOptional()
  @ValidateNested()
  filter?: GetListensFilterDto;
}
