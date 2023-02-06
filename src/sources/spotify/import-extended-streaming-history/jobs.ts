import { createJob } from "@apricote/nest-pg-boss";

export type IProcessSpotifyExtendedStreamingHistoryListenJob = { id: string };
export const ProcessSpotifyExtendedStreamingHistoryListenJob =
  createJob<IProcessSpotifyExtendedStreamingHistoryListenJob>(
    "process-spotify-extended-streaming-history-listen",
  );
