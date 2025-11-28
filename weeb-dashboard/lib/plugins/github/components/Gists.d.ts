/**
 * Componente Gists do GitHub
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface GistsProps {
    data: GithubData['gists'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubGists({ data, config, style, size }: GistsProps): React.ReactElement;
export {};
