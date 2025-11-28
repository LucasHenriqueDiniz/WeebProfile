/**
 * Componente FavoriteLanguages do GitHub
 *
 * Versão simplificada migrada do source original
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface FavoriteLanguagesProps {
    languageData: GithubData['languages'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function FavoriteLanguages({ languageData, config, style, size }: FavoriteLanguagesProps): React.ReactElement;
export {};
