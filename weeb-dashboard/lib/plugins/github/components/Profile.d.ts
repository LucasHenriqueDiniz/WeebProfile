/**
 * Componente Profile do GitHub
 *
 * Migrado do source original, adaptado para source-v2
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface ProfileProps {
    data: GithubData['user'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubProfile({ data, config, style, size }: ProfileProps): React.ReactElement;
export {};
