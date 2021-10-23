# check-version-format-action

[![Test](https://github.com/nowsprinting/check-version-format-action/actions/workflows/test.yml/badge.svg)](https://github.com/nowsprinting/check-version-format-action/actions/workflows/test.yml)

Check and extract version string from tag.

You can know:

- Is the tagged version format correct
- Is the tagged version stable

You can get:

- Full version string
- Major version string


## Inputs

### `prefix`

Version prefix in tag. `refs/tags/` is unnecessary.
e.g. `v`


## Outputs

### `is_valid`

Set `true` if found valid version format in tag.
e.g. `v1`, `v1.2`, `v2-alpha1`, `v2.3-beta2`, `v2.3.4-rc3`

### `is_stable`

Set `true` if found stable version in tag.
e.g. `v1`, `v1.2`, `v2.3.4`

### `full`

Set full version as a string (include prefix).
e.g. `v1`, `v1.2`, `v2-alpha1`, `v2.3-beta2`, `v2.3.4-rc3`

### `major`

Set major version as a string (include prefix).
e.g. `v1`, `v2`


## Example usage

```yaml
- uses: nowsprinting/check-version-format-action@v1
  id: version
  with:
    prefix: 'v'

- name: Version tag only step
  run: |
    echo "Found valid version format in tag!"
    echo "Full version: ${{ steps.version.outputs.full }}"
    echo "Major version: ${{ steps.version.outputs.major }}"
  if: steps.version.outputs.is_valid == 'true'

- name: Stable version only step
  run: |
    echo "Found stable version in tag!"
  if: steps.version.outputs.is_stable == 'true'
```
