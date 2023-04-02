#!/usr/bin/env bash

set -o pipefail
set -e

PREPARE_OR_PUBLISH="$1"
VERSION="$2"

REPO="apricote/listory"

PLATFORMS="--platform=linux/amd64,linux/arm64"
TAGS="--tag ${REPO}:${VERSION} --tag ${REPO}:latest"
ARGS="--build-arg VERSION=${VERSION} --build-arg GIT_COMMIT=`git rev-parse HEAD`"
CACHE="--cache-from=type=registry,ref=${REPO}:buildcache --cache-to=type=registry,ref=${REPO}:buildcache,mode=max"


# We "build" the image twice, once in "prepare" and then again in "publish" stage:
# - Prepare makes sure that the image is buildable
# - Publish utilizes the local cache from prepare stage and pushes the image
PUSH=""
if [ "$PREPARE_OR_PUBLISH" = "publish" ]; then
  PUSH="--push"
fi

docker buildx build $PLATFORMS $TAGS $ARGS $CACHE $PUSH .
