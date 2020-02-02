import { ContextObject } from "./context-object";
import { SimplifiedTrackObject } from "./simplified-track-object";

// tslint:disable variable-name

export class PlayHistoryObject {
  /**
   * The context the track was played from.
   */
  context: ContextObject;

  /**
   * The date and time the track was played.
   */
  played_at: string;

  /**
   * The track the user listened to.
   */
  track: SimplifiedTrackObject;
}
