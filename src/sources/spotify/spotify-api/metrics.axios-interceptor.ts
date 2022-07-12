import {
  AxiosFulfilledInterceptor,
  AxiosInterceptor,
  AxiosResponseCustomConfig,
} from "@narando/nest-axios-interceptor";
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { Counter, Histogram } from "@opentelemetry/api-metrics";
import type { AxiosRequestConfig } from "axios";
import { MetricService } from "nestjs-otel";
import { UrlValueParserService } from "../../../open-telemetry/url-value-parser.service";

const SPOTIFY_API_METRICS_CONFIG_KEY = Symbol("kSpotifyApiMetricsInterceptor");

// Merging our custom properties with the base config
interface SpotifyApiMetricsConfig extends AxiosRequestConfig {
  [SPOTIFY_API_METRICS_CONFIG_KEY]: {
    startTime: number;
  };
}

@Injectable()
export class MetricsInterceptor extends AxiosInterceptor<SpotifyApiMetricsConfig> {
  private readonly logger = new Logger(this.constructor.name);
  responseCounter: Counter;
  requestHistogram: Histogram;

  constructor(
    httpService: HttpService,
    metricService: MetricService,
    private readonly urlValueParserService: UrlValueParserService
  ) {
    super(httpService);

    this.responseCounter = metricService.getCounter(
      "listory_spotify_api_http_response",
      { description: "Total number of HTTP responses from Spotify API" }
    );

    this.requestHistogram = metricService.getHistogram(
      "listory_spotify_api_http_request_duration_seconds",
      {
        description:
          "HTTP latency value recorder in seconds for requests made to Spotify API",
        unit: "seconds",
      }
    );
  }

  protected requestFulfilled(): AxiosFulfilledInterceptor<SpotifyApiMetricsConfig> {
    return (config) => {
      config[SPOTIFY_API_METRICS_CONFIG_KEY] = {
        startTime: new Date().getTime(),
      };

      return config;
    };
  }

  responseFulfilled(): AxiosFulfilledInterceptor<
    AxiosResponseCustomConfig<SpotifyApiMetricsConfig>
  > {
    return (response) => {
      const startTime =
        response.config[SPOTIFY_API_METRICS_CONFIG_KEY].startTime;
      const endTime = new Date().getTime();
      const responseTimeSeconds = (endTime - startTime) / 1000;

      const metricLabels = {
        method: response.config.method.toUpperCase(),
        status: response.status.toString(),
        path: this.urlValueParserService.replacePathValues(
          response.config.url,
          "<id>"
        ),
      };

      this.requestHistogram.record(responseTimeSeconds, metricLabels);
      this.responseCounter.add(1, metricLabels);

      return response;
    };
  }
}
