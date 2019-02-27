compile:
	tsc
	px lib/di.js public/bundle.js

all: compile

clean:
	rm lib/*
	rm public/bundle.js

.PHONY: clean all compile
