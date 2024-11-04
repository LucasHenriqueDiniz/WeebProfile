import * as Tooltip from "@radix-ui/react-tooltip"
import React from "react"
import "./DescriptionTooltip.css"
import { FaInfo } from "react-icons/fa"

const DescriptionTooltip = ({ description, required }: { description: string; required?: boolean }) => {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="plugins-tooltip-button">
            <FaInfo />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="plugins-tooltip-content data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
            sideOffset={5}
          >
            {description}
            {required && (
              <>
                <span className="plugins-tooltip-divider" />
                <p className="plugins-tooltip-required-text">This field is required!</p>
              </>
            )}
            <Tooltip.Arrow className="plugins-tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export default DescriptionTooltip
