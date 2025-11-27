/**
 * Componente Projects do GitHub
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface ProjectsProps {
    data: GithubData['projects'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubProjects({ data, config, style, size }: ProjectsProps): React.ReactElement;
export {};
