/**
 * SimpleStatistics - Componente para exibir estatísticas simplificadas do MyAnimeList
 *
 * Migrado do source original, adaptado para source-v2
 */
import React from 'react';
import type { MyAnimeListConfig, MyAnimeListData } from '../types';
interface SimpleStatisticsProps {
    data: MyAnimeListData['statistics'];
    config: MyAnimeListConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
    hideTerminalEmojis?: boolean;
}
export declare function SimpleStatistics({ data, config, style, size, hideTerminalEmojis, }: SimpleStatisticsProps): React.ReactElement;
export {};
