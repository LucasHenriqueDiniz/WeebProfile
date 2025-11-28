/**
 * StatisticsHorizontalBar - Componente para exibir barra horizontal de estatísticas do MyAnimeList
 *
 * Migrado do source original, adaptado para source-v2
 */
import React from 'react';
import type { MyAnimeListConfig, AnimeStatistics, MangaStatistics } from '../types';
interface StatisticsHorizontalBarProps {
    data: AnimeStatistics | MangaStatistics;
    config: MyAnimeListConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
    isAnime: boolean;
}
export declare function StatisticsHorizontalBar({ data, config, style, size, isAnime, }: StatisticsHorizontalBarProps): React.ReactElement;
export {};
