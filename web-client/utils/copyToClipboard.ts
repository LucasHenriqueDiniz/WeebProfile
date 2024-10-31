// @ TODO - Theres is definitely a better way to do this, but for now this will do

function copyToClipboard(text: string) {
  const el = document.createElement("textarea")
  el.value = text
  document.body.appendChild(el)
  el.select()
  navigator.clipboard.writeText(text)
  document.body.removeChild(el)
}

export default copyToClipboard
