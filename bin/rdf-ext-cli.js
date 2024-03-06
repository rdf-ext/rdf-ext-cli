#!/usr/bin/env node

import { promisify } from 'node:util'
import formatsPretty from '@rdfjs/formats/pretty.js'
import { Command } from 'commander'
import rdf from 'rdf-ext'
import { finished } from 'readable-stream'
import createInputStream from '../lib/createInputStream.js'
import createOutputStream from '../lib/createOutputStream.js'
import createShaclStream from '../lib/createShaclStream.js'
import transformMapNamespaceFunc from '../lib/transformMapNamespace.js'
import transformSkolemIrisFunc from '../lib/transformSkolemIris.js'
import transformToTripleFunc from '../lib/transformToTriple.js'

const program = new Command()

function collectMappings (value, mappings) {
  const [, from, to] = value.match(/(.*)=(.*)/)

  mappings.set(rdf.namedNode(from), rdf.namedNode(to))

  return mappings
}

function collectPrefixes (value, prefixes) {
  const [, prefix, namespace] = value.match(/(.*)=(.*)/)

  prefixes.set(prefix, rdf.namedNode(namespace))

  return prefixes
}

program
  .argument('[input]', 'input')
  .option('--input-endpoint <url>', 'input SPARQL endpoint url')
  .option('--input-query <query>', 'input SPARQL query')
  .option('--input-type <type>', 'input content type')
  .option('--shacl-endpoint <url>', 'SHACL SPARQL endpoint url')
  .option('--shacl-query <query>', 'SHACL SPARQL query')
  .option('--shacl-type <type>', 'SHACL content type', 'text/turtle')
  .option('--shacl-url <url>', 'SHACL URL')
  .option('--shacl-debug', 'generate results for successful validations')
  .option('--shacl-details', 'generate nested result details')
  .option('--shacl-trace', 'generate results for path traversing')
  .option('--transform-map-namespace <mapping>', 'map the given namespaces', collectMappings, rdf.termMap())
  .option('--transform-skolem-iris <baseIri>', 'map blank nodes to Skolem IRIs')
  .option('--transform-to-triples', 'set graph to default graph')
  .option('--output-prefix <prefix>', 'output prefix', collectPrefixes, new Map())
  .option('--output-type <type>', 'output content type', 'text/turtle')
  .option('--pretty', 'use pretty print serializer')
  .action(async (input, {
    inputType,
    inputEndpoint,
    inputQuery,
    shaclType,
    shaclEndpoint,
    shaclQuery,
    shaclUrl,
    shaclDebug,
    shaclDetails,
    shaclTrace,
    transformMapNamespace,
    transformSkolemIris,
    transformToTriple,
    outputPrefix,
    outputType,
    pretty
  }) => {
    if (!input && !inputEndpoint) {
      return program.help()
    }

    if (pretty) {
      rdf.formats.import(formatsPretty)
    }

    let stream = await createInputStream({
      contentType: inputType,
      defaultStream: process.stdin,
      endpointUrl: inputEndpoint,
      query: inputQuery,
      url: input
    })

    if (shaclUrl) {
      const shapeStream = await createInputStream({
        contentType: shaclType,
        endpointUrl: shaclEndpoint,
        query: shaclQuery,
        url: shaclUrl
      })

      const shaclStream = createShaclStream(shapeStream, {
        debug: shaclDebug,
        details: shaclDetails,
        trace: shaclTrace
      })

      stream.pipe(shaclStream)
      stream = shaclStream
    }

    if (transformMapNamespace) {
      const toTripleStream = transformMapNamespaceFunc(transformMapNamespace)

      stream.pipe(toTripleStream)
      stream = toTripleStream
    }

    if (transformSkolemIris) {
      const toTripleStream = transformSkolemIrisFunc(transformSkolemIris)

      stream.pipe(toTripleStream)
      stream = toTripleStream
    }

    if (transformToTriple) {
      const toTripleStream = transformToTripleFunc()

      stream.pipe(toTripleStream)
      stream = toTripleStream
    }

    const outputStream = await createOutputStream({
      contentType: outputType,
      prefixes: outputPrefix
    })

    stream.pipe(outputStream)

    await promisify(finished)(outputStream)
  })

program.parse(process.argv)
