#!/bin/bash

./bin/rdf-ext-cli.js \
  --shacl-url=examples/houseShape.ttl \
  --shacl-debug \
  --shacl-details \
  --shacl-trace \
  --pretty \
  --output-prefix sh=http://www.w3.org/ns/shacl# \
  https://housemd.rdf-ext.org/person/gregory-house
