// tslint:disable: variable-name

export class SimplifiedAlbumObject {
  album_type: "album" | "single" | "compilation";

  /**
   * A link to the Web API endpoint providing full details of the album.
   */
  href: string;

  /**
   * The Spotify ID for the album.
   */
  id: string;

  /**
   * The name of the album. In case of an album takedown, the value may be an empty string.
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
}
