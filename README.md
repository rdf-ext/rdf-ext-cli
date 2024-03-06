# rdf-ext-cli

[![build status](https://img.shields.io/github/actions/workflow/status/rdf-ext/rdf-ext-cli/test.yaml?branch=master)](https://github.com/rdf-ext/rdf-ext-cli/actions/workflows/test.yaml)
[![npm version](https://img.shields.io/npm/v/rdf-ext-cli.svg)](https://www.npmjs.com/package/rdf-ext-cli)

A command line util for [RDF-Ext](https://rdf-ext.org/) to convert and validate RDF data.
It supports reading different formats from the local file system, HTTP URLs, and SPARQL endpoints.
The data can be validated with SHACL using [shacl-engine](https://github.com/rdf-ext/shacl-engine).

## Install

Use the following command to install the util with `npm`.
A symlink will be added to the path.

```bash
npm install -g rdf-ext-cli
```

## Usage

You can run the tool like this:

```bash
rdf-ext somePathOrUrl
```

This will read `somePathOrUrl` with content-type auto-detection and write the result in the default format to `stdout`.
If `--shacl-url` is given, the input will be validated against the given SHACL shape, and the report will be written to the output.
Run `rdf-ext` without any arguments to get a full list of supported parameters.

### Help

```
Usage: rdf-ext-cli [options] [input]

Arguments:
  input                                input

Options:
  --input-endpoint <url>               input SPARQL endpoint url
  --input-query <query>                input SPARQL query
  --input-type <type>                  input content type
  --shacl-endpoint <url>               SHACL SPARQL endpoint url
  --shacl-query <query>                SHACL SPARQL query
  --shacl-type <type>                  SHACL content type (default: "text/turtle")
  --shacl-url <url>                    SHACL URL
  --shacl-debug                        generate results for successful validations
  --shacl-details                      generate nested result details
  --shacl-trace                        generate results for path traversing
  --transform-map-namespace <mapping>  map the given namespaces (default: {"index":{}})
  --transform-skolem-iris <baseIri>    map blank nodes to Skolem IRIs
  --transform-to-triples               set graph to default graph
  --output-prefix <prefix>             output prefix (default: {})
  --output-type <type>                 output content type (default: "text/turtle")
  --pretty                             use pretty print serializer
  -h, --help                           display help for command
```

## Examples

See the examples folder for some example commands.
