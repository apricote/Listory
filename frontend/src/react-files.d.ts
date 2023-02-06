//// <reference types="react" />

declare module "react-files" {
  declare const Files: React.FC<
    Partial<{
      accepts: string[];
      children: React.ReactNode;
      className: string;
      clickable: boolean;
      dragActiveClassName: string;
      inputProps: unknown;
      multiple: boolean;
      maxFiles: number;
      maxFileSize: number;
      minFileSize: number;
      name: string;
      onChange: (files: ReactFile[]) => void;
      onDragEnter: () => void;
      onDragLeave: () => void;
      onError: (
        error: { code: number; message: string },
        file: ReactFile
      ) => void;
      style: object;
    }>
  >;

  export type ReactFile = File & {
    id: string;
    extension: string;
    sizeReadable: string;
    preview: { type: "image"; url: string } | { type: "file" };
  };

  export default Files;
}
