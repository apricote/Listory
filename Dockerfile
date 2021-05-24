##################
## common
##################
FROM node:16-alpine as common

ARG VERSION=unknown
ARG GIT_COMMIT=unknown

LABEL org.opencontainers.image.title="listory" \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.revision=$GIT_COMMIT \
      stage="common"

WORKDIR /app

COPY *.json /app/
COPY frontend/*.json /app/frontend/

##################
## build-api
##################
FROM common as build-api
LABEL stage="build-api"

RUN npm ci

COPY src/ /app/src/
RUN NODE_ENV=production npm run build

##################
## build-frontend
##################
FROM common as build-frontend
LABEL stage="build-frontend"

ARG VERSION=unknown

WORKDIR /app/frontend

RUN npm ci

COPY frontend/postcss.config.js /app/frontend/postcss.config.js
COPY frontend/tailwind.config.js /app/frontend/tailwind.config.js
COPY frontend/src/ /app/frontend/src/
COPY frontend/public/ /app/frontend/public/
COPY frontend/.env.production /app/frontend/.env.production
RUN NODE_ENV=production npm run build

##################
## app
##################
FROM common as app
LABEL stage="app"

RUN npm ci --only=production
COPY --from=build-api /app/dist/ /app/dist/
COPY --from=build-frontend /app/frontend/build /app/static/

CMD ["dist/main"]
