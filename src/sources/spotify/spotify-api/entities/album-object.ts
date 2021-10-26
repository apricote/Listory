import { PagingObject } from "./paging-object";
import { SimplifiedTrackObject } from "./simplified-track-object";
import { SimplifiedArtistObject } from "./simplified-artist-object";

// tslint:disable: variable-name

export class AlbumObject {
  /**
   * The artists of the album.
   * Each artist object includes a link in href to more detailed information about the artist.
   */
  artists: SimplifiedArtistObject[];

  /**
   * A link to the Web API endpoint providing full details of the album.
   */
  href: string;

  /**
   * The Spotify ID for the album.
   */
  id: string;

  /**
   * The label for the album.
   */
  label: string;

  /**
   * The name of the album.
   * In case of an album takedown, the value may be an empty string.
   */
  name: string;

  /**
   * The object type: "album".
   */
  type: "album";

  /**
   * The Spotify URI for the album.
   */
  uri: string;

  /**
   * The date the album was first released, for example `1981`.
   * Depending on the precision, it might be shown as `1981-12` or `1981-12-15`.
   */
  release_date: string;

  /**
   * The precision with which `release_date` value is known: `year` , `month` , or `day`.
   */
  release_date_precision: "year" | "month" | "day";

  /**
   * The tracks of the album.
   */
  tracks: PagingObject<SimplifiedTrackObject>;
}
