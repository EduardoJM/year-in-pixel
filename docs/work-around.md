# Work Arounds

## ESLint no-octal-escape

Solution from https://stackoverflow.com/a/59429588 is replace the line:
`/^(?:[^\\]|\\.)*?\\([0-3][0-7]{1,2}|[4-7][0-7]|0(?=[89])|[1-7])/su`
with
`/^(?:[^\\]|\\.)*?\\([0-3][0-7]{1,2}|[4-7][0-7]|[1-7])/u`