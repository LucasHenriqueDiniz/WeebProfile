/**
 * Componente Stargazers do GitHub
 * Mostra o total de stars recebidos nos repositórios
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface StargazersProps {
    data: GithubData['stargazers'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubStargazers({ data, config, style, size }: StargazersProps): React.ReactElement;
export {};
