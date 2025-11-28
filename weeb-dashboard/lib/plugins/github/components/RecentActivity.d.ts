/**
 * Componente Recent Activity do GitHub
 *
 * Mostra atividades recentes do usuário
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface RecentActivityProps {
    data: GithubData['recentActivity'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubRecentActivity({ data, config, style, size }: RecentActivityProps): React.ReactElement;
export {};
