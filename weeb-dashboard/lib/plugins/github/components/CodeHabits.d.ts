/**
 * Componente CodeHabits do GitHub
 *
 * Versão simplificada migrada do source original
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface CodeHabitsProps {
    data: GithubData['codeHabits'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubCodeHabits({ data, config, style, size }: CodeHabitsProps): React.ReactElement;
export {};
