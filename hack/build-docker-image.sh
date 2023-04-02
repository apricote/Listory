#!/usr/bin/env bash

set -o pipefail
set -e

PREPARE_OR_PUBLISH="$1"
VERSION="$2"

REPO="apricote/listory"

PLATFORMS="--platform=linux/amd64,linux/arm64"
TAGS="--tag ${REPO}:${VERSION} --tag ${REPO}:latest"
ARGS="--build-arg VERSION=${VERSION} --build-arg GIT_COMMIT=`git rev-parse HEAD`"

CACHE=""
PUSH=""

# We "build" the image twice, once in "prepare" and then again in "publish" stage.
# - Prepare makes sure that the image is buildable and utilizes the remote cache.
# - Publish utilizes the local cache from prepare stage and pushes the image.
if [ "$PREPARE_OR_PUBLISH" = "prepare" ]; then
  CACHE="--cache-from=type=registry,ref=${REPO}:buildcache --cache-to=type=registry,ref=${REPO}:buildcache"
else
  # Uses local buildkit cache
  PUSH="--push"
fi

docker buildx build $PLATFORMS $TAGS $ARGS $CACHE $PUSH .
