/**
 * Personality type data and mappings for 16Personalities
 */
import type { PersonalityType, Personality16Data } from '../types';
/**
 * Mapping of personality types to complete data
 */
export declare const PERSONALITY_DATA: Record<PersonalityType, Omit<Personality16Data, 'type'>>;
/**
 * Gets personality data by type
 */
export declare function getPersonalityData(type: PersonalityType): Personality16Data;
