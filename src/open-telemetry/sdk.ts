import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { DnsInstrumentation } from "@opentelemetry/instrumentation-dns";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core";
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { Resource } from "@opentelemetry/resources";
import { NodeSDK, NodeSDKConfiguration } from "@opentelemetry/sdk-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { hostname } from "os";

const metricsEnabled = process.env.OTEL_METRICS_ENABLED === "true";
const tracesEnabled = process.env.OTEL_TRACES_ENABLED === "true";
const anyEnabled = metricsEnabled || tracesEnabled;

// We can not use ConfigService because the SDK needs to be initialized before
// Nest is allowed to start.
let sdkOptions: Partial<NodeSDKConfiguration> = {};

if (metricsEnabled) {
  sdkOptions.metricReader = new PrometheusExporter();
}

if (tracesEnabled) {
  sdkOptions.traceExporter = new OTLPTraceExporter({});
  sdkOptions.contextManager = new AsyncLocalStorageContextManager();
  sdkOptions.resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: "listory",
    [SemanticResourceAttributes.SERVICE_NAME]: "api",
    [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: hostname(),
  });
}

if (anyEnabled) {
  sdkOptions.instrumentations = [
    new DnsInstrumentation(),
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new NestInstrumentation(),
    new PgInstrumentation(),
    new PinoInstrumentation(),
  ];
}

export const otelSDK = new NodeSDK(sdkOptions);
