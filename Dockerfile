##################
## common
##################
FROM node:12-alpine as common
LABEL org.label-schema.schema-version="1.0" \
      org.label-schema.name="listory" \
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
RUN npm run build

##################
## build-frontend
##################
FROM common as build-frontend
LABEL stage="build-frontend"

WORKDIR /app/frontend

RUN npm ci

COPY frontend/src/ /app/frontend/src/
COPY frontend/public/ /app/frontend/public/
RUN npm run build

##################
## app
##################
FROM common as app
LABEL stage="app"

RUN npm ci --only=production
COPY --from=build-api /app/dist/ /app/dist/
COPY --from=build-frontend /app/frontend/dist /app/static/

CMD ["dist/main"]
