import { ExternalUrlObject } from "./external-url-object";

// tslint:disable variable-name

export class ContextObject {
  /**
   * External URLs for this context.
   */
  external_urls: ExternalUrlObject;

  /**
   * A link to the Web API endpoint providing full details of the track.
   */
  href: string;

  /**
   * The object type, e.g. "artist", "playlist", "album".
   */
  type: string;

  /**
   * The Spotify URI for the context.
   */
  uri: string;
}
