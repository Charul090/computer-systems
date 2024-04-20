# Implementation of CSS file Hex to RGBA converter

Programs expects css file in stdin and will push result to stdout.

Languages Covered

- [x] Python
- [x] JS

Commands to test the programs.

```shell
diff <(cat files/advanced.css | node js/index.js) files/advanced_expected.css
diff <(cat files/advanced.css | python python/index.py) files/advanced_expected.css
```
