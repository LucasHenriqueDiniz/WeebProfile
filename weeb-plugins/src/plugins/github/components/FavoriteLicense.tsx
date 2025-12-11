import React from 'react'
import { FaCode } from 'react-icons/fa'
import { TbLicense } from 'react-icons/tb'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand'
import TerminalTree from '../../../templates/Terminal/TerminalTree'
import type { GridItemProps } from '../../../templates/types'
import { getPseudoCommands } from '../../../utils/pseudo-commands'
import type { GithubConfig, GithubData } from '../types'

interface FavoriteLicenseProps {
  data: GithubData['favoriteLicense']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

const DefaultFavoriteLicense = ({ data, total }: { data: GithubData['favoriteLicense']; total: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center h-full">
<TbLicense
  size={45}
  className="text-default-highlight"
  style={{ fill: 'none' }} 
/>
      </div>
      <div className="flex flex-col w-full">
        <span className="text-semibold text-default-muted text-lg">{data.name}</span>
        <span className="text-sm">
          Used in {data.count} out of {total} repositories
        </span>
      </div>
    </div>
  )
}

const TerminalFavoriteLicense = ({ data, total }: { data: GithubData['favoriteLicense']; total: number }) => {
  const percentage = total > 0 ? ((data.count / total) * 100).toFixed(2) : '0.00'
  const TreeItems: GridItemProps[] = [
    {
      title: data.name,
      subtitle: `${percentage}% of ${total} repositories`,
      value: `Used ${data.count} times`,
    },
  ]

  return <TerminalTree data={TreeItems} title="Favorite License" />
}

export function FavoriteLicense({
  data,
  config,
  style,
  size,
}: FavoriteLicenseProps): React.ReactElement {
  const title = config.favorite_license_title || 'Favorite License'
  const hideTitle = config.favorite_license_hide_title || false

  // Usar total dos dados ou estimar se não disponível
  const total = data.total || Math.max(data.count * 2, data.count)

  return (
    <section id="github-favorite-license">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCode />} />}
            <DefaultFavoriteLicense data={data} total={total} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: 'gh',
                plugin: 'github',
                section: 'license',
                username: config.username,
                command: 'list',
              })}
            />
            <TerminalFavoriteLicense data={data} total={total} />
          </>
        }
        style={style}
      />
    </section>
  )
}

