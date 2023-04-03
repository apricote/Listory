# syntax=docker/dockerfile:1.5

FROM scratch as ignore

WORKDIR /listory
COPY . /listory/

##################
## common
##################
FROM --platform=$BUILDPLATFORM node:18-alpine as common

WORKDIR /app

##################
## build-api
##################
FROM common as build-api
LABEL stage="build-api"

COPY *.json /app/
RUN --mount=type=cache,target=/home/root/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci

COPY src/ /app/src/
RUN NODE_ENV=production npm run build

##################
## build-frontend
##################
FROM common as build-frontend
LABEL stage="build-frontend"

ARG VERSION=unknown

WORKDIR /app/frontend

COPY frontend/package*.json /app/frontend/
RUN --mount=type=cache,target=/home/root/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci


COPY frontend/ /app/frontend/
RUN NODE_ENV=production npm run build

##################
## app
##################
FROM node:18-alpine as app

ARG VERSION=unknown
ARG GIT_COMMIT=unknown

LABEL org.opencontainers.image.title="listory" \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.revision=$GIT_COMMIT \
      stage="common"

WORKDIR /app

ENV NODE_ENV=production

COPY package.json /app/
COPY package-lock.json /app/
RUN --mount=type=cache,target=/home/root/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci --omit=dev

COPY --from=build-api /app/dist/ /app/dist/
COPY --from=build-frontend /app/frontend/build /app/static/

CMD ["dist/main"]
