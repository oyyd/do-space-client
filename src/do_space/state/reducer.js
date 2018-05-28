import { saveConfig } from '../fs_storage'

const INITIAL_STATE = {
  config: null,
  mainWindow: null,
  connections: [],
  activeConnection: null,
  activeBucket: null,
  bucketsByHost: {},
}

function isTheConfig(config, conn) {
  const { spacesEndpoint = {}, s3 = {} } = conn
  const { host: endpoint } = spacesEndpoint
  const { config: s3Config = {} } = s3
  const { secretAccessKey, accessKeyId } = s3Config

  const obj = {
    endpoint,
    secretAccessKey,
    accessKeyId,
  }

  let equal = true

  Object.keys(obj).forEach(key => {
    if (config[key] !== obj[key]) {
      equal = false
    }
  })

  return equal
}

const funcs = {
  addBuckets: (state, data) => {
    const { buckets, endpoint } = data
    const { bucketsByHost } = state

    bucketsByHost[endpoint] = bucketsByHost[endpoint] || {}

    buckets.forEach(bucket => {
      bucketsByHost[endpoint][bucket.Name] = bucket
    })

    const nextState = Object.assign({}, state, {
      bucketsByHost,
    })

    return nextState
  },
  setConfig: (state, config) =>
    Object.assign({}, state, {
      config,
    }),
  setConfigAndSave: (state, config) => {
    saveConfig(config)
    return funcs.setConfig(state, config)
  },
  saveAddConnData: (state, data) => {
    const { config = {} } = state
    const { connectionsInfo = [] } = config

    connectionsInfo.push(data)
    config.connectionsInfo = connectionsInfo

    return funcs.setConfigAndSave(state, config)
  },
  saveRemoveConn: (state, conn) => {
    const { config = {} } = state
    const { connectionsInfo = [] } = config

    let index = 0

    const item = connectionsInfo.find((i, _index) => {
      if (isTheConfig(i, conn)) {
        index = _index
        return i
      }
    })

    if (!item) {
      return state
    }

    config.connectionsInfo = connectionsInfo
      .slice(0, index)
      .concat(connectionsInfo.slice(index + 1))

    return funcs.setConfigAndSave(state, config)
  },
  setActiveBucket: (state, activeBucket) =>
    Object.assign({}, state, {
      activeBucket,
    }),
  setMainWindow: (state, mainWindow) =>
    Object.assign({}, state, {
      mainWindow,
    }),
  removeConnection: (state, data) => {
    const { connections, activeConnection } = state

    const index = connections.indexOf(data)

    if (index < 0) {
      return state
    }

    const nextConnections = connections
      .slice(0, index)
      .concat(connections.slice(index + 1))
    let nextAcitveConnection = activeConnection

    if (data === activeConnection) {
      nextAcitveConnection = null
    }

    const nextState = Object.assign({}, state, {
      connections: nextConnections,
      activeConnection: nextAcitveConnection,
    })

    return nextState
  },
  addConnection: (state, data) => {
    let nextState = Object.assign({}, state, {
      connections: state.connections.concat([data]),
    })

    if (state.connections.length === 0) {
      nextState = funcs.setActiveConnection(nextState, data)

      const buckets = state.bucketsByHost[data.spacesEndpoint.host]

      if (!state.activeBucket && buckets && Object.keys(buckets).length > 0) {
        nextState = funcs.setActiveBucket(
          nextState,
          buckets[Object.keys(buckets)[0]]
        )
      }
      return nextState
    }

    return nextState
  },
  setActiveConnection: (state, data) =>
    Object.assign({}, state, {
      activeConnection: data,
    }),
}

export default function reducer(state = INITIAL_STATE, action) {
  if (funcs[action.type]) {
    const nextState = funcs[action.type](state, action.data)

    // console.log('nextState', action, nextState)
    return nextState
  }

  return state
}
