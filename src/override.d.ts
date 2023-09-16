// Issue with opentelemetry-js: https://github.com/open-telemetry/opentelemetry-js/issues/3580#issuecomment-1701157270
export {};
declare global {
  type BlobPropertyBag = unknown;
}
