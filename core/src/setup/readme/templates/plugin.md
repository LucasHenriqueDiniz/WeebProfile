<!-- This file is auto-generated, don't update it manually -->

{{#mainTitle}}
# {{mainTitle}}
{{/mainTitle}}

<sub>This README is auto-generated and will be updated with the latest plugin options and supported sections.</sub>

## 📝 Contents

{{#summaryOptions}}
- [{{label}}](#{{value}})
{{/summaryOptions}}

### ➡️ Available options

<table>
  <tr>
    <td align="center" nowrap="nowrap"><b>Variable</b></td>
    <td align="center" nowrap="nowrap"><b>Description</b></td>
  </tr>
  {{#envVariables}}
  <tr>
    <td align="center" nowrap="nowrap"><code>{{variableName}}</code>
    <td align="center" nowrap="nowrap">
      <p>{{description}}</p>
      {{#show_sections_boolean}}
          <b>Available sections:</b>
          {{#sections}}
          <code>{{.}}</code>
          {{/sections}}
      {{/show_sections_boolean}}
      <p><b>Example:</b><code>{{example}}</code></p>
    </td>
  </tr>
  {{/envVariables}}
</table>

## 🖼️ Plugin Sections

{{#plugin_sections}}

<h4><b>{{name}}</b> has {{sections_length}} sections with 2 styles each.</h4>

<p>Here are the available sections and their respective images:</p>

# <b>Default Style:</b>

sub>This is the default style for all sections. If you want to use a different style, you can specify it in the plugin options.</sub>

  <table>
    <tr>
      <td align="center" nowrap="nowrap">Section</td>
      <td align="center" nowrap="nowrap" width="600px">Default Image Showcase</td>
    </tr>
    {{#defaultSections}}
    <tr>
      <td align="center" nowrap="nowrap"><code>{{section}}</code></td>
      <td align="center" nowrap="nowrap"><img src="{{imagePath}}"></img></td>
    </tr>
    {{/defaultSections}}
  </table>

### Terminal Style

<sub>This is the terminal style version of the sections. If you want to use this style you can specify it in the plugin options.<code>style: 'terminal'</code></sub>

  <table>
    <tr>
      <td align="center" nowrap="nowrap">Section</td>
      <td align="center" nowrap="nowrap" width="600px">Terminal Image Showcase</td>
    </tr>
    {{#terminalSections}}
    <tr>
      <td align="center" nowrap="nowrap"><code>{{section}}</code></td>
      <td align="center" nowrap="nowrap"><img src="{{imagePath}}"></img></td>
    </tr>
    {{/terminalSections}}
  </table>
  
{{/plugin_sections}}
