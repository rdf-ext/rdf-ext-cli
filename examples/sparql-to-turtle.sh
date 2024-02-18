#!/bin/bash

./bin/rdf-ext-cli.js \
  --input-endpoint https://query.wikidata.org/sparql \
  --input-query "$(cat examples/query.sparql)" \
  --pretty \
  --output-prefix wd=http://www.wikidata.org/entity/ \
  --output-prefix rdfs=http://www.w3.org/2000/01/rdf-schema#
