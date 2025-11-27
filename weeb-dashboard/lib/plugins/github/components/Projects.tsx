/**
 * Componente Projects do GitHub
 */

import React from 'react'
import { FaProjectDiagram } from 'react-icons/fa'
import { abbreviateNumber } from '../../../weeb-plugins/utils/number'
import { DefaultTitle } from '../../../weeb-plugins/templates/Default/DefaultTitle'
import { RenderBasedOnStyle } from '../../../weeb-plugins/templates/RenderBasedOnStyle'
import { TerminalCommand } from '../../../weeb-plugins/templates/Terminal/TerminalCommand'
import { TerminalGrid } from '../../../weeb-plugins/templates/Terminal/TerminalGrid'
import { TerminalLineBreak } from '../../../weeb-plugins/templates/Terminal/TerminalLineBreak'
import { getPseudoCommands } from '../../../weeb-plugins/utils/pseudo-commands'
import type { GithubData, GithubConfig } from '../types'

const DefaultProjects = ({ 
  data 
}: { 
  data: NonNullable<GithubData['projects']>
}) => {
  const maxProjects = 10
  const projectsToShow = data.nodes.slice(0, maxProjects)

  if (projectsToShow.length === 0) {
    return (
      <div className="text-center text-default-muted py-8">
        No projects found
      </div>
    )
  }

  return (
    <div className="github-projects">
      <div className="grid grid-cols-1 gap-4">
        {projectsToShow.map((project, index) => (
          <a
            key={index}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border border-default-border hover:bg-default-hover transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-default-text truncate">
                  {project.name}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    project.state === 'OPEN'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-gray-500/20 text-gray-500'
                  }`}
                >
                  {project.state}
                </span>
              </div>
              {project.description && (
                <p className="text-sm text-default-muted line-clamp-1">
                  {project.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
      {data.totalCount > maxProjects && (
        <div className="mt-4 text-center text-sm text-default-muted">
          +{data.totalCount - maxProjects} more projects
        </div>
      )}
    </div>
  )
}

const TerminalProjects = ({ 
  data 
}: { 
  data: NonNullable<GithubData['projects']>
}) => {
  const maxProjects = 10
  const projectsToShow = data.nodes.slice(0, maxProjects)

  if (projectsToShow.length === 0) {
    return (
      <div className="text-terminal-muted text-center py-4">
        No projects found
      </div>
    )
  }

  const gridData = projectsToShow.map((project) => ({
    title: project.name,
    subtitle: project.description || undefined,
    value: `[${project.state}]`,
  }))

  return (
    <>
      <TerminalGrid data={gridData} rightText="Project" leftText="State" />
      {data.totalCount > maxProjects && (
        <div className="text-terminal-muted text-sm text-center mt-2">
          +{data.totalCount - maxProjects} more
        </div>
      )}
    </>
  )
}

interface ProjectsProps {
  data: GithubData['projects']
  config: GithubConfig
  style: 'default' | 'terminal'
  size: 'half' | 'full'
}

export function GithubProjects({ 
  data, 
  config, 
  style, 
  size 
}: ProjectsProps): React.ReactElement {
  if (!data || data.totalCount === 0) {
    return <></>
  }

  const title = (config.projects_title ?? '<qnt> Projects').replace(
    '<qnt>',
    abbreviateNumber(data.totalCount)
  )
  const hideTitle = config.projects_hide_title ?? false

  return (
    <section id="github-projects">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaProjectDiagram />} />}
            <DefaultProjects data={data} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: 'gh',
                plugin: 'github',
                section: 'projects',
                username: config.username,
                size,
              })}
            />
            <TerminalProjects data={data} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

