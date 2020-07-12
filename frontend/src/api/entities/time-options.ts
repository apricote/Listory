import { TimePreset } from "./time-preset.enum";

export interface TimeOptions {
  timePreset: TimePreset;
  customTimeStart: Date;
  customTimeEnd: Date;
}
