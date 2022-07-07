import { Injectable } from "@nestjs/common";

// Service adapted from https://github.com/disjunction/url-value-parser

const REPLACE_MASKS: RegExp[] = [
  /^\-?\d+$/,

  /^(\d{2}|\d{4})\-\d\d\-\d\d$/, // date

  /^[\da-f]{8}\-[\da-f]{4}\-[\da-f]{4}\-[\da-f]{4}\-[\da-f]{12}$/, // UUID
  /^[\dA-F]{8}\-[\dA-F]{4}\-[\dA-F]{4}\-[\dA-F]{4}\-[\dA-F]{12}$/, // UUID uppercased

  // hex code sould have a consistent case
  /^[\da-f]{7,}$/,
  /^[\dA-F]{7,}$/,

  // base64 encoded with URL safe Base64
  /^[a-zA-Z0-9\-_]{22,}$/,

  // classic Base64
  /^(?:[A-Za-z0-9+/]{4}){16,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/,
];

@Injectable()
export class UrlValueParserService {
  /**
   * replacePathValues replaces IDs and other identifiers from URL paths.
   */
  public replacePathValues(path: string, replacement: string = "#val"): string {
    const parseResult = this.parsePathValues(path);
    return (
      "/" +
      parseResult.chunks
        .map((chunk, i) =>
          parseResult.valueIndexes.includes(i) ? replacement : chunk
        )
        .join("/")
    );
  }

  private getPathChunks(path: string): string[] {
    return path.split("/").filter((chunk) => chunk !== "");
  }

  private parsePathValues(path: string): {
    chunks: string[];
    valueIndexes: number[];
  } {
    const chunks = this.getPathChunks(path);
    const valueIndexes = chunks
      .map((chunk, index) => (this.isValue(chunk) ? index : null))
      .filter((index) => index !== null);

    return { chunks, valueIndexes };
  }

  private isValue(str: string): boolean {
    for (let mask of REPLACE_MASKS) {
      if (str.match(mask)) {
        return true;
      }
    }
    return false;
  }
}
