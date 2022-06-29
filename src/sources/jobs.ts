import { createJob } from "@apricote/nest-pg-boss";

export type ICrawlerSupervisorJob = {};
export const CrawlerSupervisorJob = createJob<ICrawlerSupervisorJob>(
  "spotify-crawler-supervisor"
);

export type IUpdateSpotifyLibraryJob = {};
export const UpdateSpotifyLibraryJob = createJob<IUpdateSpotifyLibraryJob>(
  "update-spotify-library"
);

export type IImportSpotifyJob = { userID: string };
export const ImportSpotifyJob = createJob<IImportSpotifyJob>("import-spotify");
