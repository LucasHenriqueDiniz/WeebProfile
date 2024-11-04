import { FaCopy } from "react-icons/fa"
import Editor from "@monaco-editor/react"
import useStore from "web-client/app/store"
import { useToast } from "web-client/app/ToastProvider"
import copyToClipboard from "web-client/utils/copyToClipboard"
import Button from "../Button/Button"
import "./CodeBlock.css"
import { PluginDataMap, PluginsConfig } from "source/plugins/@types/plugins"

const JsonCodeBlock = ({
  json,
  name,
  showCopyToClipboard,
}: {
  json: PluginsConfig | PluginDataMap | undefined
  name?: string
  showCopyToClipboard?: boolean
}) => {
  const { sendToast } = useToast()
  const { theme } = useStore()

  if (!json) {
    return <div className="json-code-block">No data</div>
  }

  const formattedJson = JSON.stringify(json, null, 2)

  return (
    <div className="json-code-block code-block">
      {showCopyToClipboard && (
        <Button
          className="copy-button"
          variant="primary"
          onClick={() => {
            sendToast({
              title: `${name ? name + " " : ""}Copied to clipboard`,
              description: "The JSON has been copied to the clipboard",
            })
            copyToClipboard(formattedJson)
          }}
        >
          <FaCopy />
          Copy
        </Button>
      )}
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="json"
        defaultValue={formattedJson}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          folding: true,
          lineNumbers: "on",
          wordWrap: "on",
          formatOnPaste: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: "var(--code-font)",
          padding: { top: 16, bottom: 16 },
        }}
        className="monaco-editor-container"
      />
    </div>
  )
}

export default JsonCodeBlock
