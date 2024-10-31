import { FaCopy } from "react-icons/fa"
import JsonView from "react-json-view"
import PluginsConfig from "source/plugins/@types/PluginsConfig"
import { PluginsData } from "source/plugins/plugins"
import useStore from "web-client/app/store"
import { useToast } from "web-client/app/ToastProvider"
import copyToClipboard from "web-client/utils/copyToClipboard"
import Button from "../Button/Button"
import "./CodeBlock.css"

const JsonCodeBlock = ({
  json,
  name,
  showCopyToClipboard,
}: {
  json: PluginsConfig | PluginsData | undefined
  name?: string
  showCopyToClipboard?: boolean
}) => {
  const { sendToast } = useToast()
  const { theme } = useStore()
  if (!json) {
    return <div className='json-code-block'>No data</div>
  }

  return (
    <div className='json-code-block'>
      {showCopyToClipboard && (
        <Button
          className='copy-button'
          variant='primary'
          onClick={() => {
            sendToast({
              title: `${name ? name + " " : ""}Copied to clipboard`,
              description: "The JSON has been copied to the clipboard",
            })
            copyToClipboard(JSON.stringify(json, null, 2))
          }}
        >
          <FaCopy />
          Copy
        </Button>
      )}
      <JsonView
        indentWidth={2}
        src={json}
        name={null}
        collapsed={true}
        theme={theme === "dark" ? "codeschool" : "bright:inverted"}
        enableClipboard={false}
      />
    </div>
  )
}

export default JsonCodeBlock
