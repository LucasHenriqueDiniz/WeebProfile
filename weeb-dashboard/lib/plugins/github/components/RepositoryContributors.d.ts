/**
 * Componente Repository Contributors do GitHub
 *
 * Mostra contribuidores de um repositório específico
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface RepositoryContributorsProps {
    data: GithubData['repositoryContributors'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubRepositoryContributors({ data, config, style, size }: RepositoryContributorsProps): React.ReactElement;
export {};
