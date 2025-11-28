/**
 * Componente Calendar do GitHub
 *
 * Versão simplificada migrada do source original
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface CalendarProps {
    data: GithubData['calendar'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
}
export declare function GithubCalendar({ data, config, style, size }: CalendarProps): React.ReactElement;
export {};
