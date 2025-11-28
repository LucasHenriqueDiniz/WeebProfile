/**
 * 16personalities plugin data fetch service
 *
 * Since there's no public API, it only processes the type chosen by the user
 * or extracts it from the provided URL
 */
import type { Personality16Config, Personality16Data } from '../types';
/**
 * Fetches plugin data
 *
 * @param config - Plugin configuration
 * @param dev - Development mode (uses mock data)
 */
export declare function fetchPersonality16Data(config: Personality16Config, dev?: boolean): Promise<Personality16Data>;
