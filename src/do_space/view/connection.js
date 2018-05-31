import React from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { createConnectWindow } from './login'
import { DoSpace } from '../do/connect'
import { regionConnectionWidth } from './style'
import { getImage } from '../images'
import { getConnInfo } from './utils'
import { debug } from '../log'

const { func, array } = PropTypes

const BTN_WIDTH = 40
const MARGIN_SIZE = (regionConnectionWidth - BTN_WIDTH) / 2
const COMMON_MARGIN_TOP = 10

const CONNECTION_STYLE = {
  width: BTN_WIDTH,
  height: BTN_WIDTH,
  marginTop: COMMON_MARGIN_TOP,
}

function getRegion(endpoint) {
  if (!endpoint) {
    return endpoint
  }

  const dotIndex = endpoint.indexOf('.')

  if (dotIndex >= 0) {
    return endpoint.slice(0, dotIndex)
  }

  return endpoint
}

function saveAddConnData(dispatch, data) {
  dispatch({
    type: 'saveAddConnData',
    data,
  })
}

function setActiveConnection(dispatch, conn) {
  dispatch({
    type: 'setActiveConnection',
    data: conn,
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
    setActiveConnection: setActiveConnection.bind(null, dispatch),
  }
}

class Connection extends React.Component {
  static propTypes = {
    connectDoSpace: func.isRequired,
    saveAddConnData: func.isRequired,
    addBuckets: func.isRequired,
    setActiveConnection: func.isRequired,
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

  initConn = data => {
    const conn = new DoSpace(data)

    return conn.listBuckets().then(res => {
      const { Buckets: buckets } = res

      this.props.addBuckets(buckets, conn.spacesEndpoint.host)
      this.props.connectDoSpace(conn)
    })
  }

  connectionExists = (data) => {
    const { connections } = this.props

    if (!connections || !Array.isArray(connections)) {
      return false
    }

    let exist = false

    connections.forEach(conn => {
      const info = getConnInfo(conn)

      if (info.endpoint === data.endpoint && info.accessKeyId === data.accessKeyId) {
        exist = true
      }
    })

    return exist
  }

  createConnectWindow = () => {
    createConnectWindow((data, guiWindow) => {
      guiWindow.setTitle('connecting...')

      if (this.connectionExists(data)) {
        guiWindow.close()
        return
      }

      this.initConn(data)
        .then(() => {
          this.props.saveAddConnData(data)
          guiWindow.close()
        })
        .catch(err => {
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

  changeActiveConnection = connection => {
    this.props.setActiveConnection(connection)
  }

  render() {
    const { connections } = this.props

    debug('[CONNECTIONS]', connections.length)

    return (
      <container style={{ paddingLeft: MARGIN_SIZE, paddingRight: MARGIN_SIZE }}>
        {connections.map((i, index) => {
          const connInfo = getConnInfo(i)
          return (
            <container
              ref={this.initConnectionContainer}
              key={index}
              style={CONNECTION_STYLE}
              onMouseUp={() => this.changeActiveConnection(i)}
            >
              <label
                text={getRegion(connInfo.endpoint)}
                style={{ marginTop: 10, color: '#FFF' }}
              />
            </container>
          )
        })}
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
