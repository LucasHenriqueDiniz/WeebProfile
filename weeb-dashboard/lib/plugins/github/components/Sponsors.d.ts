/**
 * Componente Sponsors do GitHub
 *
 * Mostra sponsors do usuário (quem está patrocinando o usuário)
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface SponsorsProps {
    data: GithubData['sponsors'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubSponsors({ data, config, style, size }: SponsorsProps): React.ReactElement;
export {};
