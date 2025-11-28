/**
 * Componente StarredRepositories do GitHub
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface StarredRepositoriesProps {
    data: GithubData['starredRepositories'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubStarredRepositories({ data, config, style, size }: StarredRepositoriesProps): React.ReactElement;
export {};
