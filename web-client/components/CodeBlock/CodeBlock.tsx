import React from "react"
import "./CodeBlock.css"

const CodeBlock = ({ codeLines }: { codeLines: string[] }) => {
  return (
    <pre className='code-block'>
      {codeLines.map((line, index) => (
        <div key={index} className='code-line'>
          <span className='line-number'>{index + 1}</span> {line}
        </div>
      ))}
    </pre>
  )
}

export default CodeBlock
