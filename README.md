<p align="center">
  <h2 href="http://nestjs.com/" target="blank" align="center">Listory</h2>
</p>
  
<p align="center">
  Login with Spotify and Listory will save all tracks you listen to.
</p>

## Installation

End-user Installation of Listory is not yet fully supported and the docs in this section are not complete.

### Configuration

All configuration must be set as environment variables. Default values are added in **bold**, values that are required are marked with _Required_.

#### Application

- `PORT`: **3000**: Port the webserver will listen on.
- `APP_URL`: **http://localhost:3000**: Public URL of the Application, is used to generate Links.

#### Authentication

- `JWT_SECRET`: _Required_, used to sign the JWTs.
- `JWT_ALGORITHM`: **HS256**: Algorithm used to sign the JWTs. One of `HS256`, `HS384`, `HS512`
- `JWT_EXPIRATION_TIME`: **1d**: Lifetime of signed JWTs. Accepts strings like `1d`, `2h`, `15m`.

#### Spotify

- `SPOTIFY_CLIENT_ID`: _Required_, Spotify App Client ID
- `SPOTIFY_CLIENT_SECRET`: _Required_, Spotify App Client Secret
- `SPOTIFY_FETCH_INTERVAL_SEC`: **60**: Interval for fetching recently listened tracks from Spotify.
- `SPOTIFY_WEB_API_URL`: **https://api.spotify.com/**: Spotify WEB API Endpoint.
- `SPOTIFY_AUTH_API_URL`: **https://accounts.spotify.com/**: Spotify Authentication API Endpoint.
- `SPOTIFY_USER_FILTER`: **""**: If set, only allow Spotify users with these ids to access the app. If empty, allow all users to access the app. Seperate ids with `,` eg.: `231421323123,other_id`.

#### Database

- `DB_HOST`: _Required_, Database host
- `DB_USERNAME`: _Required_, Database username
- `DB_PASSWORD`: _Required_, Database password
- `DB_DATABASE`: _Required_, Database database

#### Sentry

You can use Sentry to automatically detect and report any exceptions thrown.

- `SENTRY_ENABLED`: **false**, Set to `true` to enable Sentry.
- `SENTRY_DSN`: _Required_, but only if `SENTRY_ENABLED` is `true`. The [DSN](https://docs.sentry.io/product/sentry-basics/dsn-explainer/) for your Sentry project.

#### Prometheus

You can use Prometheus to track various metrics about your Listory deployment.

The metrics will be exposed on the `/api/metrics` endpoint. Make sure that this endpoint is not publicly available in your deployment.

- `PROMETHEUS_ENABLED`: **false**, Set to `true` to enable Prometheus Metrics.
- `PROMETHEUS_BASIC_AUTH`: **false**, Set to `true` to require basic auth to access the metrics endpoint.
- `PROMETHEUS_BASIC_AUTH_USERNAME`: _Required_, if `PROMETHEUS_BASIC_AUTH` is `true`.
- `PROMETHEUS_BASIC_AUTH_PASSWORD`: _Required_, if `PROMETHEUS_BASIC_AUTH` is `true`.

## Development

### Configure Spotify API Access

Copy the file `.env.sample` to `.env` and add your Spotify API Key.

### Starting the application

We use `docker-compose` to provide a full local development environment.

```bash
$ docker-compose up
```

You can now access the frontend at `http://localhost:3000` and the API at `http://localhost:3000/api`.

Frontend and API will automatically reload on any code changes.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Listory is [MIT licensed](LICENSE).
