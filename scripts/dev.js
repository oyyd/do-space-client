const chokidar = require('chokidar')
const path = require('path')
const start = require('./start')

let child = null

function restart() {
  if (child) {
    child.kill()
  }

  child = start()
}

function main() {
  const watcher = chokidar.watch(path.resolve(__dirname, '../lib/do_space'))

  watcher.on('change', () => {
    restart()
  })

  restart()
}

if (module === require.main) {
  main()
}
