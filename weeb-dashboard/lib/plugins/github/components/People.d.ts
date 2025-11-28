/**
 * Componente People do GitHub
 *
 * Mostra pessoas relacionadas (followers ou contributors/stargazers/watchers de um repositório)
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface PeopleProps {
    data: GithubData['people'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubPeople({ data, config, style, size }: PeopleProps): React.ReactElement;
export {};
