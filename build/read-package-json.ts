import * as fs from "fs"
import * as path from "path"

export default async function (
  name: ReadonlyArray<string>,
): Promise<{
  readonly description: string
  readonly version: string
  readonly dependencies?: { readonly [name: string]: string }
  readonly devDependencies?: { readonly [name: string]: string }
  readonly bin?: { readonly [name: string]: string }
  readonly scripts?: { readonly [name: string]: string }
}> {
  console.log(`Reading package.json...`)
  const packageJsonPath = path.join.apply(path, name.concat([`package.json`]))
  const packageJson = await fs.promises.readFile(packageJsonPath, `utf8`)
  return JSON.parse(packageJson)
}
