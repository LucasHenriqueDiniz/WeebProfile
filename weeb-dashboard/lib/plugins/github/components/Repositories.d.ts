/**
 * Componente Repositories do GitHub
 *
 * Versão simplificada migrada do source original
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface RepositoriesProps {
    data: GithubData['repositories'];
    totalDiskUsage: number;
    sponsoringCount: number;
    favoriteLicense: GithubData['favoriteLicense'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubRepositories({ data, totalDiskUsage, sponsoringCount, favoriteLicense, config, style, size }: RepositoriesProps): React.ReactElement;
export {};
