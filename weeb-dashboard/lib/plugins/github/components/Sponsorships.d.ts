/**
 * Componente Sponsorships do GitHub
 *
 * Mostra sponsorships do usuário (quem o usuário está patrocinando)
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface SponsorshipsProps {
    data: GithubData['sponsorships'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubSponsorships({ data, config, style, size }: SponsorshipsProps): React.ReactElement;
export {};
