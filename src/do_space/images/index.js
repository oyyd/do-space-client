import gui from 'gui'
import path from 'path'

const images = {}

export function getImage(name) {
  if (images[name]) {
    return images[name]
  }

  const img = gui.Image.createFromPath(path.resolve(__dirname, `../../../static/${name}`))

  images[name] = img

  return img
}
