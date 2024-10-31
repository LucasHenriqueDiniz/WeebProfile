"use client"
import useStore from "app/store"
import Image from "next/image"
import { useEffect, useState } from "react"
import { generateActionCode } from "web-client/app/storeHelpers"
import { ActionCode } from "web-client/app/storeTypes"
import { useToast } from "web-client/app/ToastProvider"
import { actionsCodePastLocation, actionsManualRun, actionsSetUpSecretVariables } from "web-client/static"
import copyToClipboard from "web-client/utils/copyToClipboard"
import NoPluginsSelected from "./NoPluginsSelected"
import Button from "../Button/Button"
import CodeBlock from "../CodeBlock/CodeBlock"
import DialogBox from "../DialogBox/DialogBox"
import VerticalStepper from "../VerticalStepper/VerticalStepper"

// @TODO - Fix this mess
function actionCodeToStringArray(actionCode: ActionCode): string[] {
  const stepsWithEntries = Object.entries(actionCode.jobs.weeb_profile.steps.with)
    .map(([key, value]) => `          ${key}: ${value}`)
    .join("\n")
  return `
name: ${actionCode.name}
on:
  schedule: ${actionCode.on.schedule}
  workflow_dispatch: ${actionCode.on.workflow_dispatch}
jobs:
  weeb_profile:
    runs_on: ${actionCode.jobs.weeb_profile.runs_on}
    steps:
      - name: ${actionCode.jobs.weeb_profile.steps.name}
        uses: ${actionCode.jobs.weeb_profile.steps.uses}
        with:
${stepsWithEntries}
  `
    .trim()
    .split("\n")
}

const ActionContent = ({ content }: { content: ActionCode | null }) => {
  const { sendToast } = useToast()
  if (content === null) return <NoPluginsSelected />
  const codeLines = actionCodeToStringArray(content)
  const steps = [
    {
      title: "Copy the action code",
      children: (
        <>
          <p>The action code is a YAML file that defines the workflow, including the triggers, jobs, and steps.</p>
          <Button
            size='lg'
            style={{ marginBottom: "1rem", maxWidth: "fit-content" }}
            onClick={() => {
              copyToClipboard(codeLines.join("\n"))
              sendToast({ title: "Copied to clipboard", description: "The code was copied to your clipboard" })
            }}
          >
            Copy to clipboard
          </Button>
          <Image
            src={actionsCodePastLocation}
            alt='actions_code_paste_location'
            width={actionsCodePastLocation.width}
            height={actionsCodePastLocation.height}
          />
        </>
      ),
    },
    {
      title: "Paste the action code",
      children: (
        <p>
          Paste the action code into a new file in your repository named <code>.github/workflows/weeb_profile.yml</code>
          .
        </p>
      ),
    },
    {
      title: "Commit the action code",
      children: (
        <>
          <p>
            Commit the file to your repository. The workflow will run automatically based on the triggers you defined or
            you can manually run it from the Actions tab in your repository.
          </p>
        </>
      ),
    },
    {
      title: "Setting up the secrets",
      children: (
        <>
          <p>
            Set up a repository variable for the sensitive information that the action needs to run (e.g., GH_TOKEN,
            passwords, etc).
          </p>
          <Image
            src={actionsSetUpSecretVariables}
            alt='actions_set_up_secret_variables'
            width={actionsSetUpSecretVariables.width}
            height={actionsSetUpSecretVariables.height}
          />
          <p>1. Go to your repository.</p>
          <p>2. Go to the Settings tab.</p>
          <p>3. Go to the Secrets and Variables tab.</p>
          <p>4. Go to the Actions tab.</p>
          <p>5. Click on the New repository secret button</p>
          <p>6. Add the secret name and value. ex: GH_TOKEN and the value of your token.</p>
        </>
      ),
    },
    {
      title: "Done!",
      children: (
        <>
          <p>
            The action is now set up and will run automatically based on the triggers you defined or you can manually
            run it from the Actions tab in your repository.
          </p>
          <Image
            src={actionsManualRun}
            alt='actions_manual_run_location'
            width={actionsManualRun.width}
            height={actionsManualRun.height}
          />
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
            copyToClipboard(codeLines.join("\n"))
            sendToast({ title: "Copied to clipboard", description: "The code was copied to your clipboard" })
          }}
        >
          Copy to clipboard
        </Button>
      </div>
      <CodeBlock codeLines={codeLines} />
    </>
  )
}

const ActionTab = () => {
  const { activePlugins, pluginsConfig } = useStore()
  const [actionCode, setActionCode] = useState<ActionCode | null>(null)

  useEffect(() => {
    setActionCode(generateActionCode(pluginsConfig, activePlugins))
  }, [pluginsConfig, activePlugins])

  return <>{activePlugins.length === 0 ? <NoPluginsSelected /> : <ActionContent content={actionCode} />}</>
}

export default ActionTab
