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
  .option('--shacl-error', 'error when SHACL validation produces a Violation result severity')
  .option('--transform-map-namespace <mapping>', 'map the given namespaces', collectMappings, rdf.termMap())
  .option('--transform-skolem-iris <baseIri>', 'map blank nodes to Skolem IRIs')
  .option('--transform-to-triples', 'set graph to default graph')
  .option('--output-prefix <prefix>', 'output prefix', collectPrefixes, new Map())
  .option('--output-type <type>', 'output content type', 'text/turtle')
  .option('--keep-prefixes', 'keep prefixes from input')
  .option('--pretty', 'use pretty print serializer')
  .action(async (input, {
    inputType,
    inputEndpoint,
    inputQuery,
    keepPrefixes,
    shaclType,
    shaclEndpoint,
    shaclQuery,
    shaclUrl,
    shaclDebug,
    shaclDetails,
    shaclTrace,
    shaclError,
    transformMapNamespace,
    transformSkolemIris,
    transformToTriple,
    outputPrefix,
    outputType,
    pretty
  }) => {
    let violationPromise = undefined;

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
      prefix: keepPrefixes && ((prefix, namespace) => {
        if (!outputPrefix || !outputPrefix.has(prefix)) {
          outputPrefix.set(prefix, namespace)
        }
      }),
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

      const { stream: shaclStream, violation } = createShaclStream(shapeStream, {
        debug: shaclDebug,
        details: shaclDetails,
        trace: shaclTrace
      })

      violationPromise = violation

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
    if (shaclError && typeof violationPromise !== 'undefined' && (await violationPromise)) {
      process.exitCode = 1;
    }
  })

program.parse(process.argv)
