/**
 * Calculadora de altura usando Puppeteer
 * 
 * Renderiza o componente React no Puppeteer com width correto
 * e pega o tamanho real renderizado
 */

import puppeteer from 'puppeteer'
import { renderToString } from 'react-dom/server'
import * as React from 'react'
import type { SvgConfig } from '../types/index.js'
import { loadCss } from './css-loader.js'
import { renderPlugins } from '../renderer/react-renderer.js'
import { createSvgContainerDiv } from './svg-container-div.js'

/**
 * Calcula a largura do SVG baseado no tamanho
 */
export function calculateSvgWidth(size: 'half' | 'full'): number {
  return size === 'half' ? 415 : 830
}

/**
 * Calcula altura usando Puppeteer (método preciso)
 * 
 * Renderiza o componente React no Puppeteer com width correto
 * e pega o tamanho real renderizado
 */
export async function calculateSvgHeightWithPuppeteer(
  config: SvgConfig
): Promise<number> {
  const svgWidth = calculateSvgWidth(config.size)
  
  // Renderizar plugins
  const pluginsContent = await renderPlugins(config)
  
  // Carregar CSS
  const cssDefs = await loadCss(config)
  
  // Criar HTML string com o container como div (para Puppeteer medir)
  const htmlString = (css: React.ReactElement) => {
    return renderToString(
      React.createElement(
        'html',
        { lang: 'en', 'data-color-mode': 'dark', 'data-light-theme': 'light', 'data-dark-theme': 'dark' },
        React.createElement(
          'head',
          null,
          React.createElement('meta', { charSet: 'UTF-8' }),
          React.createElement('meta', { name: 'viewport', content: `width=${svgWidth}, initial-scale=1.0` }),
          React.createElement('link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }),
          React.createElement('link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: '' }),
          React.createElement('link', {
            href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
            rel: 'stylesheet',
          }),
          css
        ),
        React.createElement(
          'body',
          { style: { margin: 0, padding: 0, width: `${svgWidth}px` } },
          createSvgContainerDiv({
            size: config.size,
            style: config.style,
            cssDefs: css,
            children: pluginsContent,
            terminalTheme: config.terminalTheme,
            defaultTheme: config.defaultTheme,
            hideTerminalHeader: config.hideTerminalHeader,
            hideTerminalEmojis: config.hideTerminalEmojis,
          })
        )
      )
    )
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })
  
  try {
    const page = await browser.newPage()
    
    // Configurar viewport com a largura EXATA do SVG
    await page.setViewport({
      width: svgWidth,
      height: 5000, // Altura inicial alta
      deviceScaleFactor: 1,
    })
    
    const css = await loadCss(config)
    await page.setContent(htmlString(css))

    await page.waitForSelector("#svg-main", { timeout: 10000 })

    // Aguardar estabilização usando ResizeObserver e MutationObserver
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        const element = document.getElementById("svg-main")
        if (!element) {
          resolve()
          return
        }

        let stableHeight = 0
        let stableCount = 0
        const REQUIRED_STABLE_COUNT = 3

        const checkStability = () => {
          const currentHeight = element.scrollHeight
          
          if (currentHeight === stableHeight) {
            stableCount++
            if (stableCount >= REQUIRED_STABLE_COUNT) {
              resolve()
              return
            }
          } else {
            stableHeight = currentHeight
            stableCount = 0
          }

          setTimeout(() => {
            if (stableCount < REQUIRED_STABLE_COUNT) {
              resolve()
            }
          }, 2000)
        }

        const resizeObserver = new ResizeObserver(() => {
          checkStability()
        })

        const mutationObserver = new MutationObserver(() => {
          checkStability()
        })

        resizeObserver.observe(element)
        mutationObserver.observe(element, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["style", "class"],
        })

        const images = Array.from(document.images)
        if (images.length === 0) {
          checkStability()
        } else {
          Promise.all(
            images.map((img) => {
              if (img.complete) return Promise.resolve()
              return new Promise<void>((resolve) => {
                img.onload = () => resolve()
                img.onerror = () => resolve()
                setTimeout(() => resolve(), 1000)
              })
            })
          ).then(() => {
            setTimeout(() => {
              checkStability()
            }, 200)
          })
        }

        setTimeout(() => {
          checkStability()
        }, 100)
      })
    })

    // Medir altura usando múltiplos métodos
    const measurements = await page.evaluate(() => {
      const element = document.getElementById("svg-main")
      if (!element) {
        return {
          scrollHeight: 0,
          offsetHeight: 0,
          clientHeight: 0,
          boundingHeight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginBottom: 0,
        }
      }

      const rect = element.getBoundingClientRect()
      const computed = window.getComputedStyle(element)

      return {
        scrollHeight: element.scrollHeight,
        offsetHeight: element.offsetHeight,
        clientHeight: element.clientHeight,
        boundingHeight: rect.height,
        paddingTop: parseFloat(computed.paddingTop) || 0,
        paddingBottom: parseFloat(computed.paddingBottom) || 0,
        marginTop: parseFloat(computed.marginTop) || 0,
        marginBottom: parseFloat(computed.marginBottom) || 0,
      }
    })

    const bodyStyles = await page.evaluate(() => {
      const body = document.body
      const computed = window.getComputedStyle(body)
      return {
        paddingTop: parseFloat(computed.paddingTop) || 0,
        paddingBottom: parseFloat(computed.paddingBottom) || 0,
        marginTop: parseFloat(computed.marginTop) || 0,
        marginBottom: parseFloat(computed.marginBottom) || 0,
      }
    })

    const measuredHeight = Math.max(
      measurements.scrollHeight,
      measurements.offsetHeight,
      measurements.clientHeight,
      measurements.boundingHeight
    )

    const extraSpacing =
      bodyStyles.paddingTop +
      bodyStyles.paddingBottom +
      bodyStyles.marginTop +
      bodyStyles.marginBottom +
      measurements.paddingTop +
      measurements.paddingBottom +
      measurements.marginTop +
      measurements.marginBottom

    const height = Math.ceil(measuredHeight + extraSpacing + 20)

    if (height <= 0) {
      throw new Error(`Invalid height calculated: ${height}`)
    }

    console.log(`✅ Puppeteer height calculated: ${height}px (measured: ${measuredHeight}px, extraSpacing: ${extraSpacing}px, mode: ${config.size}, width: ${svgWidth}px)`)

    return height
  } finally {
    await browser.close()
  }
}

