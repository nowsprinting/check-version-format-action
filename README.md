# check-version-format-action

[![build-test](https://github.com/nowsprinting/check-version-format-action/actions/workflows/test.yml/badge.svg)](https://github.com/nowsprinting/check-version-format-action/actions/workflows/test.yml)

Check and extract version string from tag.

You can know:

- Is the tagged version format correct
- Is the tagged version stable

You can get:

- Full version string (e.g. `v2.3.4-beta5`)
- Major version string (e.g. `v2`)
- Major version + pre-release string (e.g. `v2-beta5`)

**CAUTION:**
v3 or later, verify version number so strictly using [semver](https://semver.org/).
If you want to use non-strict version number (e.g. `v1.2`), use v2 or earlier.


## Inputs

### prefix

Version prefix in tag.

e.g. `v`


## Outputs

### is_valid

Set `true` if found valid [semver](https://semver.org/) format in tag.

e.g. `v1.0.0`, `v2.3.4-beta5` is true.


### is_stable

Set `true` if found stable version in tag. (not have pre-release metadata and major > 0)

e.g. `v1.0.0`, `v2.3.4`, `5.6.7+build8` is true.
`v2.0.0-beta`, `v0.3.0` is false.


### full

Set full version as a string (include prefix).

e.g. `v1.0.0`, `v2.3.4-beta5`


### major

Set major version as a string (include prefix).

e.g. `v1`, `v2`


### major_prerelease

Set major version with pre-release as a string (include prefix).

e.g. `v1`, `v2-beta5`


## Example usage

```yaml
on:
  push:
    tags:
      - 'v*'

jobs:
  test-tag:
    runs-on: ubuntu-latest

    steps:
      - uses: nowsprinting/check-version-format-action@v3
        id: version
        with:
          prefix: 'v'

      - name: Version tag only step
        run: |
          echo "Found valid version format in tag!"
          echo "Full version: ${{ steps.version.outputs.full }}"
          echo "Major version: ${{ steps.version.outputs.major }}"
          echo "Major with pre-release: ${{ steps.version.outputs.major_prerelease }}"
        if: steps.version.outputs.is_valid == 'true'

      - name: Stable version only step
        run: |
          echo "Found stable version in tag!"
        if: steps.version.outputs.is_stable == 'true'
```


## License

MIT License


## How to contribute

Open an issue or create a pull request.

### Start developing

```shell
npm ci
```

### Run tests

```shell
npm run test
```

### Package (must run before checked-in)

```shell
npm run build
npm run package
git add dist/
git commit -m"Packaged"
```

### Create pull request

Be grateful if you could label the PR as `enhancement`, `bug`, `chore` and `documentation`. See [PR Labeler settings](.github/pr-labeler.yml) for automatically labeling from the branch name.


## Release workflow

Bump version in package.json on default branch.
Or run [Create release pull request](https://github.com/nowsprinting/check-version-format-action/actions/workflows/create-release-pr.yml) workflow and merge PR.

Then, Will do the release process automatically by [Release when bump version](.github/workflows/release-when-bump-version.yml) workflow.
The GitHub Marketplace page will be updated based on the Release.

Do **NOT** manually operation the following operations:

- Create release tag
- Publish draft releases