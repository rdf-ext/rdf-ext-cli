#!/bin/bash

./bin/rdf-ext-cli.js \
  --pretty \
  --output-prefix house=https://housemd.rdf-ext.org/person/ \
  --output-prefix houseplace=https://housemd.rdf-ext.org/place/ \
  --output-prefix schema=http://schema.org/ \
  --output-prefix xsd=http://www.w3.org/2001/XMLSchema# \
  https://housemd.rdf-ext.org/person/gregory-house
