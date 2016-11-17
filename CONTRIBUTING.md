# Contributing

## Index
<!-- MarkdownTOC -->

- [Commit Messages](#commit-messages)
- [Testing](#testing)
- [Adding a Provider](#adding-a-provider)

<!-- /MarkdownTOC -->

## Commit Messages

Line length should not exceed 72 characters.

**Format**
```
<type>(<scope>): <subject>

<body>
```

**Types**

- **feat**: New feature
- **fix**: Bugfix
- **docs**: Documentation only changes
- **style**: Changes which do not affect meaning/function of code
  (white-space, formatting, missing semicolons, etc)
- **refactor**: Change that neither fixes a bug nor adds a feature
- **perf**: Performance related change
- **test**: Adding, removing, changing tests
- **chore**: Changes to the build process or auxiliary tooling
  and libraries such as documentation generation

**Scope**

Usually the subsystem, or just the basename of the file the change affects.
For Example: If you changed `lib/client.js`,
then `feat(client): Add .someMethod()` would be okay.

**Subject & Body**

Use the imperative, present tense: "change" not "changed" nor "changes".
Please include motivation for the change,
and contrast it with previous behavior in the body, if applicable.

## Testing

Please make sure your tests pass before submitting a Pull Request.
If you don't know how to add new tests, make them pass, or why they broke,
please submit your Pull Request regardless, and ask kindly for help.

You can run the tests locally by running
```
npm test
```

## Adding a Provider

See [lib/providers.js](./blob/master/lib/providers.js)
