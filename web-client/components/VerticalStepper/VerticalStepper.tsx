import React from "react"
import "./VerticalStepper.css"
import classnames from "classnames"

interface ClassNames {
  container?: string
  stepper?: string
  stepIconContainer?: string
  stepIcon?: string
  stepTitle?: string
  stepLine?: string
  stepContent?: string
  stepConnectorLine?: string
}

interface Step {
  title: string
  children: React.ReactNode
}

const VerticalStepper = ({ steps, classNames }: { steps: Step[]; classNames?: ClassNames }) => {
  const lastIndex = steps.length - 1

  return (
    <div className={classnames("step-container", classNames?.container)}>
      {steps.map((step, index) => (
        <div key={index} className={classnames("stepper", classNames?.stepper)}>
          <div className={classnames("step-icon-container", classNames?.stepIconContainer)}>
            <div className={classnames("step-icon", classNames?.stepIcon)}>{index + 1}</div>
          </div>
          <span className={classnames("step-title", classNames?.stepTitle)}>{step.title}</span>
          <span className={classnames("step-line", classNames?.stepLine, { "hide-line": lastIndex === index })}></span>
          <div className={classnames("step-content", classNames?.stepContent)}>{step.children}</div>
          <div
            className={classnames("step-connector-line", classNames?.stepConnectorLine, {
              "hide-line": lastIndex === index,
            })}
          ></div>
        </div>
      ))}
    </div>
  )
}

export default VerticalStepper
