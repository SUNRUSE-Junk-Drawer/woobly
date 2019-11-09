import * as fs from "fs"
import * as path from "path"
import generateReadme from "./generate-readme"

export default async function (
  name: ReadonlyArray<string>,
  description: string,
): Promise<void> {
  console.log(`Writing readme...`)
  await fs.promises.writeFile(
    path.join.apply(path, name.concat([`readme.md`])),
    generateReadme(name, description),
  )
}
