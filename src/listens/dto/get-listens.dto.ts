import { IsDate, IsOptional, ValidateNested } from "class-validator";
import { Interval } from "date-fns";
import { User } from "src/users/user.entity";

// tslint:disable-next-line: max-classes-per-file
export class GetListensFilterTimeDto implements Interval {
  @IsDate()
  start: Date;
  @IsDate()
  end: Date;
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
