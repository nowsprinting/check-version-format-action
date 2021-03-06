# check-version-format-action

[![build-test](https://github.com/nowsprinting/check-version-format-action/workflows/build-test/badge.svg)](../../actions)

Check version format in tag.


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


## Example usage

```yaml
- uses: nowsprinting/check-version-format-action@v1
  id: version
  with:
    prefix: 'v'

- name: Version tag only step
  run: echo Found valid version format in tag!
  if: steps.version.outputs.is_valid == 'true'

- name: Stable version only step
  run: echo Found stable version in tag!
  if: steps.version.outputs.is_stable == 'true'
```
