import React from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import gui from 'gui'
import { createConnectWindow } from './login'
import { DoSpace } from '../do/connect'
import { regionConnectionWidth } from './style'
import { getImage } from '../images'

const { func, array } = PropTypes

const BTN_WIDTH = 40
const marginSize = (regionConnectionWidth - BTN_WIDTH) / 2
const COMMON_MARGIN_TOP = 10

const CONNECTION_STYLE = {
  width: BTN_WIDTH,
  height: BTN_WIDTH,
  marginTop: COMMON_MARGIN_TOP,
}

function saveAddConnData(dispatch, data) {
  dispatch({
    type: 'saveAddConnData',
    data,
  })
}

function addBuckets(dispatch, buckets, endpoint) {
  dispatch({
    type: 'addBuckets',
    data: {
      buckets,
      endpoint,
    },
  })
}

function connectDoSpace(dispatch, conn) {
  dispatch({
    type: 'addConnection',
    data: conn,
  })
}

function s(state) {
  return {
    config: state.config,
    connections: state.connections,
  }
}

function d(dispatch) {
  return {
    connectDoSpace: connectDoSpace.bind(null, dispatch),
    addBuckets: addBuckets.bind(null, dispatch),
    saveAddConnData: saveAddConnData.bind(null, dispatch),
  }
}

class Connection extends React.Component {
  static propTypes = {
    connectDoSpace: func.isRequired,
    saveAddConnData: func.isRequired,
    addBuckets: func.isRequired,
    connections: array.isRequired,
  }

  constructor(props) {
    super(props)

    this.refers = {
      accountContainers: [],
    }
  }

  componentDidMount() {
    const { config = {} } = this.props
    const { connectionsInfo = [] } = config

    console.log('config', config)

    connectionsInfo.forEach(connInfo => {
      const data = Object.assign(
        {
          infoCached: true,
        },
        connInfo
      )

      this.initConn(data)
    })
  }

  componentDidUpdate() {}

  initConn = (data) => {
    const conn = new DoSpace(data)

    return conn.listBuckets().then(res => {
      const { Buckets: buckets } = res

      this.props.addBuckets(buckets, conn.spacesEndpoint.host)
      this.props.connectDoSpace(conn)
    })
  }

  createConnectWindow = () => {
    createConnectWindow((data, guiWindow) => {
      guiWindow.setTitle('connecting...')

      this.initConn(data).then(() => {
        console.log('save', data)
        this.props.saveAddConnData(data)
        guiWindow.close()
      }).catch(err => {
        guiWindow.close()
        console.log(err)
      })
    })
  }

  initConnectionContainer = container => {
    if (container) {
      container.onDraw = (...args) => {
        const painter = args[1]

        painter.drawImage(getImage('server.png'), {
          width: BTN_WIDTH,
          height: BTN_WIDTH,
        })
      }
    }
  }

  render() {
    const { connections } = this.props

    return (
      <container style={{ paddingLeft: marginSize, paddingRight: marginSize }}>
        {connections.map((i, index) => (
          <container
            ref={this.initConnectionContainer}
            key={index}
            style={CONNECTION_STYLE}
          >
            {/* TODO: */}
            <label text="Hello" style={{ marginTop: 10, color: '#FFF' }} />
          </container>
        ))}
        <button
          title="+"
          style={{ marginTop: COMMON_MARGIN_TOP }}
          onClick={this.createConnectWindow}
        />
      </container>
    )
  }
}

export default connect(s, d)(Connection)
