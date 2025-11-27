/**
 * Componente Activity do GitHub
 *
 * Versão simplificada migrada do source original
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface ActivityProps {
    data: GithubData['activity'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubActivity({ data, config, style, size }: ActivityProps): React.ReactElement;
export {};
