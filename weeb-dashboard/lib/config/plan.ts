/**
 * SVGs a user can have on the free plan. The API enforces it (POST /api/svgs) and the
 * dashboard shows it in four places; each used to declare its own copy of the number.
 *
 * It was 3 until 11/2026, which stopped a profile at three cards. 20 fits any README;
 * the cap stays because the cron regenerates every card every day.
 */
export const MAX_SVGS_FREE_TIER = 20
