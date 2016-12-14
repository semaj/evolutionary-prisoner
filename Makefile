TS=tournament.ts games.ts strategies.ts rules.ts players.ts
JS=tournament.js games.js strategies.js rules.js players.js exports.js

all: build

build: typescript
	browserify $(JS) > bundle.js

typescript:
	tsc $(TS)

