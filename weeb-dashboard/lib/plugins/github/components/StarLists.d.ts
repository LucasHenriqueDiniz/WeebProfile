/**
 * Componente Star Lists do GitHub
 *
 * Mostra listas de repositórios favoritados organizados
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface StarListsProps {
    data: GithubData['starLists'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubStarLists({ data, config, style, size }: StarListsProps): React.ReactElement;
export {};
