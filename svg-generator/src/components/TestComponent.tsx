import React from 'react'

export function TestComponent(): React.ReactElement {
  return React.createElement('div', null,
    React.createElement('h1', null, 'TEST COMPONENT FROM SVG-GENERATOR'),
    React.createElement('p', null, 'If you see this, the svg-generator is working!')
  )
}





