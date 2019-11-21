import * as path from "path"
import tryToFindContentDetailsFromFilePath from "./try-to-find-content-details-from-file-path"
import MapOne from "./map-one"
import FilePath from "./file-path"

export default function (
  plugins: { readonly [fileExtension: string]: string },
  filePath: string,
): MapOne<FilePath> {
  if (filePath.endsWith(`.ts`)) {
    return {
      type: `typeScript`,
      filePath,
    }
  }

  if (filePath.endsWith(`.application.json`)) {
    return {
      type: `application`,
      filePath: filePath.slice(3 + path.sep.length, -17).split(path.sep),
    }
  }

  const contentDetails = tryToFindContentDetailsFromFilePath(filePath)

  if (contentDetails === null) {
    return {
      type: `invalid`,
      reason: `Unable to determine the purpose of file "${filePath}".  If this is intended to be content, please ensure that it is of the form described in the documentation.`,
    }
  }

  if (!Object.prototype.hasOwnProperty.call(plugins, contentDetails.fileExtension)) {
    let pluginFileExtensionList: string

    if (Object.keys(plugins).length) {
      const list = Object
        .entries(plugins)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(plugin => `"${plugin[0]}" (from plugin "${plugin[1]}")`)
        .join(`, `)
      pluginFileExtensionList = `Plugins are installed for the following file extensions: ${list}`
    } else {
      pluginFileExtensionList = `There are no plugins installed`
    }

    return {
      type: `invalid`,
      reason: `No installed plugin handles files with the extension "${contentDetails.fileExtension}" (from file "${filePath}").  Please ensure that the required plugin is installed, and that this file's extension is correct.  ${pluginFileExtensionList}; execute "npm install --save-dev {plugin name}" to install plugins.`,
    }
  }

  return {
    type: `content`,
    filePath,
    plugin: plugins[contentDetails.fileExtension],
    typeScriptIdentifier: contentDetails.typeScriptIdentifier,
  }
}
