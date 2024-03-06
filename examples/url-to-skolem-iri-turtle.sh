#!/bin/bash

./bin/rdf-ext-cli.js \
  --pretty \
  --transform-skolem-iris http://example.com/.well-known/genid/ \
  --output-prefix houseplace=https://housemd.rdf-ext.org/place/ \
  --output-prefix schema=http://schema.org/ \
  https://housemd.rdf-ext.org/place/221b-baker-street
