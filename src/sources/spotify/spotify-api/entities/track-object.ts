import { SimplifiedAlbumObject } from "./simplified-album-object";
import { SimplifiedArtistObject } from "./simplified-artist-object";

// tslint:disable: variable-name

export class TrackObject {
  /**
   * The album on which the track appears. The album object includes a link in href to full information about the album.
   */
  album: SimplifiedAlbumObject;

  /**
   * The album on which the track appears. The album object includes a link in href to full information about the album.
   */
  artists: SimplifiedArtistObject[];

  /**
   * The track length in milliseconds.
   */
  duration_ms: number;

  /**
   * A link to the Web API endpoint providing full details of the track.
   */
  href: string;

  /**
   * The Spotify ID for the track.
   */
  id: string;

  /**
   * The name of the track.
   */
  name: string;

  /**
   * The object type: "track".
   */
  type: "track";

  /**
   * The Spotify URI for the track.
   */
  uri: string;
}
