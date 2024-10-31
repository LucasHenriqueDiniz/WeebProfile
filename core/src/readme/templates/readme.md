<!-- This file is auto-generated, don't update it manually -->
<div align='center'>
<img src='.github/assets/project-banner.png' height='400' justify='center' />
</div>

# WeebProfile 🦀

A simple and customizable way to display code, anime, and music stats on your GitHub profile README.

## 📝 Contents

{{#summaryOptions}}
- [{{.}}](#{{.}})
{{/summaryOptions}}

## 📦 Available plugins

{{#availablePlugins}}
- [{{.}}](#{{.}})
{{/availablePlugins}}

## 🖼️ Supported sections

{{#supported_sections}}

<h4>Right now we support {{supported_total}} sections with 2 styles each</h4>

{{#plugin_sections}}

<details close>
  <summary><b>{{name}}</b></summary>

### Default Style

  <table>
    <tr>
      <td align="center">Section</td>
      <td align="center" width="600px">Default Image Showcase</td>
    </tr>
    {{#defaultSections}}
    <tr>
      <td><code>{{section}}</code></td>
      <td><img src="{{imagePath}}"></td>
    </tr>
    {{/defaultSections}}
  </table>

### Terminal Style

  <table>
    <tr>
      <td align="center">Section</td>
      <td align="center" width="600px">Terminal Image Showcase</td>
    </tr>
    {{#terminalSections}}
    <tr>
      <td><code>{{section}}</code></td>
      <td><img src="{{imagePath}}"></td>
    </tr>
    {{/terminalSections}}
  </table>
</details>
  
{{/plugin_sections}}

{{/supported_sections}}

## ⚙️ Getting Started

{{ gettingStarted }}

## 📜 License

{{ license }}

## 🤝 Contributing

{{ contributing }}
