"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { use } from "react"
import { FaList } from "react-icons/fa"
import { IoArrowBackOutline } from "react-icons/io5"
import { RxOpenInNewWindow } from "react-icons/rx"
import { TbNewSection } from "react-icons/tb"
import logger from "source/helpers/logger"
import { PluginName } from "source/plugins/@types/plugins"
import ErrorMessage from "source/templates/Error_Style"
import SvgContainer from "source/templates/Main/SvgContainer"
import Button from "web-client/components/Button/Button"
import LoadingIcon from "web-client/components/LoadingIcon"
import NotFound from "../../../components/NotFound"
import { usePluginSection } from "./usePluginSection"

interface Props {
  params: Promise<{
    plugin: PluginName
    section: string
  }>
}

export default function PluginSection({ params }: Props) {
  const { plugin, section } = use(params)
  const searchParams = useSearchParams()
  const { currentPlugin, config, data, isLoading, error, isValidSection } = usePluginSection(plugin, section)

  if (isLoading) {
    return <LoadingIcon />
  }

  if (!currentPlugin) {
    return (
      <NotFound
        message={`The plugin "${plugin}" was not found.`}
        heading="Plugin Not Found"
        buttons={
          <>
            <Link href="/">
              <Button variant="secondary" size="lg" beforeIcon={<IoArrowBackOutline />}>
                Back Home
              </Button>
            </Link>

            <Link href="/plugins">
              <Button variant="primary" size="lg" afterIcon={<FaList />}>
                View All Plugins
              </Button>
            </Link>
          </>
        }
      />
    )
  }

  if (error) {
    logger({ message: `Error: ${error}`, level: "error" })
    return <ErrorMessage message={error} />
  }

  if (!isValidSection) {
    const similarSection = currentPlugin.sections
      .map((s) => ({ section: s, similarity: s.toLowerCase().indexOf(section.toLowerCase()) }))
      .filter(({ similarity }) => similarity !== -1)
      .sort((a, b) => a.similarity - b.similarity)
      .map(({ section }) => section)[0]

    return (
      <NotFound
        heading="Section Not Found"
        message={
          <>
            <p>
              Section <strong>&quot;{section}&quot;</strong> not found in <strong>{plugin}</strong> plugin.
            </p>
            {similarSection && (
              <Link href={`/${currentPlugin.name}/${similarSection}`} className="mt-2">
                <Button variant="ghost" size="sm" afterIcon={<RxOpenInNewWindow />}>
                  Did you mean <strong>&quot;{similarSection}&quot;</strong>?
                </Button>
              </Link>
            )}
          </>
        }
        buttons={
          <>
            <Link href="/">
              <Button variant="secondary" size="lg" beforeIcon={<IoArrowBackOutline />}>
                Back Home
              </Button>
            </Link>

            <Link href={`/${plugin}`}>
              <Button variant="primary" size="lg" beforeIcon={<TbNewSection />}>
                See {plugin} sections
              </Button>
            </Link>

            <Link href="/plugins">
              <Button variant="secondary" size="lg" beforeIcon={<FaList />}>
                View All Plugins
              </Button>
            </Link>
          </>
        }
      />
    )
  }

  const pluginName = currentPlugin.name

  return (
    <>
      <SvgContainer
        size={searchParams.get("size") || "half"}
        height={0}
        style={searchParams.get("style") || "default"}
        asDiv
      >
        {config && config[pluginName] && currentPlugin.renderer(config[pluginName], data)}
      </SvgContainer>
    </>
  )
}
