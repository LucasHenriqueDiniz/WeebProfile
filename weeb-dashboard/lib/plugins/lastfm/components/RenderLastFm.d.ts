/**
 * Renderizador principal do Plugin LastFM
 *
 * Migrado do source original, adaptado para source-v2
 */
import React from 'react';
import type { LastFmConfig, LastFmData } from '../types';
interface RenderLastFmProps {
    config: LastFmConfig;
    data: LastFmData;
    style?: 'default' | 'terminal';
    size?: 'half' | 'full';
}
export declare function RenderLastFm({ config, data, style, size, }: RenderLastFmProps): React.ReactElement;
export {};
