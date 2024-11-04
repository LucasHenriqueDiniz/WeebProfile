import * as Dialog from "@radix-ui/react-dialog"
import groupClasses from "classnames"
import React, { ReactNode } from "react"
import "./DialogBox.css"
import { MdClose } from "react-icons/md"

interface classNames {
  trigger: string
  content: string
  title: string
  description: string
  overlay: string
  closeButton: string
}

interface DialogBoxProps {
  trigger: ReactNode
  children: ReactNode
  title?: string
  description?: string
  classNames?: classNames
}

type DialogBoxComponent = React.FC<DialogBoxProps>

const DialogBox: DialogBoxComponent = ({ trigger, children, title, description, classNames }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild className={groupClasses("dialog-trigger", classNames?.trigger)}>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={groupClasses("dialog-overlay", classNames?.overlay)} />
        <Dialog.Content className={groupClasses("dialog-content", classNames?.content)}>
          {title && <Dialog.Title className={groupClasses("dialog-title", classNames?.title)}>{title}</Dialog.Title>}
          {description && (
            <Dialog.Description className={groupClasses("dialog-description", classNames?.description)}>
              {description}
            </Dialog.Description>
          )}
          {children}
          <Dialog.Close asChild>
            <button aria-label="Close" className={groupClasses("dialog-close-button", classNames?.closeButton)}>
              <MdClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default DialogBox
