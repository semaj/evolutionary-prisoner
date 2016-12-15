![screen shot 2016-12-15 at 12 08 52 am](https://cloud.githubusercontent.com/assets/5074906/21212452/c8b8b640-c25a-11e6-8e4d-168be9e9ad04.png)
[Live Version](http://jameslarisch.com/evolutionary-prisoner)


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
