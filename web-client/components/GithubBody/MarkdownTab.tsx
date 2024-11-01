"use client"
import useStore from "app/store"
import Image from "next/image"
import { GenerateMarkdownCode } from "web-client/app/storeHelpers"
import { useToast } from "web-client/app/ToastProvider"
import { markdownWhereShouldIPaste } from "web-client/static"
import copyToClipboard from "web-client/utils/copyToClipboard"
import Button from "../Button/Button"
import CodeBlock from "../CodeBlock/CodeBlock"
import DialogBox from "../DialogBox/DialogBox"
import VerticalStepper from "../VerticalStepper/VerticalStepper"
import NoPluginsSelected from "./NoPluginsSelected"

const MarkdownContent = ({ content }: { content: string }) => {
  const { sendToast } = useToast()
  const steps = [
    {
      title: "Copy the markdown code",
      children: (
        <>
          <p>The markdown code is how you can display your generated svg on your GitHub readme.</p>
          <Button
            size='lg'
            style={{ marginBottom: "1rem", maxWidth: "fit-content" }}
            onClick={() => {
              copyToClipboard(content.toString())
              sendToast({ title: "Copied to clipboard", description: "The code was copied to your clipboard" })
            }}
          >
            Copy to clipboard
          </Button>
        </>
      ),
    },
    {
      title: "Create a README.md file if you don't have one",
      children: (
        <>
          <p>
            If you don&apos;t have a README.md file in your repository, create one by clicking the &ldquo;Add
            file&ldquo; button in your repository and name it
            <code>README.md</code>.
          </p>
        </>
      ),
    },
    {
      title: "Paste the markdown code in your README.md file",
      children: (
        <>
          <p>
            Open the <code>README.md</code> file and paste the markdown code in it. Commit the changes to your
            repository.
            <Image
              src={markdownWhereShouldIPaste}
              alt='Where should I paste the markdown code?'
              width={markdownWhereShouldIPaste.width}
              height={markdownWhereShouldIPaste.height}
            />
          </p>
        </>
      ),
    },
    {
      title: "Check your GitHub profile",
      children: (
        <>
          <p>
            After a few seconds, your GitHub profile will be updated with the new SVG. If it doesn&apos;t update, try
            refreshing the page.
          </p>
          <p>
            💡 If your are using an <code>actions</code> workflow, the update will only occur after the workflow is
            executed.(
            <code>workflow_dispatch</code> trigger or <code>schedule</code>)
          </p>
        </>
      ),
    },
  ]

  return (
    <>
      <div className='flex h-full items-center justify-between mb-2'>
        <DialogBox
          trigger={
            <Button size='md' variant='secondary'>
              What i do with this?
            </Button>
          }
          title='What i do with the action code?'
        >
          <div className='scrollable -y flex h-full flex-col items-center justify-between py-6'>
            <VerticalStepper steps={steps} />
          </div>
        </DialogBox>
        <Button
          size='lg'
          onClick={() => {
            copyToClipboard(content.toString())
            sendToast({ title: "Copied to clipboard!", description: "The code was copied to your clipboard" })
          }}
        >
          Copy to clipboard
        </Button>
      </div>
      <CodeBlock codeLines={content.split("\n")} />
    </>
  )
}

const MarkdownTab = () => {
  const { activePlugins, pluginsConfig } = useStore()

  const markdownContent = GenerateMarkdownCode(pluginsConfig)

  return <>{activePlugins.length === 0 ? <NoPluginsSelected /> : <MarkdownContent content={markdownContent} />}</>
}

export default MarkdownTab
