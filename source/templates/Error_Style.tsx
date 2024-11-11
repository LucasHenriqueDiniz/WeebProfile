import React from "react"

const ErrorMessage = ({ message }: { message: string }): JSX.Element => {
  return <p className="text-red-500 text-md font-bold">Error: {message}</p>
}

export default ErrorMessage
