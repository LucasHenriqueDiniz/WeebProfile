/**
 * 16personalities plugin specific types
 */
import type { BasePluginConfig, NonEssentialPluginConfig } from '../../weeb-plugins/plugins/shared/types/base';
/**
 * 16Personalities personality types
 */
export type PersonalityType = 'ENFJ' | 'ENFP' | 'ENTJ' | 'ENTP' | 'ESFJ' | 'ESFP' | 'ESTJ' | 'ESTP' | 'INFJ' | 'INFP' | 'INTJ' | 'INTP' | 'ISFJ' | 'ISFP' | 'ISTJ' | 'ISTP';
/**
 * Non-essential plugin configuration
 */
export interface Personality16NonEssentialConfig extends NonEssentialPluginConfig {
    personality_url?: string;
    personality_hide_title?: boolean;
    personality_title?: string;
    personality_show_description?: boolean;
    personality_show_link?: boolean;
}
/**
 * Complete plugin configuration
 */
export interface Personality16Config extends BasePluginConfig {
    personality_url?: string;
    personality_hide_title?: boolean;
    personality_title?: string;
    personality_show_description?: boolean;
    personality_show_link?: boolean;
    nonEssential?: Personality16NonEssentialConfig;
    [key: string]: any;
}
/**
 * Data returned by the plugin
 */
export interface Personality16Data {
    type: PersonalityType;
    name: string;
    emoji: string;
    description: string;
    url: string;
    traits: {
        E: 'Extroverted' | 'Introverted';
        N: 'Intuitive' | 'Observant';
        F: 'Feeling' | 'Thinking';
        J: 'Judging' | 'Prospecting';
    };
}
