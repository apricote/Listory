FROM node:12-alpine as common
LABEL org.label-schema.schema-version="1.0" \
      org.label-schema.name="listory" \
      stage="common"
WORKDIR /app
COPY *.json /app/

FROM common as builder
LABEL stage="builder"

RUN npm ci

COPY src/ /app/src/
RUN npm run build


FROM common as app
LABEL stage="app"

RUN npm ci --only=production
COPY --from=builder /app/dist/ /app/dist/

CMD ["dist/main"]
