/**
 * GenreTags - Tags de gênero para anime/manga
 * 
 * Versão simplificada - pode ser expandida com ícones específicos depois
 */

import React from 'react'

interface GenreTagProps {
  text: string
}

export function DefaultTag({ text }: GenreTagProps): React.ReactElement {
  // Versão simplificada - pode ser expandida com getTagIcon depois
  const displayText = text === 'Award Winning' ? 'Awarded' : text
  
  return (
    <span className="genre-tag text-xs px-2 py-0.5 rounded bg-default-15 text-default-muted border border-default-15">
      {displayText}
    </span>
  )
}

export function TerminalTag({ text }: GenreTagProps): React.ReactElement {
  // Versão simplificada - pode ser expandida com emojis depois
  const displayText = text === 'Award Winning' ? 'Awarded' : text
  
  return (
    <span className="genre-tag text-xs px-1 py-0.5 rounded bg-terminal-muted-light text-terminal-muted border border-terminal-muted truncate">
      {displayText}
    </span>
  )
}

