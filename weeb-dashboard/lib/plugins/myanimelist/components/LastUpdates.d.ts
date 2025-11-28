/**
 * LastUpdates - Componente para exibir últimas atualizações do MyAnimeList
 *
 * Migrado do source original, adaptado para source-v2
 */
import React from 'react';
import type { MyAnimeListConfig, MyAnimeListData } from '../types';
interface LastUpdatesProps {
    data: MyAnimeListData['last_updated'];
    config: MyAnimeListConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
    hideTerminalEmojis?: boolean;
}
export declare function LastUpdates({ data, config, style, size, hideTerminalEmojis, }: LastUpdatesProps): React.ReactElement;
export {};
