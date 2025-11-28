/**
 * Renderizador principal do Plugin MyAnimeList
 *
 * Migrado do source original, adaptado para source-v2
 */
import React from 'react';
import type { MyAnimeListConfig, MyAnimeListData } from '../types';
interface RenderMyAnimeListProps {
    config: MyAnimeListConfig;
    data: MyAnimeListData;
    style?: 'default' | 'terminal';
    size?: 'half' | 'full';
    hideTerminalEmojis?: boolean;
}
export declare function RenderMyAnimeList({ config, data, style, size, hideTerminalEmojis, }: RenderMyAnimeListProps): React.ReactElement;
export {};
