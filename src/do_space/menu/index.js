import gui from 'gui'

const packageJSON = require('../../../package.json')

function cleanConfig(store) {
  store.dispatch({
    type: 'setConfigAndSave',
    data: {},
  })
}

export function createMenu(store) {
  return gui.MenuBar.create([
    {
      label: packageJSON.name,
      submenu: [
        {
          label: 'Clean Config',
          onClick: () => {
            cleanConfig(store)
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          onClick: () => {
            gui.MessageLoop.quit()
            process.exit()
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'select-all' },
      ],
    },
  ])
}
