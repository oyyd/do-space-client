import React from 'react'

function Border(props) {
  return (
    <container
      ref={c => {
        if (c) {
          c.onDraw = () => {

          }
        }
      }}
    />
  )
}
