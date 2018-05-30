import gui from 'gui'
import path from 'path'
import fs from 'fs'

const images = {}

export function getImage(name) {
  if (images[name]) {
    return images[name]
  }

  console.log('__dirname', __dirname)

  const p = fs.realpathSync(path.join(__dirname, `static/${name}`))
  const img = gui.Image.createFromPath(p)

  images[name] = img

  return img
}
