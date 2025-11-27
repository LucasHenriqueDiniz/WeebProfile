/**
 * Serviço para buscar perfil completo do MyAnimeList
 */
export interface JikanUserFullResponse {
    data: {
        mal_id: number;
        username: string;
        url: string;
        images: {
            jpg: {
                image_url: string;
            };
            webp: {
                image_url: string;
            };
        };
        last_online: string;
        gender: string | null;
        birthday: string | null;
        location: string | null;
        joined: string;
        statistics: {
            anime: {
                days_watched: number;
                mean_score: number;
                watching: number;
                completed: number;
                on_hold: number;
                dropped: number;
                plan_to_watch: number;
                total_entries: number;
                rewatched: number;
                episodes_watched: number;
            };
            manga: {
                days_read: number;
                mean_score: number;
                reading: number;
                completed: number;
                on_hold: number;
                dropped: number;
                plan_to_read: number;
                total_entries: number;
                reread: number;
                chapters_read: number;
                volumes_read: number;
            };
        };
        favorites: {
            anime: Array<{
                mal_id: number;
                title: string;
                type: string;
                start_year: number | null;
                images: {
                    jpg: {
                        image_url: string;
                        large_image_url: string;
                        small_image_url: string;
                    };
                    webp: {
                        image_url: string;
                        large_image_url: string;
                        small_image_url: string;
                    };
                };
            }>;
            manga: Array<{
                mal_id: number;
                title: string;
                type: string;
                start_year: number | null;
                images: {
                    jpg: {
                        image_url: string;
                        large_image_url: string;
                        small_image_url: string;
                    };
                    webp: {
                        image_url: string;
                        large_image_url: string;
                        small_image_url: string;
                    };
                };
            }>;
            characters: Array<{
                mal_id: number;
                name: string;
                images: {
                    jpg: {
                        image_url: string;
                    };
                    webp: {
                        image_url: string;
                    };
                };
            }>;
            people: Array<{
                mal_id: number;
                name: string;
                images: {
                    jpg: {
                        image_url: string;
                    };
                    webp: {
                        image_url: string;
                    };
                };
            }>;
        };
        updates: {
            anime: Array<{
                entry: {
                    mal_id: number;
                    title: string;
                    images: {
                        jpg: {
                            image_url: string;
                            large_image_url: string;
                            small_image_url: string;
                        };
                        webp: {
                            image_url: string;
                        };
                    };
                };
                score: number;
                status: string;
                episodes_seen: number | null;
                episodes_total: number | null;
                date: string;
            }>;
            manga: Array<{
                entry: {
                    mal_id: number;
                    title: string;
                    images: {
                        jpg: {
                            image_url: string;
                            large_image_url: string;
                            small_image_url: string;
                        };
                        webp: {
                            image_url: string;
                        };
                    };
                };
                score: number;
                status: string;
                chapters_read: number | null;
                chapters_total: number | null;
                date: string;
            }>;
        };
    };
}
export interface MalProfileResponse {
    mal_id: number;
    username: string;
    url: string;
    images: {
        jpg: {
            image_url: string;
        };
        webp: {
            image_url: string;
        };
    };
    last_online: string;
    gender: string | null;
    birthday: string | null;
    location: string | null;
    joined: string;
    statistics: JikanUserFullResponse['data']['statistics'];
    favorites: JikanUserFullResponse['data']['favorites'];
    updates: JikanUserFullResponse['data']['updates'];
}
/**
 * Busca o perfil completo de um usuário do MyAnimeList
 */
export declare function fetchFullProfile(username: string): Promise<MalProfileResponse>;
