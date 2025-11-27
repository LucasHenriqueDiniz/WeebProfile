/**
 * Renderizador principal do Plugin GitHub
 *
 * Migrado do source original, adaptado para source-v2
 */
import React from 'react';
import type { GithubConfig, GithubData } from '../types';
interface RenderGithubProps {
    config: GithubConfig;
    data: GithubData;
    style?: 'default' | 'terminal';
    size?: 'half' | 'full';
}
export declare function RenderGithub({ config, data, style, size, }: RenderGithubProps): React.ReactElement;
export {};
