import fs from 'fs-extra'
import path from 'path'
import os from 'os'
import { debug } from '../log'

const CONFIG_FOLDER_NAME = 'do-space-client'
const CONFIG_FILE_NAME = 'config.json'

function getConfigDir(name = CONFIG_FOLDER_NAME) {
  switch (process.platform) {
    case 'win32':
      if (process.env.APPDATA) return path.join(process.env.APPDATA, name)
      else return path.join(os.homedir(), 'AppData', 'Roaming', name)
    case 'darwin':
      return path.join(os.homedir(), 'Library', 'Application Support', name)
    case 'linux':
      if (process.env.XDG_CONFIG_HOME)
        return path.join(process.env.XDG_CONFIG_HOME, name)
      else return path.join(os.homedir(), '.config', name)
    default:
      throw new Error('Unkown platform')
  }
}

function getConfigFilePath() {
  return path.resolve(getConfigDir(), `./${CONFIG_FILE_NAME}`)
}

export async function readConfig() {
  const filepath = getConfigFilePath()

  await fs.ensureFile(filepath)

  let content = {}

  try {
    content = await fs.readJson(filepath)
  } catch (e) {
    //
  }

  debug('[CONFIG_FILE]', content)

  return content
}

export async function saveConfig(content) {
  const filepath = getConfigFilePath()

  return fs.writeJson(filepath, content)
}

if (module === require.main) {
  // saveConfig({
  //   hello: '123',
  // })
  readConfig().then((res) => {
    console.log('res', res)
  })
}
