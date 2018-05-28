import React, { Component } from 'react'
import { string } from 'prop-types'
import { getImage } from '../images'

class Icon extends Component {
  static propTypes = {
    filename: string.isRequired,
  }

  static defaultProps = {
    width: 20,
    height: 20,
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  drawImage = (_, painter) => {
    const { width, height } = this.props
    const image = getImage(this.props.filename)
    const size = {
      width,
      height,
    }

    painter.drawImage(image, size)
  }

  render() {
    const { width, height } = this.props
    const size = {
      width,
      height,
    }

    const restProps = Object.assign({}, this.props)
    delete restProps.width
    delete restProps.height
    delete restProps.filename

    return (
      <container
        onDraw={this.drawImage}
        style={size}
        {...restProps}
      />
    )
  }
}

export default Icon
