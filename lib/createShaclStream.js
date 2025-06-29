import duplexify from 'duplexify'
import rdf from 'rdf-ext'
import { PassThrough } from 'readable-stream'
import { Validator } from 'shacl-engine'
const shViolation = rdf.namedNode('http://www.w3.org/ns/shacl#Violation');

function createShaclStream (shapeStream, { debug, details, trace } = {}) {
  let resolve;
  const input = new PassThrough({ objectMode: true })
  const output = new PassThrough({ objectMode: true })
  const violation = new Promise(res => { resolve = res });

  queueMicrotask(async () => {
    const shape = await rdf.dataset().import(shapeStream)
    const engine = new Validator(shape, { debug, details, factory: rdf, trace })
    const dataset = await rdf.dataset().import(input)
    const report = await engine.validate({ dataset })
    resolve(report.results.some(result => result.severity.equals(shViolation)))

    report.dataset.toStream().pipe(output)
  })

  return {
    stream: duplexify.obj(input, output),
    violation
  }
}

export default createShaclStream
