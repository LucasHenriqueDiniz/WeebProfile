/**
 * Componente TopRepositories do GitHub
 * Mostra os repositórios com mais stars
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface TopRepositoriesProps {
    data: GithubData['topRepositories'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubTopRepositories({ data, config, style, size }: TopRepositoriesProps): React.ReactElement;
export {};
