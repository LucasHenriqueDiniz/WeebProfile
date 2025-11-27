/**
 * Componente FavoriteLicense do GitHub
 *
 * Migrado do source original, adaptado para source-v2
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface FavoriteLicenseProps {
    data: GithubData['favoriteLicense'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function FavoriteLicense({ data, config, style, size, }: FavoriteLicenseProps): React.ReactElement;
export {};
