/**
 * Componente Introduction do GitHub
 *
 * Mostra informações de introdução do perfil (bio, location, company, etc)
 */
import React from 'react';
import type { GithubData, GithubConfig } from '../types';
interface IntroductionProps {
    data: GithubData['introduction'];
    config: GithubConfig;
    style: 'default' | 'terminal';
    size: 'half' | 'full';
    activity?: GithubData['activity'];
}
export declare function GithubIntroduction({ data, config, style, size, activity }: IntroductionProps): React.ReactElement;
export {};
