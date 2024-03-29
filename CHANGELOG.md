## [3.1.0](https://github.com/justinawrey/fsrouter/compare/3.0.1...3.1.0) (2023-02-20)


### Features

* support deno deploy ([a9bf2bc](https://github.com/justinawrey/fsrouter/commit/a9bf2bc0a411aaff81a181a54ed90a9cc7743497))

## [3.0.1](https://github.com/justinawrey/fsrouter/compare/3.0.0...3.0.1) (2023-02-19)


### Bug Fixes

* boot message display incorrect for certain cwds ([cc4ba83](https://github.com/justinawrey/fsrouter/commit/cc4ba8398e95484bd577eba0ca830141fbf7e8ea))

## [3.0.0](https://github.com/justinawrey/fsrouter/compare/2.14.1...3.0.0) (2023-02-19)


### ⚠ BREAKING CHANGES

* disallow relative paths and auto unwrap file:// paths

### Bug Fixes

* disallow relative paths and auto unwrap file:// paths ([b8a4aa4](https://github.com/justinawrey/fsrouter/commit/b8a4aa43c616b39ac1a8ba7f6016c2bf83158553))

## [2.14.1](https://github.com/justinawrey/fsrouter/compare/2.14.0...2.14.1) (2023-02-19)


### Bug Fixes

* strip file extension from route in boot msg ([81d229e](https://github.com/justinawrey/fsrouter/commit/81d229e4167749702ef57323d28ecac40aaee471))

## [2.14.0](https://github.com/justinawrey/fsrouter/compare/2.13.0...2.14.0) (2023-02-18)


### Features

* adds prettier boot message ([1b2c451](https://github.com/justinawrey/fsrouter/commit/1b2c451c434f78f22689384326a36c29ad9aac1f))

## [2.13.0](https://github.com/justinawrey/fsrouter/compare/2.12.2...2.13.0) (2022-09-19)


### Features

* use std 0.156.0 ([481849f](https://github.com/justinawrey/fsrouter/commit/481849f546cb1925b44e91d238a5a3a74248f4f5))

## [2.12.2](https://github.com/justinawrey/fsrouter/compare/2.12.1...2.12.2) (2022-09-10)


### Bug Fixes

* typed slugs should match before untyped slugs ([233aa1f](https://github.com/justinawrey/fsrouter/commit/233aa1fde7f8c0d27d71c3bccf230f566c0e39fe))

## [2.12.1](https://github.com/justinawrey/fsrouter/compare/2.12.0...2.12.1) (2022-09-05)


### Bug Fixes

* correct broken types re-export from mod.ts ([ecb810f](https://github.com/justinawrey/fsrouter/commit/ecb810fc6e112496d0801f34963dbccb8d582ca1))

## [2.12.0](https://github.com/justinawrey/fsrouter/compare/2.11.1...2.12.0) (2022-09-05)


### Features

* add option for toggling automatic number conversion behavior ([1f12358](https://github.com/justinawrey/fsrouter/commit/1f12358fb8a167173d4b2df56cf30f934b70e2ee))
* allow typed slugs based on :string or :number postfix ([154ecf2](https://github.com/justinawrey/fsrouter/commit/154ecf2782fba4136b19c1da273808cd704b82dd))

## [2.11.1](https://github.com/justinawrey/fsrouter/compare/2.11.0...2.11.1) (2022-09-03)


### Bug Fixes

* more deterministic route matching for routes with multiple slugs ([3d71ae4](https://github.com/justinawrey/fsrouter/commit/3d71ae442f9f62c07c21293baa5cb58647364728))

## [2.11.0](https://github.com/justinawrey/fsrouter/compare/2.10.1...2.11.0) (2022-08-31)


### Features

* adds --version to cli ([8e0fa88](https://github.com/justinawrey/fsrouter/commit/8e0fa889147ddd4d52e9337e378691b9bc98a573))

## [2.10.1](https://github.com/justinawrey/fsrouter/compare/2.10.0...2.10.1) (2022-08-31)


### Bug Fixes

* boot message should show '.' instead of '' if rootDir is cwd ([e8cd760](https://github.com/justinawrey/fsrouter/commit/e8cd76081ac54f60f10311a9a21913f51daf831f))

## [2.10.0](https://github.com/justinawrey/fsrouter/compare/2.9.1...2.10.0) (2022-08-31)


### Features

* rudimentary cli ([2d54dfa](https://github.com/justinawrey/fsrouter/commit/2d54dfa752f427e7d04a0bd405729d154dee2237))

## [2.9.1](https://github.com/justinawrey/fsrouter/compare/2.9.0...2.9.1) (2022-08-30)


### Bug Fixes

* re-exports everything to be accessible from mod.ts ([fed3eb7](https://github.com/justinawrey/fsrouter/commit/fed3eb7fa6892f8233d07c46aff2576b56c47fdd))

## [2.9.0](https://github.com/justinawrey/fsrouter/compare/2.8.0...2.9.0) (2022-08-30)


### Features

* adds debug mode ([97e643d](https://github.com/justinawrey/fsrouter/commit/97e643dc0d9f21d2e0f534b441715968f5dad064))

## [2.8.0](https://github.com/justinawrey/fsrouter/compare/2.7.0...2.8.0) (2022-08-29)


### Features

* update deno.land/x docs ([7e1fd93](https://github.com/justinawrey/fsrouter/commit/7e1fd93b82043efff353ac6f8d669a377b82a222))

## [2.7.0](https://github.com/justinawrey/fsrouter/compare/2.6.0...2.7.0) (2022-08-29)


### Features

* use relative paths for boot message ([92af614](https://github.com/justinawrey/fsrouter/commit/92af61442d6b99caba02f5eb34f53325cf4764e9))

## [2.6.0](https://github.com/justinawrey/fsrouter/compare/2.5.0...2.6.0) (2022-08-29)


### Features

* initial slugs support ([4740001](https://github.com/justinawrey/fsrouter/commit/47400019e730e9cf53bce4ef6749c5d4023c8e53))


### Bug Fixes

* slug matching bug with preceding and trailing extra path parts ([72553e4](https://github.com/justinawrey/fsrouter/commit/72553e455167dc1ea08c623e4eb4f3b672037ccb))

## [2.5.0](https://github.com/justinawrey/fsrouter/compare/2.4.3...2.5.0) (2022-08-24)


### Features

* add .jsx and .tsx support ([0f1fb31](https://github.com/justinawrey/fsrouter/commit/0f1fb318cdaf9b1062f7736315f750f1ae17d12d))

## [2.4.3](https://github.com/justinawrey/fsrouter/compare/2.4.2...2.4.3) (2022-08-22)


### Bug Fixes

* show correct response text at example route /contact ([b8438c9](https://github.com/justinawrey/fsrouter/commit/b8438c95018c64771da4b1d8f44ca31c82a64697))

## [2.4.2](https://github.com/justinawrey/fsrouter/compare/2.4.1...2.4.2) (2022-08-21)


### Bug Fixes

* resolve path issues when running example directly from remote url ([32542b9](https://github.com/justinawrey/fsrouter/commit/32542b91f3fc8049ff224474f7850c1b44ce9280))

## [2.4.1](https://github.com/justinawrey/fsrouter/compare/2.4.0...2.4.1) (2022-08-21)


### Bug Fixes

* file path issues when pulling from deno.land ([9077480](https://github.com/justinawrey/fsrouter/commit/90774801f23e17dbe3e0e3004e1b99fd0e1d9f5e))

## [2.4.0](https://github.com/justinawrey/fsrouter/compare/2.3.0...2.4.0) (2022-08-21)


### Features

* support routes written in .js files ([342594d](https://github.com/justinawrey/fsrouter/commit/342594d6980394a50220b72b02c0f8f2896a6565))

## [2.3.0](https://github.com/justinawrey/fsrouter/compare/2.2.1...2.3.0) (2022-08-21)


### Features

* show warning message if trying to serve from empty directory ([f7479c2](https://github.com/justinawrey/fsrouter/commit/f7479c278075604c82b99ceee03120b5d0aeae9d))


### Bug Fixes

* use proper grammar in boot message ([a0bc15c](https://github.com/justinawrey/fsrouter/commit/a0bc15c1b2b7302427e6d2fb3087e6e144f7b4e3))

## [2.2.1](https://github.com/justinawrey/fsrouter/compare/v2.2.0...2.2.1) (2022-08-20)


### Bug Fixes

* remove import maps to ease dx ([4afd503](https://github.com/justinawrey/fsrouter/commit/4afd5034fdb0581d01573bb435370905b10e9cd5))

## [2.2.0](https://github.com/justinawrey/fsrouter/compare/v2.1.2...v2.2.0) (2022-08-20)


### Features

* add an easily runnable example.ts ([12ada92](https://github.com/justinawrey/fsrouter/commit/12ada92144a2f0037b6fff80e4cbe8d20dec9349))

## [2.1.2](https://github.com/justinawrey/fsrouter/compare/v2.1.1...v2.1.2) (2022-08-20)


### Bug Fixes

* deno.land/x/fsrouter docs update ([ec04a46](https://github.com/justinawrey/fsrouter/commit/ec04a4694600fdddb22cb7b4ad6bb17cc6eeb2c7))

## [2.1.1](https://github.com/justinawrey/fsrouter/compare/v2.1.0...v2.1.1) (2022-08-20)


### Bug Fixes

* fix deno.land docs ([8a5514a](https://github.com/justinawrey/fsrouter/commit/8a5514a2495363b469580ae851e732fcc0e70ce6))

## [2.1.0](https://github.com/justinawrey/fsrouter/compare/v2.0.1...v2.1.0) (2022-08-20)


### Features

* add additional example in fsRouter jsdoc ([fb604e6](https://github.com/justinawrey/fsrouter/commit/fb604e6dc805b90260378dcf7557ce243622fe1a))

## [2.0.1](https://github.com/justinawrey/fsrouter/compare/v2.0.0...v2.0.1) (2022-08-20)


### Bug Fixes

* typo in fsRouter jsdoc ([fdfda19](https://github.com/justinawrey/fsrouter/commit/fdfda19e052555bf7a10963d732fea3488bccfc1))

## [2.0.0](https://github.com/justinawrey/fsrouter/compare/v1.2.0...v2.0.0) (2022-08-20)


### ⚠ BREAKING CHANGES

* make fsRouter a named export of mod.ts

### Features

* make fsRouter a named export of mod.ts ([68e774b](https://github.com/justinawrey/fsrouter/commit/68e774bbd8e0feef0956f1c2704c09558751c0d6))

## [1.2.0](https://github.com/justinawrey/fsrouter/compare/v1.1.0...v1.2.0) (2022-08-20)


### Features

* add boot message ([ba8ca55](https://github.com/justinawrey/fsrouter/commit/ba8ca55dd4826f55b5015b2ba52b928a90d32c54))

## [1.1.0](https://github.com/justinawrey/fsrouter/compare/v1.0.0...v1.1.0) (2022-08-20)


### Features

* respond with 404 on invalid routes ([803150b](https://github.com/justinawrey/fsrouter/commit/803150b5a02908c4f589f1d36cc7f516339bd4b1))

## 1.0.0 (2022-08-19)


### Features

* release 1.0.0 ([f8a05b8](https://github.com/justinawrey/fsrouter/commit/f8a05b85167979d45f49a8b093803e467368d4fa))
