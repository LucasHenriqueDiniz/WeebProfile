/**
 * Main rendering component for the 16personalities plugin
 */
import React from 'react';
import type { Personality16Config, Personality16Data } from '../types';
interface RenderPersonality16Props {
    config: Personality16Config;
    data: Personality16Data;
    style?: 'default' | 'terminal';
    size?: 'half' | 'full';
}
/**
 * Renderiza o plugin 16personalities
 */
export declare function RenderPersonality16({ config, data, style, size, }: RenderPersonality16Props): React.ReactElement;
export {};
