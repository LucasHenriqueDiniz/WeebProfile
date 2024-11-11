import LoadCss from "core/src/loadCss"
import puppeteer from "puppeteer"
import React, { JSXElementConstructor, ReactElement, ReactNode } from "react"
import { renderToString } from "react-dom/server"
import { PluginsConfig } from "source/plugins/@types/plugins"
import SvgContainer from "source/templates/Main/SvgContainer"
import logger from "../../source/helpers/logger"

async function calculateElementHeight(activePlugins: ReactNode, env: PluginsConfig): Promise<number> {
  logger({ message: "Calculating element height...", level: "info", __filename })

  const htmlstring = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    css: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode>
  ) => {
    return renderToString(
      <html lang="en" data-color-mode="dark" data-light-theme="light" data-dark-theme="dark">
        <head>
          <meta charSet="UTF-8" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
          {css}
        </head>
        <body>
          <SvgContainer height={0} asDiv={true} size={env.size} style={env.style}>
            {activePlugins}
          </SvgContainer>
        </body>
      </html>
    )
  }

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--start-minimized", "--window-size=1024,768"],
  })
  const page = await browser.newPage()
  const css = await LoadCss(env)
  // Render the page
  await page.setContent(htmlstring(css))

  await page.waitForSelector("#svg-main")

  //Wait 1s to test if the height is correct
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Get the element that contains the activePlugins
  const pluginsContainer = await page.$("#svg-main")

  // Verify if the element exists before getting the container dimensions
  const boundingBox = pluginsContainer ? await pluginsContainer.boundingBox() : null

  // body height
  const height = boundingBox?.height ?? 0

  await browser.close()

  logger({ message: `Element height: ${height}`, level: "info", __filename })
  return height
}

export default calculateElementHeight
