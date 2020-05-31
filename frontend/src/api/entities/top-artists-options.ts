import { TimePreset } from "./time-preset.enum";

export interface TopArtistsOptions {
  timePreset: TimePreset;
  customTimeStart: Date;
  customTimeEnd: Date;
}
