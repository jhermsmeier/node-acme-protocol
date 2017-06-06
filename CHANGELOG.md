# Changelog

- [0.5.1](#051)
- [0.5.0](#050)
- [0.4.1](#041)
- [0.4.0](#040)
- [0.3.0](#030)
- [0.2.0](#020)
- [0.1.0](#010)

# 0.5.1

**Maintenance**

- **package:** Update dependencies



# 0.5.0

**Maintenance**

- **package.json:** Version 0.5.0



# 0.4.1

**Features**

- **lib/providers:** ACME.Provider

**Fixes**

- **lib/freeze:** Fix ReferenceError in .forEach
- **lib/client:** Fix variable re-declaration

**Docs**

- **README.md:** Add TOC, subdivide usage info
- **README.md:** Update badge labels
- **README.md:** Add Codacy code quality badge

**Maintenance**

- **package.json:** Version 0.4.1
- **package.json:** Bump request 2.74.0 -> 2.75.0
- **.npmignore:** Add *.md
- **.npmignore:** Add *.yml



# 0.4.0

**Features**

- **lib/client:** Add more debug()s
- **lib/client:** Add `client.getRegistration()`
- **lib/client:** Add ACME error URN as `error.code`
- **lib/client:** Simplify signed payload bodies
- **lib/client:** Rename .getJWSPayload() to .signPayload()

**Fixes**

- **lib/client:** Fix automatic configuration
- **lib/client:** Fix nonce replenishment

**Tests**

- **test:** Set stdout to blocking
- **test/sequence:** Add stub for updated TOS
- **test/sequence:** Clear pending http reqs after test
- **test/sequence:** Update registration URL

**Docs**

- **README.md:** Add `client.newAuthorization()` example
- **README.md:** Update examples
- **lib/client:** Add docblock for `.newAuthorization()`
- **README.md:** Fix AppVeyor link
- **README.md:** Add code climate & dependency ci badges

**Maintenance**

- **package.json:** Version 0.4.0
- **package.json:** Add missing `bloodline` dependency
- **package.json:** Bump dependencies



# 0.3.0

**Features**

- **lib/client:** Add debug http response status code
- **lib/client:** Impl `.updateRegistration()`
- **lib/client:** Add `_clientRequest()` cleaning up req/res handling
- **lib/acme:** Add ACME.KEY_CHANGE resource type
- **lib/client:** Stub new-authz / new-app methods
- **lib/acme:** Add 'new-app' resource dir entry type
- **lib/acme:** Add `unsupportedIdentifier` error code

**Fixes**

- **lib/client:** Fix potential ReferenceError in ._clientRequest()

**Tests**

- **test:** Fix expected postdata (wrong nonce)
- **test:** Fix mock URL in reg update test
- **test:** Add test for updating registration w/ agreement

**Docs**

- **README.md:** Add registration update usage
- **README:** Add description / note

**Maintenance**

- **package.json:** Version 0.3.0
- **package.json:** Update `request` to 2.74.0
- **.npmignore:** Add `examples`



# 0.2.0

**Features**

- **lib:** Add `client.getNonce()`, remove `ACME.getNonce()`
- **lib/client:** Add `directoryPath` option
- **lib/client:** Add `get isConfigured`, `.hasCapability()`
- **lib/client:** Add `.configure()`, remove `.getDirectory()`
- **test/sequence:** Cert issuance flow tests
- **test/util/keypair:** Generate a priv, pub key
- **lib/client:** Split out client from lib/acme
- **lib/acme:** Add `ACME.generateNonce()`

**Fixes**

- **lib/acme:** Fix missing `crypto`, deprecate `recover-reg`

**Tests**

- **test/util:** Cache generated keypair, inc to 2048 bits
- **test:** Split out client tests into test/client
- **test:** Add `ACME_API_BASE_URL` constant
- **test:** Simplify, compact formatting
- **test,lib:** Trim whitespace

**Docs**

- **README.md:** Update usage examples
- **lib/client:** Add more jsdoc blocks
- **README.md:** Link to specification
- **README.md:** Description, badges, install cmd

**Maintenance**

- **package.json:** Version 0.2.0
- **.gitignore:** Add *.log
- **.travis.yml:** Dedupe node v6, only build master



# 0.1.0

**Features**

- **lib/acme:** Implement .getDirectory()

**Docs**

- **README.md:** Add Usage section

**Maintenance**

- **package.json:** Version 0.1.0

