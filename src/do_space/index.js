import React from 'react'
import gui from 'gui'
import { render } from 'react-yue'
import { createAppStore } from './state'
import { createMenu } from './menu'
import App from './view/app'
import { readConfig } from './fs_storage'

async function main() {
  const config = await readConfig()
  const store = createAppStore()
  store.dispatch({
    type: 'setConfig',
    data: config,
  })

  const win = gui.Window.create({})
  const menus = createMenu(store)

  // TODO: darwin
  gui.app.setApplicationMenu(menus)

  store.dispatch({
    type: 'setMainWindow',
    data: win,
  })

  win.setTitle('DO Space')
  win.setContentSize({ width: 850, height: 550 })
  win.onClose = () => {
    gui.MessageLoop.quit()
  }

  const contentView = gui.Container.create()
  contentView.setStyle({ flexDirection: 'row' })
  win.setContentView(contentView)

  render(<App store={store} />, contentView)

  win.center()
  win.setVisible(true)
  win.deactivate()
}

main()

if (!process.versions.yode) {
  gui.MessageLoop.run()
  process.exit(0)
}
