/**
 * Componente Notable Contributions do GitHub
 *
 * Mostra contribuições notáveis em repositórios
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface NotableContributionsProps {
    data: GithubData['notableContributions'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubNotableContributions({ data, config, style, size }: NotableContributionsProps): React.ReactElement;
export {};
