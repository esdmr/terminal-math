# Terminal Math

A math typesetter for terminal.

This project is inspired by [Nota by kary](https://kary.us/nota/), specificly
from the first example given only. All the code was constructed from looking at
the example and a unicode table.

Also theres a *very* poor port to julia which is x7&ndash;10 slower than the js.

## Installation

[PNPM](https://pnpm.js.org/) is preferred, but NPM will work just fine.

```sh
git clone https://github.com/esdmr/terminal-math.git
cd terminal-math
npm install
npm run tsc
node build/generate-unicode-db.js
# Optionally
npm run ugly
```

## Usage

Currently the input is in the entry point file. I might develop a parser for a
TeX-like interface as input. I might also make a actual calculator like nota,
but that's a long-term goal.

## License

&copy; 2021 Saeed M Rad.
Licensed under [MIT](./LICENSE)
