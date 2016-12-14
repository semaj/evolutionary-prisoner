# Evolutionary Prisoners
## Installation / Local Usage
* You need `browserify`, `typescript`, & `typescript-collections` (downloade via `npm`).
To run locally:
  ```
  make
  ```

  Open up `index.html` in your browser.


## Development
* If you want to add a file, you must add it to the `Makefile` (in both `JS` and `TS`).
* If you want to add a class and you want it to be exposed to `run.js`, the p5.js runner, you must declare it in `exports.js`.
