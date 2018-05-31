import React from 'react'
import gui from 'gui'
import { render } from 'react-yue'

const DEFAULT_SIZE = { width: 440, height: 200 }

export function alert(reactElement, options = {}) {
  if (!reactElement) {
    return false
  }

  const { size = DEFAULT_SIZE, title = 'tips' } = options

  const dialogWindow = gui.Window.create({})
  dialogWindow.setTitle(title)
  dialogWindow.setContentSize(size)
  dialogWindow.setAlwaysOnTop(true)

  const container = gui.Container.create()
  container.setStyle({ flexDirection: 'row' })
  dialogWindow.setContentView(container)

  render(reactElement, container)

  dialogWindow.center()
  dialogWindow.activate()

  return dialogWindow
}
