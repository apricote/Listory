/* eslint-disable max-classes-per-file */
import { IsDate, IsOptional, ValidateNested } from "class-validator";
import { Interval } from "date-fns";
import { User } from "../../users/user.entity";

export class GetListensFilterTimeDto implements Interval {
  @IsDate()
  start: Date;

  @IsDate()
  end: Date;
}

export class GetListensFilterDto {
  @IsOptional()
  @ValidateNested()
  time?: GetListensFilterTimeDto;
}

export class GetListensDto {
  user: User;

  @IsOptional()
  @ValidateNested()
  filter?: GetListensFilterDto;
}
