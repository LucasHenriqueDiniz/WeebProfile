import React from "react"
import { StatisticsData } from "../types"
import Terminal_Section from "source/templates/Terminal/Terminal_Section"
import Terminal_Line from "source/templates/Terminal/Terminal_Line"

const Statistics = (data: StatisticsData) => {
  return (
    <Terminal_Section title="System Statistics" icon="📊">
      <Terminal_Line prompt="$" command="stats --total">
        Total Items: {data.totalItems}
      </Terminal_Line>

      <Terminal_Line prompt="$" command="stats --completed">
        Completed: {data.completedItems}
      </Terminal_Line>

      <Terminal_Line prompt="$" command="stats --progress">
        In Progress: {data.inProgressItems}
      </Terminal_Line>

      <Terminal_Line type="info" timestamp>
        Last updated at {new Date().toLocaleDateString()}
      </Terminal_Line>

      {data.totalItems === 0 ? (
        <Terminal_Line type="error">No data available</Terminal_Line>
      ) : (
        <Terminal_Line type="success">Data loaded successfully</Terminal_Line>
      )}
    </Terminal_Section>
  )
}

export default Statistics
