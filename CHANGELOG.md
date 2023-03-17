## [1.23.2](https://github.com/apricote/Listory/compare/v1.23.1...v1.23.2) (2023-03-17)


### Bug Fixes

* **api:** album&track reports only contain one artist ([471f46e](https://github.com/apricote/Listory/commit/471f46eb8d2d8347abca9a6a379559cd4f40efa4))
* **api:** properly handle errors in crawler loop ([0e2c56b](https://github.com/apricote/Listory/commit/0e2c56bf5f3aebef5b96354b873c1cf84e495199))

## [1.23.1](https://github.com/apricote/Listory/compare/v1.23.0...v1.23.1) (2023-03-12)


### Bug Fixes

* **api:** importer job was always importing first user ([821b91d](https://github.com/apricote/Listory/commit/821b91defeceec55c7ae84a4722eda0b951732ce))

# [1.23.0](https://github.com/apricote/Listory/compare/v1.22.0...v1.23.0) (2023-03-12)


### Features

* **api:** import listens after first sign in ([46b1650](https://github.com/apricote/Listory/commit/46b165006662d72223df9b37a8be68396ea76bab))
* **api:** poll listens less often if user is inactive ([14478a5](https://github.com/apricote/Listory/commit/14478a5418b6c195c527ba28cf82e52aae8dd6d5))
* **api:** use nest-pg-boss for spotify interactions ([b9f92bb](https://github.com/apricote/Listory/commit/b9f92bbdfabd418c15d3ef9d6bd82493dfe9b96e))

# [1.22.0](https://github.com/apricote/Listory/compare/v1.21.0...v1.22.0) (2023-02-21)


### Bug Fixes

* **frontend:** flashing content on useAsync reload ([e298282](https://github.com/apricote/Listory/commit/e298282f551e8080be88fa66d9672ce33835a736))


### Features

* **frontend:** manage API tokens in Frontend ([ac0f9ff](https://github.com/apricote/Listory/commit/ac0f9ff5d3c99a4383e16fea0a2d95c18cee41ea))

# [1.21.0](https://github.com/apricote/Listory/compare/v1.20.1...v1.21.0) (2023-02-19)


### Features

* **api:** API tokens for authentication ([8f7eebb](https://github.com/apricote/Listory/commit/8f7eebb806d2a23f69ab7271f378591e4e9f206b))

## [1.20.1](https://github.com/apricote/Listory/compare/v1.20.0...v1.20.1) (2022-09-28)


### Bug Fixes

* **dev:** broken traces with latest OTEL libraries ([515c80a](https://github.com/apricote/Listory/commit/515c80a6e3009b1fe16623ba12b9fc17b837051e))

# [1.20.0](https://github.com/apricote/Listory/compare/v1.19.1...v1.20.0) (2022-09-27)


### Features

* **api:** add local repl console ([0a9956e](https://github.com/apricote/Listory/commit/0a9956e1aec91019ede0720a4e49bb6501dc171e))
* **dev:** combine all docker-compose setups ([52a5a39](https://github.com/apricote/Listory/commit/52a5a39cb39c39b547ab57f30eb571fceda08f7a))

## [1.19.1](https://github.com/apricote/Listory/compare/v1.19.0...v1.19.1) (2022-09-26)


### Bug Fixes

* **dev:** traces not arriving in tempo 1.4+ ([1ac709d](https://github.com/apricote/Listory/commit/1ac709da24799a625506e161e37468db5b2e71a0))

# [1.19.0](https://github.com/apricote/Listory/compare/v1.18.2...v1.19.0) (2022-07-24)


### Bug Fixes

* **frontend:** crash when resetting DateSelect values ([65b0d24](https://github.com/apricote/Listory/commit/65b0d24903aa1df18febf37bb66b830982fd20ee))


### Features

* **frontend:** Dark Mode ([78c7afc](https://github.com/apricote/Listory/commit/78c7afc15263b8c93779d5bc07b1932b0e60055a))

## [1.18.2](https://github.com/apricote/Listory/compare/v1.18.1...v1.18.2) (2022-07-12)


### Bug Fixes

* **api:** missing OpenAPI route tags ([d6af6f9](https://github.com/apricote/Listory/commit/d6af6f9cbaa6558623a045597f80778524bc0dc7))

## [1.18.1](https://github.com/apricote/Listory/compare/v1.18.0...v1.18.1) (2022-07-07)


### Bug Fixes

* **api:** remove unwanted debug log messages ([2c8e8ef](https://github.com/apricote/Listory/commit/2c8e8ef23c45c7bdd40c66ad9d053be0257b84c4))

# [1.18.0](https://github.com/apricote/Listory/compare/v1.17.0...v1.18.0) (2022-06-29)


### Features

* **api:** metrics for Spotify API http requests ([41dfae3](https://github.com/apricote/Listory/commit/41dfae3c508e71f3c74f75dceba4de6bd68b6070))

# [1.17.0](https://github.com/apricote/Listory/compare/v1.16.4...v1.17.0) (2022-06-25)


### Bug Fixes

* **api:** some listens pages are not full ([be38c38](https://github.com/apricote/Listory/commit/be38c383ef3ea556bcb8b3136c15a75480328665))
* **frontend:** invalid react list keys ([fa2d1f4](https://github.com/apricote/Listory/commit/fa2d1f426f2c522187e7ce84812535a6a72bdefd))
* **frontend:** show empty report only when not loading ([79b375c](https://github.com/apricote/Listory/commit/79b375ca08ff80fbcab9bb9eff65568abfecfa2c))
* **frontend:** use sensible default values for custom time selector ([4758338](https://github.com/apricote/Listory/commit/4758338e99d204593bb61719637eef5509a12eee))


### Features

* **frontend:** nice login loading screen ([a443b3d](https://github.com/apricote/Listory/commit/a443b3ddbc82dd63c05edc0b08b82082f82d1d76))
* **frontend:** use nice looking spinner ([01ed0c5](https://github.com/apricote/Listory/commit/01ed0c54912fd6a801f6e11a802c95d4e2692c4a))
* **frontend:** use transition for showing new data ([0c4de5d](https://github.com/apricote/Listory/commit/0c4de5d56a3ae89196fc27893470822cc60f9d42))

## [1.16.4](https://github.com/apricote/Listory/compare/v1.16.3...v1.16.4) (2022-06-23)


### Bug Fixes

* **api:** send trace context to sentry ([8d9e990](https://github.com/apricote/Listory/commit/8d9e99039c40d8b447315701f4d04a229db254b2))

## [1.16.3](https://github.com/apricote/Listory/compare/v1.16.2...v1.16.3) (2022-06-19)


### Bug Fixes

* **api:** improve performance of all time listens report ([99a4593](https://github.com/apricote/Listory/commit/99a4593774b648ac3b76389c51523ceadf0898aa))
* **api:** missing await ([fd3fc6b](https://github.com/apricote/Listory/commit/fd3fc6b159343a7a8ec1d832786efe3a980a01eb))

## [1.16.2](https://github.com/apricote/Listory/compare/v1.16.1...v1.16.2) (2022-06-19)


### Bug Fixes

* **chart:** add support for Ingress v1 ([b2d704b](https://github.com/apricote/Listory/commit/b2d704bb3ec5c767c4b8c9f63c17b8f8685ba280))

## [1.16.1](https://github.com/apricote/Listory/compare/v1.16.0...v1.16.1) (2022-06-19)


### Bug Fixes

* **chart:** template references removed value ([99068c0](https://github.com/apricote/Listory/commit/99068c09bcee7f6084ba9769f2f2d1be7fc6c8ce))

# [1.16.0](https://github.com/apricote/Listory/compare/v1.15.1...v1.16.0) (2022-06-18)


### Bug Fixes

* **ci:** respect peer deps again ([9b7a01a](https://github.com/apricote/Listory/commit/9b7a01ab1cd9178b3ea9cb443003313ace5e7ec9))


### Features

* **observability:** add local grafana+prom stack for metrics insights ([d0a9b0a](https://github.com/apricote/Listory/commit/d0a9b0a07c3ceb49b879b87e98266bd43c9a46c6))
* **observability:** Replace Prometheus package with OpenTelemetry ([6b1640b](https://github.com/apricote/Listory/commit/6b1640b75349bd82650a045c9e05f34769692f85))

## [1.15.1](https://github.com/apricote/Listory/compare/v1.15.0...v1.15.1) (2022-06-11)


### Bug Fixes

* **api:** broken tests after linting fix ([a2ea89f](https://github.com/apricote/Listory/commit/a2ea89ff96a595680fdc46cb01de8e10e4bbd526))


### Reverts

* Revert "chore(deps): update dependency @types/node to v16" ([e2169c9](https://github.com/apricote/Listory/commit/e2169c9c18210fd0e74359ab016792f7c209fa1b))
* Revert "chore(deps): update nest monorepo" ([9260078](https://github.com/apricote/Listory/commit/92600782f6c0af0dff8850900cc74a3dc7c9627a))

# [1.15.0](https://github.com/apricote/Listory/compare/v1.14.2...v1.15.0) (2022-06-11)


### Bug Fixes

* **ci:** ignore failing peer resolution ([5409b98](https://github.com/apricote/Listory/commit/5409b98da1018f08e8a1196e2203dd86079982f7))
* **health:** remove faulty health check to spotify-auth ([7de5e14](https://github.com/apricote/Listory/commit/7de5e14d4ecb8000481d98f8a4b0f2ee03e39a5b))
* **health:** use not-deprecated sentry context ([f06b93e](https://github.com/apricote/Listory/commit/f06b93efbecfb29d36012c5694f23fc8ae53f22e))


### Features

* **api:** configurable max pool connections ([ee5bd41](https://github.com/apricote/Listory/commit/ee5bd41a372d32fb0fa53a394ad7343123aec382))

## [1.14.2](https://github.com/apricote/Listory/compare/v1.14.1...v1.14.2) (2022-06-11)


### Bug Fixes

* **health:** send healthcheck result to sentry to improve debugging ([dbf4374](https://github.com/apricote/Listory/commit/dbf4374aeba767ba6221ad2787922c905a35e989))

## [1.14.1](https://github.com/apricote/Listory/compare/v1.14.0...v1.14.1) (2021-11-21)


### Bug Fixes

* **deps:** incompatible class-transformer release ([72be403](https://github.com/apricote/Listory/commit/72be403fcf347e664a56701ef315550445b7069e))

# [1.14.0](https://github.com/apricote/Listory/compare/v1.13.0...v1.14.0) (2021-11-21)


### Bug Fixes

* **ci:** also provide GITHUB_TOKEN ([c033af7](https://github.com/apricote/Listory/commit/c033af7013bcd0a92de3eae486445719435af092))
* **ci:** provide PAT as GH_TOKEN ([7f6af16](https://github.com/apricote/Listory/commit/7f6af16d5508b3f55fd09907190f18795bb5503f))
* **ci:** use PAT for pushing changelog ([29fc348](https://github.com/apricote/Listory/commit/29fc3488cf333aaab8f13c7cbbc9baebeb6e22fb))


### Features

* **api:** update existing artists in MusicLibrary ([a0ffe10](https://github.com/apricote/Listory/commit/a0ffe108e152731d57dfda2a5b39edc2e7f2da5d))
* top genres report ([a0c28e2](https://github.com/apricote/Listory/commit/a0c28e2324ddd1e2726d419a2d144fbd3f03abd6))

# [1.13.0](https://github.com/apricote/Listory/compare/v1.12.0...v1.13.0) (2021-05-25)


### Features

* **server:** save genres for artists and albums ([3c6f328](https://github.com/apricote/Listory/commit/3c6f3289f1606865d9d869528c924c15321cc9a0))

# [1.12.0](https://github.com/apricote/Listory/compare/v1.11.1...v1.12.0) (2021-05-24)


### Bug Fixes

* **deps:** pin dependency @digikare/nestjs-prom to 1.0.0 ([3dee999](https://github.com/apricote/Listory/commit/3dee999df6997787448fd8229b83f601bd24917b))


### Features

* **frontend:** add footer with version number ([2aaf582](https://github.com/apricote/Listory/commit/2aaf582245c97f7627fd88f59073105bbf275f59))

## [1.11.1](https://github.com/apricote/Listory/compare/v1.11.0...v1.11.1) (2021-05-22)


### Bug Fixes

* **build:** tailwind config was missing from build ([06268c0](https://github.com/apricote/Listory/commit/06268c0cf632283c375424669b44d71731896e0c))

# [1.11.0](https://github.com/apricote/Listory/compare/v1.10.1...v1.11.0) (2021-05-22)


### Features

* **frontend:** add visual indicator to top lists ([8377b2f](https://github.com/apricote/Listory/commit/8377b2f6d0a966a44b5182f16c0a96fd43245efe))
* add top tracks report ([51fd78f](https://github.com/apricote/Listory/commit/51fd78f6d916eb26581745a0ce4109d9136b8084))

## [1.10.1](https://github.com/apricote/Listory/compare/v1.10.0...v1.10.1) (2021-05-20)


### Bug Fixes

* **api:** continue crawling when access token refresh fails for one user ([0c2188c](https://github.com/apricote/Listory/commit/0c2188c4d490536cc3609422614fadacf7324100))

# [1.10.0](https://github.com/apricote/Listory/compare/v1.9.0...v1.10.0) (2020-12-06)


### Features

* add optional basic auth for metrics endpoint ([879c6a6](https://github.com/apricote/Listory/commit/879c6a62e2642b886f3e62b235959de04e766f57))
* **helm:** add option to enable prometheus metrics ([a609720](https://github.com/apricote/Listory/commit/a6097204c7f66424ebcc5b00912f07b66d8bd2af))

# [1.9.0](https://github.com/apricote/Listory/compare/v1.8.0...v1.9.0) (2020-11-28)


### Bug Fixes

* **api:** missed listens from spotify ([5ca3437](https://github.com/apricote/Listory/commit/5ca3437b5945a9dc2364169d62be5fab8462874f))


### Features

* **api:** custom spotify crawler interval ([66fd6ce](https://github.com/apricote/Listory/commit/66fd6ce1b49d7a891e83d3033ff0838098dc77f2))

# [1.8.0](https://github.com/apricote/Listory/compare/v1.7.4...v1.8.0) (2020-11-21)


### Features

* **api:** add prometheus metrics ([e2056b4](https://github.com/apricote/Listory/commit/e2056b47340365efc13443010f8bd8106485b77a))

## [1.7.4](https://github.com/apricote/Listory/compare/v1.7.3...v1.7.4) (2020-11-21)


### Bug Fixes

* **api:** db error on duplicate music library import ([fcc2f7d](https://github.com/apricote/Listory/commit/fcc2f7d1b6549c7798fc858e7ca55ccbf450e4a8))

## [1.7.3](https://github.com/apricote/Listory/compare/v1.7.2...v1.7.3) (2020-11-18)


### Bug Fixes

* **api:** exception after refreshing spotify access token ([49b31e8](https://github.com/apricote/Listory/commit/49b31e8e6299148685cb2381cb43cd1c8a62dbb4))

## [1.7.2](https://github.com/apricote/Listory/compare/v1.7.1...v1.7.2) (2020-11-18)


### Bug Fixes

* **helm:** environment variable is set as boolean instead of string ([a8063cf](https://github.com/apricote/Listory/commit/a8063cfc32967cf26b7a6de05f1ec2f7494de786))

## [1.7.1](https://github.com/apricote/Listory/compare/v1.7.0...v1.7.1) (2020-11-17)


### Bug Fixes

* **helm:** add sentry options ([5ca6eba](https://github.com/apricote/Listory/commit/5ca6eba7649891e8d9e3ea06eb162ce45810b85a))

# [1.7.0](https://github.com/apricote/Listory/compare/v1.6.1...v1.7.0) (2020-11-17)


### Features

* **api:** setup optional sentry error reporting ([56db4cd](https://github.com/apricote/Listory/commit/56db4cd2e1cfbbb2edb004c8b32f8bebb4789348))

## [1.6.1](https://github.com/apricote/Listory/compare/v1.6.0...v1.6.1) (2020-11-15)


### Bug Fixes

* **deps:** update dependency @nestjs/passport to v7.1.0 ([ad85dd7](https://github.com/apricote/Listory/commit/ad85dd753df44d848313a32c892a66530567ba91))
* **deps:** update dependency @nestjs/swagger to v4.7.3 ([ac7ef85](https://github.com/apricote/Listory/commit/ac7ef857af91b37e4b36bad2abf06e74b576f9cb))
* **deps:** update dependency @nestjs/typeorm to v7.1.4 ([a6f496a](https://github.com/apricote/Listory/commit/a6f496a6d3a04f752b5f68ae98aee3e668fa736e))
* **deps:** update dependency @testing-library/user-event to v12.2.2 ([57258db](https://github.com/apricote/Listory/commit/57258db330c24da73427f01948d83ce45092f5bd))
* **deps:** update dependency @types/node to v12.19.4 ([ce4c5e9](https://github.com/apricote/Listory/commit/ce4c5e9fdb09e9e99d7b0e8323ffbeb7174b3a05))
* **deps:** update dependency postcss-cli to v7.1.2 ([945f192](https://github.com/apricote/Listory/commit/945f192f7e5d75261a8a8e6f738fa5fd7977df94))
* **deps:** update dependency rxjs to v6.6.3 ([7214b0c](https://github.com/apricote/Listory/commit/7214b0c51ee37b67015e68038672812a1eb71115))
* **deps:** update dependency tailwindcss to v1.9.6 ([7119457](https://github.com/apricote/Listory/commit/71194577735cd23de1a34d7e711c0da6f0f351fd))
* **deps:** update dependency typeorm to v0.2.29 ([ff2f1a0](https://github.com/apricote/Listory/commit/ff2f1a0ee79db85b0682c5d216ae4e67f0f40d39))
* **deps:** update various packages ([52b8d26](https://github.com/apricote/Listory/commit/52b8d26c186b48c12ac5864d36655e322b06e6b0))

# [1.6.0](https://github.com/apricote/Listory/compare/v1.5.0...v1.6.0) (2020-11-15)


### Features

* **frontend:** adopt card-style for recent listens ([6c8ac2b](https://github.com/apricote/Listory/commit/6c8ac2b7a540f0786daa7673190e5d6923ea8176))
* introduce new report "Top Albums" ([9896ea3](https://github.com/apricote/Listory/commit/9896ea31ff5633e66f54d435db8e832d48ba3ad4))
* **frontend:** proper styling for "Top Artists" report ([ca4e10e](https://github.com/apricote/Listory/commit/ca4e10e473970774c10e0f4c43f49cf7deb110cf))

# [1.5.0](https://github.com/apricote/Listory/compare/v1.4.4...v1.5.0) (2020-11-09)


### Features

* implement long-lived sessions ([44f7e26](https://github.com/apricote/Listory/commit/44f7e262703a68b147419748050cc72cffac756c))

## [1.4.4](https://github.com/apricote/Listory/compare/v1.4.3...v1.4.4) (2020-11-07)


### Bug Fixes

* **frontend:** improper usage of select element ([a139f7b](https://github.com/apricote/Listory/commit/a139f7b25b939b74a3a28eed12ba7b43a4ae8a50))
* **frontend:** missing dependency in useCallback ([1e674d1](https://github.com/apricote/Listory/commit/1e674d18c9fe39ddf0ecc6c493bc0f0ffc87db9d))
* **frontend:** missing key property in list ([1ae7f08](https://github.com/apricote/Listory/commit/1ae7f08dc430d6fa9088ea19d7c7fb3e89c69000))

## [1.4.3](https://github.com/apricote/Listory/compare/v1.4.2...v1.4.3) (2020-09-05)


### Bug Fixes

* **deps:** update dependency @nestjs/jwt to v7.1.0 ([e43f2ee](https://github.com/apricote/Listory/commit/e43f2ee1358ef5c47aa06ad435f07c83ead5b564))
* **deps:** update dependency @testing-library/jest-dom to v5.11.4 ([aaa9bff](https://github.com/apricote/Listory/commit/aaa9bff029b11c3d4fc907f92e8dff31ebe2b975))
* **deps:** update dependency @testing-library/react to v10.4.9 ([9a52905](https://github.com/apricote/Listory/commit/9a52905f12edc1a87f219521240525222157a702))
* **deps:** update dependency @testing-library/user-event to v12 ([8196db1](https://github.com/apricote/Listory/commit/8196db1280ae4a228f0cd0af6c46ff8da85d5ca9))
* **deps:** update dependency @types/node to v12.12.55 ([22aa30d](https://github.com/apricote/Listory/commit/22aa30d82dc8f6a785d4d780778785914ccfd4fb))
* **deps:** update dependency @types/react to v16.9.49 ([382f96f](https://github.com/apricote/Listory/commit/382f96f7f101f956af19cba848beee545736fd91))
* **deps:** update dependency @types/recharts to v1.8.15 ([f5f9dec](https://github.com/apricote/Listory/commit/f5f9decf95018a10b72bca0f690e6a2894c00b45))
* **deps:** update dependency autoprefixer to v9.8.6 ([60cedf0](https://github.com/apricote/Listory/commit/60cedf068c1f8bed66cb8f82af41cb724405fc44))
* **deps:** update dependency class-transformer to v0.3.1 [security] ([6c54ad0](https://github.com/apricote/Listory/commit/6c54ad0a7408f80f722591444b05e4f4359fc3eb))
* **deps:** update dependency date-fns to v2.16.1 ([0e25114](https://github.com/apricote/Listory/commit/0e2511430e682c30f84f3ff0bf61ccbfda3759f9))
* **deps:** update dependency nestjs-typeorm-paginate to v2.1.1 ([0ffb3da](https://github.com/apricote/Listory/commit/0ffb3da1dbbe2d9a57ce0fb1ae66aba9c43737b4))
* **deps:** update dependency pg to v8.3.3 ([349b28e](https://github.com/apricote/Listory/commit/349b28e879cd3599c88c23a2b44251ddad2c3b8f))
* **deps:** update dependency react-router-dom to v5.2.0 ([2930bb3](https://github.com/apricote/Listory/commit/2930bb31ceb9e3a81c97d7130acc5c7c9eedaf8d))
* **deps:** update dependency rxjs to v6.6.2 ([341a2ab](https://github.com/apricote/Listory/commit/341a2ab68b86a80345fb6f19ddb54b915adf3e75))
* **deps:** update dependency tailwindcss to v1.8.2 ([759d7aa](https://github.com/apricote/Listory/commit/759d7aac5f8e8e232fcaf5d1319803c7437ac0dc))
* **deps:** update package-lock.json after deps updates ([71591bf](https://github.com/apricote/Listory/commit/71591bf6ff4bb59cd174b7cd2dafd7fbd5906e66))
* jest root folder config ([0d8bc26](https://github.com/apricote/Listory/commit/0d8bc26f0d10516e6ca812dd995be4ccdc92e953))

## [1.4.2](https://github.com/apricote/Listory/compare/v1.4.1...v1.4.2) (2020-07-12)


### Bug Fixes

* **server:** improve listens report response time ([fb9b83d](https://github.com/apricote/Listory/commit/fb9b83d440e10984ed6bb93719d9443d9c9ecb2c))

## [1.4.1](https://github.com/apricote/Listory/compare/v1.4.0...v1.4.1) (2020-07-11)


### Bug Fixes

* improve top-artists response time ([aecc825](https://github.com/apricote/Listory/commit/aecc82576a356321a6bb86345c67fd42da8c8215))
* remove debug logging ([f562186](https://github.com/apricote/Listory/commit/f56218602e9a56221867f4357901e58e37720579))

# [1.4.0](https://github.com/apricote/Listory/compare/v1.3.4...v1.4.0) (2020-07-04)


### Features

* add top-artists report ([6fc10c4](https://github.com/apricote/Listory/commit/6fc10c40caa3d79c0e0e8b931e0fd194942fc47e))
* **frontend:** improve loading spinner ([42e8b88](https://github.com/apricote/Listory/commit/42e8b886a05bd8129523ebd77d294352b7e91971))

## [1.3.4](https://github.com/apricote/Listory/compare/v1.3.3...v1.3.4) (2020-07-04)


### Bug Fixes

* **deps:** update dependency @fullhuman/postcss-purgecss to v2.3.0 ([64817b9](https://github.com/apricote/Listory/commit/64817b9bacbd9628531f62df946cce0b855cb2ac))
* **deps:** update dependency @nestjs/config to v0.5.0 ([4677033](https://github.com/apricote/Listory/commit/46770337e1a21d692ef9a678d82bda0bebaa2093))
* **deps:** update dependency @nestjs/serve-static to v2.1.3 ([3d8c9f9](https://github.com/apricote/Listory/commit/3d8c9f91666d0ccc1e1fa4d2c2208b4b50ab3001))
* **deps:** update dependency @nestjs/swagger to v4.5.12 ([f11436c](https://github.com/apricote/Listory/commit/f11436c69c161194d6fe94afdf77dbd953add6fd))
* **deps:** update dependency @nestjs/typeorm to v7.1.0 ([ff24aee](https://github.com/apricote/Listory/commit/ff24aee4c5cd9e37b979a53b006beeceb1d9cd7b))
* **deps:** update dependency @testing-library/jest-dom to v5.11.0 ([8383c3d](https://github.com/apricote/Listory/commit/8383c3dd83abed538670572434388a8184191faf))
* **deps:** update dependency @testing-library/react to v10.4.3 ([161b731](https://github.com/apricote/Listory/commit/161b731405b5c5445e6fea9e0541077f7d604500))
* **deps:** update dependency @testing-library/user-event to v10.4.1 ([e7463b5](https://github.com/apricote/Listory/commit/e7463b57f734b60d5d64e2d2528ccf0de81ca322))
* **deps:** update dependency @types/node to v12.12.47 ([1dd5b3a](https://github.com/apricote/Listory/commit/1dd5b3a4ad6e45bb755b5af9bc9aa5873d5de2f1))
* **deps:** update dependency @types/react to v16.9.41 ([f9107b7](https://github.com/apricote/Listory/commit/f9107b74aaed2e36212b400ad187a5e05fab6a0b))
* **deps:** update dependency @types/react-dom to v16.9.8 ([cd5dcfa](https://github.com/apricote/Listory/commit/cd5dcfa12681b9ef1f5cedb1038c99ea00767282))

## [1.3.3](https://github.com/apricote/Listory/compare/v1.3.2...v1.3.3) (2020-06-01)


### Bug Fixes

* **frontend:** fix encoding of queryparameters in api calls ([40ce26e](https://github.com/apricote/Listory/commit/40ce26eadd4fa2ffdbdcf4bec4c92bc9b62133df))
* **server:** validate listens report query params ([6f8fc02](https://github.com/apricote/Listory/commit/6f8fc0265ae50a80e593e89be0bfa0cdbce3a9e6))

## [1.3.2](https://github.com/apricote/Listory/compare/v1.3.1...v1.3.2) (2020-05-20)


### Bug Fixes

* **deps:** update dependency @nestjs/config to v0.4.2 ([f4f9432](https://github.com/apricote/Listory/commit/f4f94322c0e0624517b173689c6beeccd15b83fd))
* **deps:** update dependency @nestjs/schedule to v0.4.0 ([5104772](https://github.com/apricote/Listory/commit/5104772acb03d48df723451389970844cd86cc6b))
* **deps:** update dependency @nestjs/serve-static to v2.1.1 ([9ed69d2](https://github.com/apricote/Listory/commit/9ed69d2db4da36d2b70c5e64a47ebfff866f9767))

## [1.3.1](https://github.com/apricote/Listory/compare/v1.3.0...v1.3.1) (2020-05-14)


### Bug Fixes

* **frontend:** disable broken service-worker ([7ad4b1e](https://github.com/apricote/Listory/commit/7ad4b1e52c7b53702d923d226f4aa516835ef149))

# [1.3.0](https://github.com/apricote/Listory/compare/v1.2.5...v1.3.0) (2020-05-14)


### Features

* **frontend:** active service worker ([fbada1e](https://github.com/apricote/Listory/commit/fbada1eaac7cedf495791dfbcaf7618f4163724c))
* **frontend:** add favicon ([bf9aba3](https://github.com/apricote/Listory/commit/bf9aba3033f3c63048fbcf65f8f75c3b1556ce1e))
* **frontend:** configure pwa ([b9ea880](https://github.com/apricote/Listory/commit/b9ea8808f229ca3f286cb0f33bf85e9fa6c2a20f))

## [1.2.5](https://github.com/apricote/Listory/compare/v1.2.4...v1.2.5) (2020-05-13)


### Bug Fixes

* **frontend:** add selectable timeframe and styling to listens report ([cc7f4b3](https://github.com/apricote/Listory/commit/cc7f4b354df48f5e73b8cf7e82b578bbb796b7c1))

## [1.2.4](https://github.com/apricote/Listory/compare/v1.2.3...v1.2.4) (2020-05-13)


### Bug Fixes

* **api:** frontend sessions expire after 15 minutes (now 1d) ([8c5f495](https://github.com/apricote/Listory/commit/8c5f495ce50f732c895a8b53c939f18dbc235154))
* **frontend:** improve reporting charts ([bdbe5f5](https://github.com/apricote/Listory/commit/bdbe5f574a52099974ef82b26fa728675b21067d))
* **frontend:** redirect to home after login ([367f375](https://github.com/apricote/Listory/commit/367f37555fa5ccfbadf7f690137eed22ff82a0bd))

## [1.2.3](https://github.com/apricote/Listory/compare/v1.2.2...v1.2.3) (2020-05-12)


### Bug Fixes

* **ci:** Helm chart still not properly released ([f0100e8](https://github.com/apricote/Listory/commit/f0100e87e23eeb8297053ebc684423d3069275be))

## [1.2.2](https://github.com/apricote/Listory/compare/v1.2.1...v1.2.2) (2020-05-11)


### Bug Fixes

* **ci:** Helm chart was not automatically released ([ff0c155](https://github.com/apricote/Listory/commit/ff0c1553f043d00fde7d419d222121253682a77a))

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
