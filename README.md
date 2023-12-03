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

## Examples

See the examples folder for some example commands.
