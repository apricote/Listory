export class ArtistObject {
  /**
   * A list of the genres the artist is associated with.
   * For example: "Prog Rock" , "Post-Grunge".
   * (If not yet classified, the array is empty.)
   */
  genres: string[];
  /**
   * A link to the Web API endpoint providing full details of the artist.
   */
  href: string;

  /**
   * The Spotify ID for the artist.
   */
  id: string;

  /**
   * The name of the artist.
   */
  name: string;

  /**
   * The object type: "artist".
   */
  type: "artist";

  /**
   * The Spotify URI for the artist.
   */
  uri: string;
}
