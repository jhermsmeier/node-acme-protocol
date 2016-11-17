# Changelog

- [0.5.0](#0.5.0)
- [0.4.1](#0.4.1)
- [0.4.0](#0.4.0)
- [0.3.0](#0.3.0)
- [0.2.0](#0.2.0)
- [0.1.0](#0.1.0)

## 0.5.0

**Maintenance**

- e500f25b2a2d1c7787e7dac2a6b98089875a9fe1 – **package.json:** Version 0.5.0



## 0.4.1

**Features**

- 50cc7832572b96902354aac23ed1d995ec0256f0 – **lib/providers:** ACME.Provider

**Fixes**

- cd67388487069d259fd32c24204aaf36fb0cdc44 – **lib/freeze:** Fix ReferenceError in .forEach
- daf6dd9a0a23f6702bbf371bb458aa0d23687b14 – **lib/client:** Fix variable re-declaration

**Docs**

- 339dbf13473041545b6e5c6c5d89f2caac637934 – **README.md:** Add TOC, subdivide usage info
- 589ba01fdb2d766fd4ed92f0febaa84ce1da3c83 – **README.md:** Update badge labels
- 5ff6725a8f876b994af2d72ad39fbd3571819794 – **README.md:** Add Codacy code quality badge

**Maintenance**

- 9188a01cfed2e6ce9dd63e993c53fbfa5792ff1b – **package.json:** Version 0.4.1
- 2ad7ecc614a6737f2bb6c2a3977f17af231e5bf8 – **package.json:** Bump request 2.74.0 -> 2.75.0
- b3a6781410271615045d84cdf751540989f3a7f1 – **.npmignore:** Add *.md
- 1df00d08b5701ff76b034ff4a2f3a7e5eef270f3 – **.npmignore:** Add *.yml



## 0.4.0

**Features**

- 1c034266347924313e02eb8fc2e5c62869dd74d6 – **lib/client:** Add more debug()s
- b1a9c741815b628e05f000309e7b2ac143ce9888 – **lib/client:** Add `client.getRegistration()`
- fbe074b58d69515468cc2a02c75023f97ba3a5b6 – **lib/client:** Add ACME error URN as `error.code`
- 3e9afd8484c2d4dc654d2f20e47ea066fd8f047d – **lib/client:** Simplify signed payload bodies
- ce365e7837129f9dff0d849f6500635a4d6547cb – **lib/client:** Rename .getJWSPayload() to .signPayload()

**Fixes**

- 8ca9b161ce3e651529aa8428c6a5261f21df153b – **lib/client:** Fix automatic configuration
- 04bcf72fe370ae0906a0b7085cca1fbf236fbf76 – **lib/client:** Fix nonce replenishment

**Tests**

- 05d18ad27b1505f3e2c9d363b9346b3a1c835258 – **test:** Set stdout to blocking
- 5960a272d563f6b6c06052142e3aee8b7a86f71f – **test/sequence:** Add stub for updated TOS
- 3dbf54b39da82ff58beec497e83f9537b90705ec – **test/sequence:** Clear pending http reqs after test
- a4cce632a81b284c8e5d0d93fde8522531830e53 – **test/sequence:** Update registration URL

**Docs**

- 1f5e944e548f70ce07da910993958a8a68c9c4b6 – **README.md:** Add `client.newAuthorization()` example
- 524c562e0750dd34b849d6a80dbdf28b497c5afe – **README.md:** Update examples
- 3d106b865ae8c0ac0b80a99c6ddd72b58771709e – **lib/client:** Add docblock for `.newAuthorization()`
- 10366e3e92b28f3a637f0f8604bc4c2c83e2d2cb – **README.md:** Fix AppVeyor link
- 1972d2ec6d98aff1e4e5de75855fe9a681e08bcb – **README.md:** Add code climate & dependency ci badges

**Maintenance**

- 051f5d842e9fc8dd0a8e6680b45d616dbaba5753 – **package.json:** Version 0.4.0
- 03d377156171d119ac677e080a6a102fbc020d60 – **package.json:** Add missing `bloodline` dependency
- bcd9871b743dd2236f2c7c9e94574aa6f9e88420 – **package.json:** Bump dependencies



## 0.3.0

**Features**

- 0e5c15eeefd5ce78d8f9ecc001c41e66a9ef86fb – **lib/client:** Add debug http response status code
- ca3e721a8f6b38bedddf4558aec778f98878b71e – **lib/client:** Impl `.updateRegistration()`
- d3d62e0a842a5a51c6e6613277cfb6f4c983f4fd – **lib/client:** Add `_clientRequest()` cleaning up req/res handling
- 6b4f33158c66132a8f206715499add4be9193b55 – **lib/acme:** Add ACME.KEY_CHANGE resource type
- 8be107b537ad4c1bec9c4e971a70908270fb97cd – **lib/client:** Stub new-authz / new-app methods
- 3e7861e07a1d7655ac60e366d4c55720bdb23360 – **lib/acme:** Add 'new-app' resource dir entry type
- 8002f9f15101ee0e86c71eeff0214ed7e05a2fa9 – **lib/acme:** Add `unsupportedIdentifier` error code

**Fixes**

- 422f6574d56b9bf65e6f79fc4d14021a04effef6 – **lib/client:** Fix potential ReferenceError in ._clientRequest()

**Tests**

- 34626329b76d3bd62ef1b2a9bb43d0f0481de380 – **test:** Fix expected postdata (wrong nonce)
- 64ba27234f5bc4afba9d787fda35d0a1a7224a2d – **test:** Fix mock URL in reg update test
- 60e948057f8fa28e1107aded9ffc95f102ece9bf – **test:** Add test for updating registration w/ agreement

**Docs**

- aeb4624c4e5ae8de308381c975600662df50f441 – **README.md:** Add registration update usage
- 5d8c8b972dc4e9680018e6dc801cd7342cc6d7f1 – **README:** Add description / note

**Maintenance**

- 486c899132b570937b54804dc6056d02ade8e2b5 – **package.json:** Version 0.3.0
- ec7ed2e734e97c68d4389a9156663e35c5dbed59 – **package.json:** Update `request` to 2.74.0
- 7f7879635565d586122cef9ff9aea1b9d415208b – **.npmignore:** Add `examples`



## 0.2.0

**Features**

- 1b1b39bf52238708dbf1c2876acca13aeb7066a5 – **lib:** Add `client.getNonce()`, remove `ACME.getNonce()`
- 4ca88cf5783e4e302b8ad3793626330d32289341 – **lib/client:** Add `directoryPath` option
- 35afd329d773369cc33d58e60cad3934b84b056f – **lib/client:** Add `get isConfigured`, `.hasCapability()`
- 6d11f7baa98a612875489f763e9a6acdb75fa85c – **lib/client:** Add `.configure()`, remove `.getDirectory()`
- efaf699ca4b0706fb748e28b434e345ba464e1d0 – **test/sequence:** Cert issuance flow tests
- d5183ca6f70e64deffe6dfdec7bf989d5e9d073c – **test/util/keypair:** Generate a priv, pub key
- 02207884d980ce65863d3e1fadbe041c2e114138 – **lib/client:** Split out client from lib/acme
- 7640b75fd2962a7c0e16766af7ae61937f7d2fe6 – **lib/acme:** Add `ACME.generateNonce()`

**Fixes**

- 9ac8b9cc441f4059b546b21d0e3ae0b4b4ce0698 – **lib/acme:** Fix missing `crypto`, deprecate `recover-reg`

**Tests**

- 0d8418c038f2c9a8b057086faea5013beb4cf808 – **test/util:** Cache generated keypair, inc to 2048 bits
- e1696f2e1535828498230bc236970ede4ab54388 – **test:** Split out client tests into test/client
- 466e870fc742981be4b178015042285717cdee12 – **test:** Add `ACME_API_BASE_URL` constant
- 7c48ddb0ba38a6ac2e9ee24d780e8ce779b6f639 – **test:** Simplify, compact formatting
- 8463f6e63d6a22338f245e2c4e6d1f0eb7945d74 – **test,lib:** Trim whitespace

**Docs**

- af16d53f21eb9bd18b53f0924a6cf401e0a06685 – **README.md:** Update usage examples
- 50c2ff369f77008b10e68fd1999a237ff04a78a5 – **lib/client:** Add more jsdoc blocks
- f5f78522ece5a443c5075190c0941a78266c9e2e – **README.md:** Link to specification
- 1d0a561b588d1c786425589b8aee8e33f86c4efb – **README.md:** Description, badges, install cmd

**Maintenance**

- 6228551708ce6d4fc023288f4e2b2ad454831714 – **package.json:** Version 0.2.0
- 24aea1e55efb13d0e764734f147d7dd41e8b64ce – **.gitignore:** Add *.log
- 3f67042228df82aab65229b2ab8ba20f7ec5c548 – **.travis.yml:** Dedupe node v6, only build master



## 0.1.0

**Features**

- 9172489dd07926b66190270f221e66178933a6eb – **lib/acme:** Implement .getDirectory()

**Docs**

- 787fd605f1fccdd6fabbf9ee792c268b98819c41 – **README.md:** Add Usage section

**Maintenance**

- adb3b7891cb4470abbec9c5e72fa0e858a5fe92a – **package.json:** Version 0.1.0

