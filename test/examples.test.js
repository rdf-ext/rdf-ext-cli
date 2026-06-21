import { strictEqual } from 'node:assert'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { describe, it } from 'mocha'

const execAsync = promisify(exec)

const cwd = new URL('..', import.meta.url).pathname

describe('examples', () => {
  it('url-to-turtle', async () => {
    const { stdout } = await execAsync('bash examples/url-to-turtle.sh', { cwd })

    strictEqual(stdout.includes('@prefix house:'), true)
    strictEqual(stdout.includes('schema:Person'), true)
  })

  it('url-to-skolem-iri-turtle', async () => {
    const { stdout } = await execAsync('bash examples/url-to-skolem-iri-turtle.sh', { cwd })

    strictEqual(stdout.includes('@prefix houseplace:'), true)
    strictEqual(stdout.includes('/.well-known/genid/'), true)
  })

  it('validate-url', async () => {
    const { stdout } = await execAsync('bash examples/validate-url.sh', { cwd })

    strictEqual(stdout.includes('sh:ValidationReport'), true)
    strictEqual(stdout.includes('sh:conforms'), true)
  })

  it('sparql-to-turtle', async () => {
    const { stdout } = await execAsync('bash examples/sparql-to-turtle.sh', { cwd })

    strictEqual(stdout.includes('@prefix wd:'), true)
    strictEqual(stdout.includes('rdfs:label'), true)
  })
})
