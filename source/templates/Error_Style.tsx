import React from "react";

const ErrorMessage = ({ message }: { message: string }): JSX.Element => {
  return <p className="error-message">Error: {message}</p>;
};

export default ErrorMessage;
