import React, { useCallback, useEffect, useState } from "react";
import Files from "react-files";
import type { ReactFile } from "react-files";
import {
  useSpotifyImportExtendedStreamingHistory,
  useSpotifyImportExtendedStreamingHistoryStatus,
} from "../hooks/use-api";
import { SpotifyExtendedStreamingHistoryItem } from "../api/entities/spotify-extended-streaming-history-item";
import { ErrorIcon } from "../icons/Error";
import { numberToPercent } from "../util/numberToPercent";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Code } from "./ui/code";

export const ImportListens: React.FC = () => {
  return (
    <>
      <div className="flex justify-between">
        <p className="text-2xl font-normal">
          Import Listens from Spotify Extended Streaming History
        </p>
      </div>
      <div className="shadow-xl bg-gray-100 dark:bg-gray-800 rounded p-4 m-2">
        <p className="my-4">
          Here you can import your full Spotify Listen history that was exported
          from the{" "}
          <a
            target="blank"
            href="https://www.spotify.com/us/account/privacy/"
            className="underline"
          >
            Extended streaming history
          </a>
          .
        </p>
        <p className="my-4">
          The extended streaming history contains additional personally
          identifiable data such as the IP address of the listen (which can be
          linked to locations). To avoid saving this on the server, the data is
          preprocessed in your web browser and only the necessary data
          (timestamp & track ID) are sent to the server.
        </p>
        <p className="my-4">
          If an error occurs, you can always retry uploading the file, Listory
          deduplicates any listens to make sure that everything is saved only
          once.
        </p>

        <FileUpload />
        <ImportProgress />
      </div>
    </>
  );
};

interface FileData {
  file: ReactFile;
  status: Status;
  error?: Error;
}

enum Status {
  Select,
  Import,
  Finished,
  Error,
}

const FileUpload: React.FC = () => {
  // Using a map is ... meh, need to wrap all state updates in `new Map()` so react re-renders
  const [fileMap, setFileMap] = useState<Map<ReactFile["id"], FileData>>(
    new Map(),
  );

  const [status, setStatus] = useState<Status>(Status.Select);

  const addFiles = useCallback(
    (files: ReactFile[]) => {
      setFileMap((_fileMap) => {
        files.forEach((file) =>
          _fileMap.set(file.id, { file, status: Status.Select }),
        );
        return new Map(_fileMap);
      });
    },
    [setFileMap],
  );

  const updateFile = useCallback((data: FileData) => {
    setFileMap((_fileMap) => new Map(_fileMap.set(data.file.id, data)));
  }, []);

  const clearFiles = useCallback(() => {
    setFileMap(new Map());
  }, [setFileMap]);

  const { importHistory } = useSpotifyImportExtendedStreamingHistory();

  const handleImport = useCallback(async () => {
    setStatus(Status.Import);

    let errorOccurred = false;

    for (const data of fileMap.values()) {
      data.status = Status.Import;
      updateFile(data);

      let items: SpotifyExtendedStreamingHistoryItem[];

      // Scope so these tmp variables can be GC-ed ASAP
      {
        const fileContent = await data.file.text();

        const rawItems = JSON.parse(
          fileContent,
        ) as SpotifyExtendedStreamingHistoryItem[];

        items = rawItems
          .filter(({ spotify_track_uri }) => spotify_track_uri !== null)
          .map(({ ts, spotify_track_uri }) => ({
            ts,
            spotify_track_uri,
          }));
      }

      try {
        await importHistory(items);

        data.status = Status.Finished;
      } catch (err) {
        data.error = err as Error;
        data.status = Status.Error;

        errorOccurred = true;
      }
      updateFile(data);
    }

    if (!errorOccurred) {
      setStatus(Status.Finished);
    }
  }, [fileMap, importHistory, updateFile]);

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle>File Upload</CardTitle>
        <CardDescription>
          Select <Code>endsong_XY.json</Code> files here and start the import.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Files
          className="shadow-inner bg-gray-200 dark:bg-gray-700 rounded p-4 text-center cursor-pointer"
          dragActiveClassName=""
          onChange={addFiles}
          accepts={["application/json"]}
          multiple
          clickable
        >
          Drop files here or click to upload
        </Files>
        <Table>
          <TableBody>
            {Array.from(fileMap.values()).map((data) => (
              <File key={data.file.id} data={data} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex gap-x-2">
        <Button
          onClick={() =>
            handleImport().catch((e) => console.error("Import Failed:", e))
          }
          variant="secondary"
          disabled={status !== Status.Select}
        >
          Start Import
        </Button>
        <Button
          onClick={clearFiles}
          variant="secondary"
          disabled={status !== Status.Select}
        >
          Remove All Files
        </Button>
      </CardFooter>
    </Card>
  );
};

const File: React.FC<{ data: FileData }> = ({ data }) => {
  const hasErrors = data.status === Status.Error && data.error;

  return (
    <TableRow>
      <TableCell>{data.file.name}</TableCell>
      <TableCell className="text-sm font-thin">
        {data.file.sizeReadable}
      </TableCell>
      <TableCell className="text-right">
        {data.status === Status.Select && <Badge>Prepared for import!</Badge>}
        {data.status === Status.Import && <Badge>Loading!</Badge>}
        {data.status === Status.Finished && <Badge>Check!</Badge>}
        {hasErrors && (
          <Badge variant="destructive">
            <ErrorIcon />
            {data.error?.message}
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
};

const ImportProgress: React.FC = () => {
  const {
    importStatus: { total, imported },
    isLoading,
    reload,
  } = useSpotifyImportExtendedStreamingHistoryStatus();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        reload();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading, reload]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Progress</CardTitle>
        <CardDescription>
          Shows how many of the submitted listens are already imported and
          visible to you. This will take a while, and the process might halt for
          a few minutes if we hit the Spotify API rate limit. If this is not
          finished after a few hours, please contact your Listory administrator.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex pb-2">
          <div className="md:flex w-10/12">
            <div className={`md:w-full font-bold`}>
              Imported
              <br />
              {imported}
            </div>
          </div>
          <div className="w-2/12 text-right">
            Total
            <br />
            {total}
          </div>
        </div>
        {total > 0 && (
          <div className="h-2 w-full bg-gradient-to-r from-teal-200/25 via-green-400 to-violet-400 dark:from-teal-700/25 dark:via-green-600/85 dark:to-amber-500 flex flex-row-reverse">
            <div
              style={{ width: numberToPercent(1 - imported / total) }}
              className="h-full bg-gray-100 dark:bg-gray-900"
            ></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
