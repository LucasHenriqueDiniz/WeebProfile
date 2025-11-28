/**
 * Componente Featured Repositories do GitHub
 *
 * Mostra repositórios em destaque (requer URLs dos repositórios)
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface FeaturedRepositoriesProps {
    data: GithubData['featuredRepositories'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubFeaturedRepositories({ data, config, style, size }: FeaturedRepositoriesProps): React.ReactElement;
export {};
