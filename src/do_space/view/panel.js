import React from 'react'
import { func, object, string } from 'prop-types'
import { connect } from 'react-redux'
import gui, { Font } from 'gui'
import fecha from 'fecha'
import { fontColorStrong, fontColor, bgColorThick } from './style'
import Icon from './icon'

// const fontTitle = Font.create('aria', 16, 'bold', 'normal')
const bucketTitle = Font.create('aria', 12, 'bold', 'normal')
const fontCom = Font.create('aria', 12, 'bold', 'normal')

function saveRemoveConn(dispatch, conn) {
  dispatch({
    type: 'saveRemoveConn',
    data: conn,
  })
}

function disconnectDoSpace(dispatch, data) {
  dispatch({
    type: 'removeConnection',
    data,
  })
}

function setActiveBucket(dispatch, bucket) {
  dispatch({
    type: 'setActiveBucket',
    data: bucket,
  })
}

function getBucketsFromObj(obj) {
  if (!obj || typeof obj !== 'object') {
    return []
  }

  return Object.keys(obj).map(i => obj[i])
}

function s(state) {
  return {
    activeConnection: state.activeConnection,
    activeBucket: state.activeBucket,
    bucketsByHost: state.bucketsByHost,
  }
}

function d(dispatch) {
  return {
    saveRemoveConn: saveRemoveConn.bind(null, dispatch),
    disconnectDoSpace: disconnectDoSpace.bind(null, dispatch),
    setActiveBucket: setActiveBucket.bind(null, dispatch),
    // setConfigAndSave: setConfigAndSave.bind(null, dispatch),
  }
}

class Panel extends React.Component {
  static propTypes = {
    saveRemoveConn: func.isRequired,
    setActiveBucket: func.isRequired,
    activeConnection: object,
    activeBucket: object,
    backgroundColor: string.isRequired,
    disconnectDoSpace: func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      activeConnection: null,
      hoverBucket: null,
      // buckets: null,
    }

    this.lastActiveConnection = null
  }

  componentDidMount() {
    // this.checkActiveConnection(this.props.activeConnection)
  }

  componentWillReceiveProps(newProps) {
    // console.log('newProps', newProps)
    // this.checkActiveConnection(newProps.activeConnection)
  }

  // checkActiveConnection = activeConnection => {
  //   if (!activeConnection || activeConnection === this.lastActiveConnection) {
  //     return
  //   }
  //
  //   this.lastActiveConnection = activeConnection
  //   this.setState({
  //     buckets: [],
  //   })
  //   this.getBuckets(activeConnection)
  // }
  //
  activateBucket = bucket => {
    this.props.setActiveBucket(bucket)
  }

  activateBucketStyle = hoverBucket => {
    this.setState({
      hoverBucket,
    })
  }

  renderBucket = bucket => {
    const { activeBucket, backgroundColor } = this.props
    const { hoverBucket } = this.state
    const { Name, CreationDate } = bucket

    const isHover = hoverBucket === bucket
    const isActive = activeBucket === bucket

    const containerStyle = {
      paddingLeft: 20,
      marginBottom: 12,
      backgroundColor,
    }

    if (isHover) {
      containerStyle.backgroundColor = bgColorThick
    }

    return (
      <container
        key={Name}
        style={containerStyle}
        onMouseEnter={() => this.activateBucketStyle(bucket)}
        onMouseUp={() => this.activateBucket(bucket)}
      >
        <container
          style={{
            flexDirection: 'row',
          }}
        >
          <container
            style={{
              width: 20,
              paddingRight: 6,
            }}
          >
            {isActive
              ? <Icon width={14} height={14} filename="close.png" />
              : null}
          </container>
          <label
            align="start"
            font={bucketTitle}
            text={Name}
            style={{
              flex: 1,
              color: isHover ? fontColorStrong : fontColor,
            }}
          />
        </container>
        <container
          style={{
            marginTop: 4,
            marginBottom: 4,
            paddingLeft: 10,
          }}
        >
          <label
            align="start"
            font={fontCom}
            text={`Created at: ${fecha.format(new Date(CreationDate), 'YYYY-MM-DD')}`}
            style={{
              color: fontColor,
            }}
          />
        </container>
      </container>
    )
  }

  logout = connection => {
    this.props.saveRemoveConn(connection)
    this.props.disconnectDoSpace(connection)
  }

  logoutPop = connection => {
    const menu = gui.Menu.create([
      {
        label: 'logout',
        onClick: () => this.logout(connection),
      },
    ])

    menu.popup()
  }

  render() {
    const { activeConnection, bucketsByHost } = this.props

    if (!activeConnection) {
      return null
    }

    const buckets = getBucketsFromObj(
      bucketsByHost[activeConnection.spacesEndpoint.host]
    )

    const { spacesEndpoint = {} } = activeConnection
    const { host } = spacesEndpoint

    return (
      <container>
        <container
          style={{
            paddingLeft: 20,
            marginTop: 8,
            marginBottom: 14,
            flexWrap: 'wrap',
          }}
          onMouseUp={() => this.logoutPop(activeConnection)}
        >
          <label
            font={bucketTitle}
            text={host}
            style={{
              color: fontColorStrong,
              flexWrap: 'wrap',
            }}
          />
        </container>
        {buckets === null
          ? <label text="loading..." />
          : buckets.map(i => this.renderBucket(i))}
      </container>
    )
  }
}

const Connected = connect(s, d)(Panel)

Connected.Panel = Panel

export default Connected
