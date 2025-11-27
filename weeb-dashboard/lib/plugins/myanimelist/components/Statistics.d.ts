/**
 * Statistics - Componente para exibir estatísticas do MyAnimeList
 */
import React from 'react';
import type { MyAnimeListConfig, MyAnimeListData } from '../types';
interface StatisticsProps {
    data: MyAnimeListData['statistics'];
    config: MyAnimeListConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
    hideTerminalEmojis?: boolean;
}
export declare function Statistics({ data, config, style, size, hideTerminalEmojis }: StatisticsProps): React.ReactElement;
export {};
