## [1.2.1](https://github.com/apricote/Listory/compare/v1.2.0...v1.2.1) (2020-05-11)


### Bug Fixes

* **deps:** pin dependencies ([c0caa31](https://github.com/apricote/Listory/commit/c0caa31a2b1ed53f69256633242515fa1ff45219))

# [1.2.0](https://github.com/apricote/Listory/compare/v1.1.0...v1.2.0) (2020-05-09)


### Features

* **api:** add listen report endpoint ([3828b84](https://github.com/apricote/Listory/commit/3828b841c2a5f30be19c923ee56ebdbad8e90398))
* **api:** enable global ValidationPipeline ([ddcdfff](https://github.com/apricote/Listory/commit/ddcdfff89b7e23ecb30c7ef09bf000dd8ac43353))
* **api:** filter recent listens by timespan ([c903093](https://github.com/apricote/Listory/commit/c9030937e2c816f7bbf52dad275279cd54b0a024))
* **frontend:** render simple listen report ([ebc0794](https://github.com/apricote/Listory/commit/ebc079435d1dbedb03510ddc97add6e29c8818f7))

# [1.1.0](https://github.com/apricote/Listory/compare/v1.0.1...v1.1.0) (2020-05-08)


### Features

* **cd:** add Helm Chart with automated releases ([1bdd618](https://github.com/apricote/Listory/commit/1bdd6181baf18a3f3608298fc4a8287228357eb8))

## [1.0.1](https://github.com/apricote/Listory/compare/v1.0.0...v1.0.1) (2020-05-07)


### Bug Fixes

* **cd:** docker image labels are missing values ([f68d05c](https://github.com/apricote/Listory/commit/f68d05ce1455d6500ab8599ffc5426d3b0aab088))

# 1.0.0 (2020-05-07)


### Bug Fixes

* **api:** redirect to frontend on spotify auth error ([cffdded](https://github.com/apricote/Listory/commit/cffddedc8189b2813bf20b23cf87bcccb40b33e0))
* **cd:** typo ([b8ee62f](https://github.com/apricote/Listory/commit/b8ee62ff09d0717d8bda3d8a00a772242df27095))
* **frontend:** fix minor styling+linting issues ([0abc594](https://github.com/apricote/Listory/commit/0abc594db44edf572d6904f3287ab800a3fc2aa0))


### Features

* **api:** add health-check endpoint ([202665a](https://github.com/apricote/Listory/commit/202665a51038cb64b058210f998ea8f04874848b))
* **cd:** configure automated semantic releases ([8e796d7](https://github.com/apricote/Listory/commit/8e796d7e78ad0d44f54439c35cdf6602c1b3a95c))
* **frontend:** style recent listens page ([1d5cefb](https://github.com/apricote/Listory/commit/1d5cefb44732fa0ae9021fa8fb03eb2ed8e35f26))
* add docs and polish ([75d3e2e](https://github.com/apricote/Listory/commit/75d3e2edbd4d0a867faf66241649884fe04d75e2))
* **api:** add getListens endpoint with pagination ([de6d057](https://github.com/apricote/Listory/commit/de6d057f80fb4f0b83c22ddf7bcc181cbca97c23))
* **api:** add optional spotify user whitelist ([a27fcce](https://github.com/apricote/Listory/commit/a27fcce03b2bfc8b463bdc6d0b2d4921abad5cd5))
* **api:** fetch listens from spotify ([f2065d3](https://github.com/apricote/Listory/commit/f2065d3f1ff56c992568bdae23bf6e2bea074cf5))
* **api:** listen on SIGTERM for graceful shutdown ([d58cb46](https://github.com/apricote/Listory/commit/d58cb46f3ed3812a017b609f6929f61923573385))
* **api:** setup database migrations ([a7c5c68](https://github.com/apricote/Listory/commit/a7c5c68540562e4667317c998505f049a1696f05))
* **api:** validate configuration ([e78c6e3](https://github.com/apricote/Listory/commit/e78c6e312dc4a7b3fbf8ff40f55cede74839a1fa))
* serve frontend from api container in prod build ([ad98ce4](https://github.com/apricote/Listory/commit/ad98ce4e880923001daea9794b3781f23fcfd657))
* **api:** setup logging ([b6eef7f](https://github.com/apricote/Listory/commit/b6eef7f0902e9878f3de7c77ceb8e20fbc344904))
* **api:** setup nestjs ([db62d5d](https://github.com/apricote/Listory/commit/db62d5d90899edcd8847174f67fcf3f8d86ad7de))
* **api:** user authentication ([f253a66](https://github.com/apricote/Listory/commit/f253a66f86d917a478cd2cf132303520912d262c))
* **frontend:** redo setup with ts+tailwind and implement auth+header ([05f230a](https://github.com/apricote/Listory/commit/05f230a7cebf484407dfd680faff7520c25949a6))
* **frontend:** setup ([f14eda1](https://github.com/apricote/Listory/commit/f14eda16ac1b20390508b35af80bea10cf144040))
* **frontend:** show page when login fails ([32dcd84](https://github.com/apricote/Listory/commit/32dcd84964c9f5dcf3e18bd214dbe08893a036a5))
* **frontend:** show recent listens ([49bff95](https://github.com/apricote/Listory/commit/49bff95ea59a6d5ac33c0277636e13d2679d9a47))
