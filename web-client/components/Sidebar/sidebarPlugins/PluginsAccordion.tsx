import { Item, Content, Trigger, Header } from "@radix-ui/react-accordion"
import React from "react"
import { FaChevronDown } from "react-icons/fa"
import classNames from "classnames"

const AccordionItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Item>>(
  ({ children, className, ...props }, forwardedRef) => (
    <Item className={classNames("AccordionItem", className)} {...props} ref={forwardedRef}>
      {children}
    </Item>
  )
)

const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Trigger>>(
  ({ children, className, ...props }, forwardedRef) => (
    <Header className="AccordionHeader">
      <Trigger className={classNames("AccordionTrigger", className)} {...props} ref={forwardedRef}>
        {children}
        <FaChevronDown
          className="AccordionChevron text-violet10 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)]"
          aria-hidden
        />
      </Trigger>
    </Header>
  )
)

const AccordionContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Content>>(
  ({ children, className, ...props }, forwardedRef) => (
    <Content className={classNames("AccordionContent", className)} {...props} ref={forwardedRef}>
      {children}
    </Content>
  )
)

AccordionContent.displayName = "AccordionContent"
AccordionTrigger.displayName = "AccordionTrigger"
AccordionItem.displayName = "AccordionItem"

export { AccordionItem, AccordionTrigger, AccordionContent }
