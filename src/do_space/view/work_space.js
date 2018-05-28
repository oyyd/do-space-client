import React from 'react'
import gui from 'gui'
import { connect } from 'react-redux'
import fecha from 'fecha'
import path from 'path'
import fs from 'fs'
import prettyBytes from 'pretty-bytes'
import { fontColor, fontColorStrong, primaryColor } from './style'
import Icon from './icon'

const MAX_ITEMS = 100
const SEARCH_HEIGHT = 24
const ICON_SIZE = 20
const META_REGION_SIZE = 240

const OBJECT_STYLE = {
  marginBottom: 10,
  flexDirection: 'row',
  paddingBottom: 10,
  paddingLeft: 8,
  paddingRight: 8,
}

function getExtral(base, p) {
  const index = p.indexOf(base)
  if (index >= 0) {
    return p.slice(base.length)
  }

  return p
}

function isFolder(item) {
  return item.Prefix
}

function s(state) {
  return {
    connection: state.activeConnection,
    activeBucket: state.activeBucket,
  }
}

function a() {
  return {}
}

function saveFileToFS(stream, filepath) {
  const fileStream = fs.createWriteStream(filepath)

  stream.pipe(fileStream)
}

class WorkSpace extends React.Component {
  constructor(props) {
    super(props)

    this.refers = {}
    this.text = ''

    this.state = {
      isLoading: false,
      basePath: '',
      contents: props.defaultObjects || [],
      prefixes: [],
    }
  }

  componentDidMount() {
    this.updateScrollSize()
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.updateScrollSize()
    }, 500)
  }

  updateScrollSize = () => {
    const { scroll, container } = this.refers

    if (!scroll || !container) {
      return
    }

    const bounds = container.getPreferredSize()
    const { width } = scroll.getBounds()
    const { height } = bounds

    scroll.setContentSize({
      width,
      height,
    })
  }

  setEntryText = value => {
    return this.refers.entry.setText(value)
  }

  searchText = () => {
    const { text } = this
    const { connection, activeBucket } = this.props

    this.setState({
      isLoading: true,
    })

    connection
      .listObjects({
        Bucket: activeBucket.Name,
        Prefix: text,
        MaxKeys: MAX_ITEMS,
        Delimiter: '/',
      })
      .then(res => {
        this.setState({
          isLoading: false,
          basePath: text,
          contents: res.Contents,
          prefixes: res.CommonPrefixes,
        })
        this.setEntryText(res.Prefix)
      })
      .catch(err => {
        console.log(err)
        this.setState({
          isLoading: false,
        })
      })
  }

  renderIcon = folder => {
    const filename = !folder ? 'text-file.png' : 'folder.png'

    return <Icon filename={filename} width={ICON_SIZE} height={ICON_SIZE} />
  }

  drawBorder = (container, painter) => {
    const SIZE = 1
    const COLOR = '#EEEEEE'
    const bounds = container.getBounds()
    const { width, height } = bounds

    painter.setFillColor(COLOR)
    painter.fillRect({
      x: 0,
      y: height - SIZE,
      width,
      height: SIZE,
    })
  }

  openFolder = key => {
    this.setEntryText(key)
    this.text = key
    this.searchText()
  }

  downloadFile = key => {
    const filename = path.basename(key)
    const dialog = gui.FileSaveDialog.create()
    dialog.setFilename(filename)

    const itemChosen = dialog.run()

    if (!itemChosen) {
      return
    }

    const savePath = dialog.getResult()
    const { connection, activeBucket } = this.props
    const stream = connection.getObjectStreamByKey(activeBucket.Name, key)

    saveFileToFS(stream, savePath)
  }

  openMoreActions = (key, folder) => {
    const menuItems = [
      folder
        ? null
        : {
            label: 'download',
            onClick: () => this.downloadFile(key),
          },
      {
        type: 'separator',
      },
      {
        label: 'delete',
        onClick: () => {
          console.log('click')
        },
      },
    ].filter(i => !!i)

    const menu = gui.Menu.create(menuItems)

    menu.popup()
  }

  renderObject = i => {
    const { basePath } = this.state
    const folder = isFolder(i)

    return (
      <container key={i.Key} style={OBJECT_STYLE} onDraw={this.drawBorder}>
        <container style={{ flex: 1, flexDirection: 'row' }}>
          {this.renderIcon(folder)}
          <label
            text={getExtral(basePath, folder ? i.Prefix : i.Key)}
            align="start"
            vAlign="start"
            style={{
              flex: 1,
              height: 20,
              color: !folder ? fontColor : primaryColor,
              marginLeft: 10,
            }}
            onMouseUp={() => {
              if (folder) {
                this.openFolder(i.Prefix)
              }
            }}
          />
        </container>
        <container style={{ width: META_REGION_SIZE, flexDirection: 'row' }}>
          <label
            align="start"
            style={{ flexWrap: 'wrap', color: fontColor, flex: 1 }}
            text={
              folder
                ? '-'
                : fecha.format(new Date(i.LastModified), 'YYYY-MM-DD')
            }
          />
          <label
            align="start"
            style={{ flexWrap: 'wrap', color: fontColor, flex: 1 }}
            text={folder ? '-' : prettyBytes(i.Size)}
          />
          <label
            text="More"
            style={{ color: primaryColor, flex: 1 }}
            onMouseUp={() => this.openMoreActions(i.Key, folder)}
          />
        </container>
      </container>
    )
  }

  renderHead = () => {
    return (
      <container
        style={{
          flexDirection: 'row',
          backgroundColor: '#fafafa',
          height: 30,
          marginBottom: 10,
        }}
      >
        <container style={{ flex: 1, flexDirection: 'row' }}>
          <label
            text="Name"
            style={{ marginLeft: 35, color: fontColorStrong }}
          />
        </container>
        <container style={{ width: META_REGION_SIZE, flexDirection: 'row' }}>
          <label
            align="start"
            text="Size"
            style={{ flex: 1, color: fontColorStrong }}
          />
          <label
            align="start"
            text="Last Modified"
            style={{ flex: 1, color: fontColorStrong }}
          />
        </container>
      </container>
    )
  }

  render() {
    const { connection, activeBucket } = this.props
    const { contents = [], prefixes = [] } = this.state

    if (!connection || !activeBucket) {
      return <label text="wait connection" />
    }

    return (
      <container
        style={{
          flex: 1,
        }}
      >
        <container
          style={{
            flexDirection: 'row',
            height: SEARCH_HEIGHT,
          }}
        >
          <entry
            ref={e => {
              this.refers.entry = e
            }}
            style={{
              flex: 1,
              height: SEARCH_HEIGHT,
            }}
            onTextChange={_ => {
              this.text = _.getText()
            }}
            onKeyUp={(_, event) => {
              if (event.key === 'Enter') {
                setTimeout(() => {
                  this.searchText()
                })
              }
            }}
          />
          <button
            title="search"
            onClick={this.searchText}
            style={{ width: 30, height: SEARCH_HEIGHT }}
          />
        </container>
        {this.renderHead()}
        {this.state.isLoading
          ? <label text="loading..." />
          : <scroll
              ref={s => {
                if (s) {
                  this.refers.scroll = s
                }
              }}
              overlayScrollbar
              hpolicy="never"
              vpolicy="always"
              style={{
                flex: 1,
              }}
            >
              <container
                ref={c => {
                  this.refers.container = c
                }}
              >
                {prefixes.concat(contents).map(i => this.renderObject(i))}
              </container>
            </scroll>}
      </container>
    )
  }
}

const Connected = connect(s, a)(WorkSpace)

Connected.WorkSpace = WorkSpace

export default Connected
