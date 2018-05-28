import React from 'react'
import { Provider } from 'react-redux'
import Connection from './connection'
import Panel from './panel'
import WorkSpace from './work_space'
import {
  bgColor,
  regionConnectionWidth,
} from './style'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidCatch(err) {
    console.log('err', err)
  }

  render() {
    const { store } = this.props

    return (
      <Provider store={store}>
        <container
          style={{
            flexDirection: 'row',
            flex: 1,
          }}
        >
          <vibrant
            material="dark"
            style={{
              width: regionConnectionWidth,
            }}
          >
            <Connection />
          </vibrant>
          <container style={{ width: 200, backgroundColor: bgColor }}>
            <Panel
              backgroundColor={bgColor}
            />
          </container>
          <container style={{ flex: 16, backgroundColor: '#FFFFFF' }}>
            <WorkSpace />
          </container>
        </container>
      </Provider>
    )
  }
}

export default App
