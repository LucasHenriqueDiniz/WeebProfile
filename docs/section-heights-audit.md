# Section heights audit (18/11/2026)

Every section's `calculateHeight()` against the height the browsers draw, before and after
the fixes of this audit.

## How it was measured

`pnpm --filter @weeb/svg-generator audit:heights -- --variants --engine=all`: each section
alone and all the sections of a plugin in one card (`(all)`), in both styles and both sizes,
with the mock data, once with the defaults and once for each option that changes the height
(each boolean flipped, each other select value, each number option at its min and max). A
module given to `--data-variants` changes the mock (more items, missing images, each
16personalities type). The section is rendered the way the generator renders it
(renderPlugins, theme CSS) without the terminal header, which `generateSvg` adds once per SVG.
The process runs in UTC.

- **Before:** Chrome 158 only, from `main` at a6cd8bd3, without the data variants:
  1436 cases, 164 cut (calc under what is drawn) and 281 with more than 2px of blank space.
- **After:** Chrome 158, Firefox 150 and WebKit 26.4 (Playwright 1.60), with the data
  variants, after merging `main` at the time (GitHub recent activity and notable
  contributions, Duolingo flags, Lyfta, Dev.to top tags): 1880 cases.
  - 1776 of the 1778 outside the GitHub repository terminal are exact (0 to +2 over the tallest
    engine). The other 2 are the repository overview at content size `sm`, which Firefox
    draws 1px taller: the card's 24px pad covers it.
  - The GitHub repository terminal sections hand in 24px less than they draw by design (the
    PluginManager adds 24px to every card; `github_repo/section-heights.test.ts`). 32 of those
    102 cases are 25px short in Firefox, 1px of the terminal body's 8px bottom padding.

`diff` is calc minus the tallest engine: negative cuts the card, positive is blank space
under it. Each row is the worst case of that section, style and size over every variant;
✗ marks one outside 0 to +2.

| plugin          | section                 | style    | size | before: worst case                    | calc | drawn (Chrome) | diff   | after: worst case                   | calc | drawn (C/F/W)  | diff  |
| --------------- | ----------------------- | -------- | ---- | ------------------------------------- | ---- | -------------- | ------ | ----------------------------------- | ---- | -------------- | ----- |
| 16personalities | personality             | default  | full | personality_hide_title=true           | 180  | 130            | +50 ✗  | defaults                            | 170  | 170/170/170    | 0     |
| 16personalities | personality             | default  | half | personality_show_description=false    | 203  | 131            | +72 ✗  | defaults                            | 193  | 193/192/193    | 0     |
| 16personalities | personality             | terminal | full | personality_show_description=false    | 164  | 104            | +60 ✗  | defaults                            | 154  | 154/154/154    | 0     |
| 16personalities | personality             | terminal | half | personality_show_description=false    | 184  | 104            | +80 ✗  | defaults                            | 174  | 174/174/174    | 0     |
| about           | links                   | default  | full | defaults                              | 52   | 52             | 0      | defaults                            | 52   | 52/52/52       | 0     |
| about           | links                   | default  | half | defaults                              | 96   | 96             | 0      | defaults                            | 96   | 96/96/96       | 0     |
| about           | links                   | terminal | full | defaults                              | 76   | 76             | 0      | defaults                            | 76   | 76/76/76       | 0     |
| about           | links                   | terminal | half | defaults                              | 120  | 120            | 0      | defaults                            | 120  | 120/120/120    | 0     |
| about           | neofetch                | default  | full | defaults                              | 241  | 241            | 0      | defaults                            | 241  | 241/241/241    | 0     |
| about           | neofetch                | default  | half | defaults                              | 219  | 219            | 0      | defaults                            | 219  | 219/219/219    | 0     |
| about           | neofetch                | terminal | full | defaults                              | 276  | 276            | 0      | defaults                            | 276  | 276/276/276    | 0     |
| about           | neofetch                | terminal | half | defaults                              | 274  | 274            | 0      | defaults                            | 274  | 274/274/274    | 0     |
| about           | (all)                   | default  | full | defaults                              | 293  | 293            | 0      | defaults                            | 293  | 293/293/293    | 0     |
| about           | (all)                   | default  | half | defaults                              | 315  | 315            | 0      | defaults                            | 315  | 315/315/315    | 0     |
| about           | (all)                   | terminal | full | defaults                              | 352  | 352            | 0      | defaults                            | 352  | 352/352/352    | 0     |
| about           | (all)                   | terminal | half | defaults                              | 394  | 394            | 0      | defaults                            | 394  | 394/394/394    | 0     |
| anilist         | currently_watching      | default  | full | currently_watching_hide_title=true    | 229  | 124            | +105 ✗ | defaults                            | 236  | 236/236/236    | 0     |
| anilist         | currently_watching      | default  | half | currently_watching_hide_title=true    | 229  | 124            | +105 ✗ | defaults                            | 234  | 234/234/234    | 0     |
| anilist         | currently_watching      | terminal | full | defaults                              | 84   | 84             | 0      | defaults                            | 84   | 84/84/84       | 0     |
| anilist         | currently_watching      | terminal | half | defaults                              | 84   | 84             | 0      | defaults                            | 84   | 84/84/84       | 0     |
| anilist         | favorites_anime         | default  | full | defaults                              | 165  | 172            | -7 ✗   | defaults                            | 172  | 172/172/172    | 0     |
| anilist         | favorites_anime         | default  | half | defaults                              | 165  | 298            | -133 ✗ | defaults                            | 170  | 170/170/170    | 0     |
| anilist         | favorites_anime         | terminal | full | defaults                              | 124  | 104            | +20 ✗  | defaults                            | 104  | 104/104/104    | 0     |
| anilist         | favorites_anime         | terminal | half | defaults                              | 124  | 104            | +20 ✗  | defaults                            | 104  | 104/104/104    | 0     |
| anilist         | statistics              | default  | full | defaults                              | 133  | 144            | -11 ✗  | defaults                            | 144  | 144/144/144    | 0     |
| anilist         | statistics              | default  | half | defaults                              | 221  | 250            | -29 ✗  | defaults                            | 250  | 250/250/250    | 0     |
| anilist         | statistics              | terminal | full | defaults                              | 184  | 184            | 0      | defaults                            | 184  | 184/184/184    | 0     |
| anilist         | statistics              | terminal | half | defaults                              | 184  | 184            | 0      | defaults                            | 184  | 184/184/184    | 0     |
| anilist         | (all)                   | default  | full | defaults                              | 527  | 492            | +35 ✗  | defaults                            | 552  | 552/551/552    | 0     |
| anilist         | (all)                   | default  | half | defaults                              | 615  | 722            | -107 ✗ | defaults                            | 654  | 654/653/654    | 0     |
| anilist         | (all)                   | terminal | full | defaults                              | 392  | 372            | +20 ✗  | defaults                            | 372  | 372/372/372    | 0     |
| anilist         | (all)                   | terminal | half | defaults                              | 392  | 372            | +20 ✗  | defaults                            | 372  | 372/372/372    | 0     |
| codeforces      | contests_participated   | default  | full | contests_participated_hide_title=true | 80   | 28             | +52 ✗  | defaults                            | 80   | 80/80/80       | 0     |
| codeforces      | contests_participated   | default  | half | contests_participated_hide_title=true | 80   | 28             | +52 ✗  | defaults                            | 78   | 78/78/78       | 0     |
| codeforces      | contests_participated   | terminal | full | defaults                              | 44   | 44             | 0      | defaults                            | 44   | 44/44/44       | 0     |
| codeforces      | contests_participated   | terminal | half | defaults                              | 44   | 44             | 0      | defaults                            | 44   | 44/44/44       | 0     |
| codeforces      | problems_solved         | default  | full | problems_solved_hide_title=true       | 104  | 52             | +52 ✗  | defaults                            | 104  | 104/104/104    | 0     |
| codeforces      | problems_solved         | default  | half | problems_solved_hide_title=true       | 132  | 80             | +52 ✗  | defaults                            | 130  | 130/130/130    | 0     |
| codeforces      | problems_solved         | terminal | full | defaults                              | 224  | 224            | 0      | defaults                            | 224  | 224/224/224    | 0     |
| codeforces      | problems_solved         | terminal | half | defaults                              | 224  | 224            | 0      | defaults                            | 224  | 224/224/224    | 0     |
| codeforces      | rating_rank             | default  | full | rating_rank_hide_title=true           | 76   | 24             | +52 ✗  | defaults                            | 76   | 76/76/76       | 0     |
| codeforces      | rating_rank             | default  | half | rating_rank_hide_title=true           | 76   | 24             | +52 ✗  | defaults                            | 74   | 74/74/74       | 0     |
| codeforces      | rating_rank             | terminal | full | defaults                              | 64   | 64             | 0      | defaults                            | 64   | 64/64/64       | 0     |
| codeforces      | rating_rank             | terminal | half | defaults                              | 64   | 64             | 0      | defaults                            | 64   | 64/64/64       | 0     |
| codeforces      | recent_submissions      | default  | full | recent_submissions_hide_title=true    | 211  | 158            | +53 ✗  | defaults                            | 210  | 210/210/210    | 0     |
| codeforces      | recent_submissions      | default  | half | recent_submissions_hide_title=true    | 211  | 158            | +53 ✗  | defaults                            | 208  | 208/208/208    | 0     |
| codeforces      | recent_submissions      | terminal | full | defaults                              | 72   | 72             | 0      | defaults                            | 72   | 72/72/72       | 0     |
| codeforces      | recent_submissions      | terminal | half | defaults                              | 72   | 72             | 0      | defaults                            | 72   | 72/72/72       | 0     |
| codeforces      | (all)                   | default  | full | defaults                              | 471  | 470            | +1     | defaults                            | 470  | 470/469/470    | 0     |
| codeforces      | (all)                   | default  | half | defaults                              | 499  | 490            | +9 ✗   | defaults                            | 490  | 490/489/490    | 0     |
| codeforces      | (all)                   | terminal | full | defaults                              | 404  | 404            | 0      | defaults                            | 404  | 404/404/404    | 0     |
| codeforces      | (all)                   | terminal | half | defaults                              | 404  | 404            | 0      | defaults                            | 404  | 404/404/404    | 0     |
| codewars        | completed_kata          | default  | full | completed_kata_hide_title=true        | 319  | 266            | +53 ✗  | defaults                            | 318  | 318/318/318    | 0     |
| codewars        | completed_kata          | default  | half | completed_kata_hide_title=true        | 319  | 266            | +53 ✗  | defaults                            | 316  | 316/316/316    | 0     |
| codewars        | completed_kata          | terminal | full | defaults                              | 104  | 104            | 0      | defaults                            | 104  | 104/104/104    | 0     |
| codewars        | completed_kata          | terminal | half | defaults                              | 104  | 104            | 0      | defaults                            | 104  | 104/104/104    | 0     |
| codewars        | languages_proficiency   | default  | full | languages_proficiency_hide_title=true | 319  | 266            | +53 ✗  | defaults                            | 318  | 318/318/318    | 0     |
| codewars        | languages_proficiency   | default  | half | languages_proficiency_hide_title=true | 319  | 266            | +53 ✗  | defaults                            | 316  | 316/316/316    | 0     |
| codewars        | languages_proficiency   | terminal | full | defaults                              | 104  | 104            | 0      | defaults                            | 104  | 104/104/104    | 0     |
| codewars        | languages_proficiency   | terminal | half | defaults                              | 104  | 104            | 0      | defaults                            | 104  | 104/104/104    | 0     |
| codewars        | leaderboard_position    | default  | full | defaults                              | 76   | 100            | -24 ✗  | defaults                            | 100  | 100/100/100    | 0     |
| codewars        | leaderboard_position    | default  | half | defaults                              | 76   | 98             | -22 ✗  | defaults                            | 98   | 98/98/98       | 0     |
| codewars        | leaderboard_position    | terminal | full | defaults                              | 54   | 44             | +10 ✗  | defaults                            | 44   | 44/44/44       | 0     |
| codewars        | leaderboard_position    | terminal | half | defaults                              | 54   | 44             | +10 ✗  | defaults                            | 44   | 44/44/44       | 0     |
| codewars        | rank_honor              | default  | full | rank_honor_hide_title=true            | 76   | 24             | +52 ✗  | defaults                            | 76   | 76/76/76       | 0     |
| codewars        | rank_honor              | default  | half | rank_honor_hide_title=true            | 76   | 24             | +52 ✗  | defaults                            | 74   | 74/74/74       | 0     |
| codewars        | rank_honor              | terminal | full | defaults                              | 64   | 64             | 0      | defaults                            | 64   | 64/64/64       | 0     |
| codewars        | rank_honor              | terminal | half | defaults                              | 64   | 64             | 0      | defaults                            | 64   | 64/64/64       | 0     |
| codewars        | (all)                   | default  | full | defaults                              | 790  | 812            | -22 ✗  | defaults                            | 812  | 812/811/812    | 0     |
| codewars        | (all)                   | default  | half | defaults                              | 790  | 804            | -14 ✗  | defaults                            | 804  | 804/803/804    | 0     |
| codewars        | (all)                   | terminal | full | defaults                              | 326  | 316            | +10 ✗  | defaults                            | 316  | 316/316/316    | 0     |
| codewars        | (all)                   | terminal | half | defaults                              | 326  | 316            | +10 ✗  | defaults                            | 316  | 316/316/316    | 0     |
| devto           | profile                 | default  | full | defaults                              | 93   | 108            | -15 ✗  | defaults                            | 108  | 108/108/108    | 0     |
| devto           | profile                 | default  | half | defaults                              | 93   | 106            | -13 ✗  | defaults                            | 106  | 106/106/106    | 0     |
| devto           | profile                 | terminal | full | defaults                              | 104  | 104            | 0      | defaults                            | 104  | 104/104/104    | 0     |
| devto           | profile                 | terminal | half | defaults                              | 104  | 104            | 0      | defaults                            | 104  | 104/104/104    | 0     |
| devto           | recent_articles         | default  | full | recent_articles_hide_title=true       | 193  | 124            | +69 ✗  | defaults                            | 176  | 176/176/176    | 0     |
| devto           | recent_articles         | default  | half | recent_articles_hide_title=true       | 193  | 124            | +69 ✗  | defaults                            | 174  | 174/174/174    | 0     |
| devto           | recent_articles         | terminal | full | defaults                              | 84   | 84             | 0      | defaults                            | 84   | 84/84/84       | 0     |
| devto           | recent_articles         | terminal | half | defaults                              | 84   | 84             | 0      | defaults                            | 84   | 84/84/84       | 0     |
| devto           | top_tags                | default  | full | defaults                              | 69   | 76             | -7 ✗   | defaults                            | 76   | 76/76/76       | 0     |
| devto           | top_tags                | default  | half | defaults                              | 99   | 104            | -5 ✗   | defaults                            | 104  | 104/104/104    | 0     |
| devto           | top_tags                | terminal | full | defaults                              | 124  | 124            | 0      | defaults                            | 124  | 124/124/124    | 0     |
| devto           | top_tags                | terminal | half | defaults                              | 124  | 124            | 0      | defaults                            | 124  | 124/124/124    | 0     |
| devto           | (all)                   | default  | full | defaults                              | 355  | 360            | -5 ✗   | defaults                            | 360  | 360/359/360    | 0     |
| devto           | (all)                   | default  | half | defaults                              | 385  | 384            | +1     | defaults                            | 384  | 384/383/384    | 0     |
| devto           | (all)                   | terminal | full | defaults                              | 312  | 312            | 0      | defaults                            | 312  | 312/312/312    | 0     |
| devto           | (all)                   | terminal | half | defaults                              | 312  | 312            | 0      | defaults                            | 312  | 312/312/312    | 0     |
| duolingo        | current_streak          | default  | full | current_streak_hide_title=false       | 157  | 164            | -7 ✗   | defaults                            | 112  | 112/112/112    | 0     |
| duolingo        | current_streak          | default  | half | current_streak_hide_title=false       | 157  | 162            | -5 ✗   | defaults                            | 112  | 112/112/112    | 0     |
| duolingo        | current_streak          | terminal | full | defaults                              | 44   | 44             | 0      | defaults                            | 44   | 44/44/44       | 0     |
| duolingo        | current_streak          | terminal | half | defaults                              | 44   | 44             | 0      | defaults                            | 44   | 44/44/44       | 0     |
| duolingo        | languages_learning      | default  | full | languages_learning_hide_title=true    | 211  | 158            | +53 ✗  | defaults                            | 210  | 210/210/210    | 0     |
| duolingo        | languages_learning      | default  | half | languages_learning_hide_title=true    | 211  | 158            | +53 ✗  | defaults                            | 208  | 208/208/208    | 0     |
| duolingo        | languages_learning      | terminal | full | defaults                              | 72   | 72             | 0      | defaults                            | 72   | 72/72/72       | 0     |
| duolingo        | languages_learning      | terminal | half | defaults                              | 72   | 72             | 0      | defaults                            | 72   | 72/72/72       | 0     |
| duolingo        | total_xp                | default  | full | total_xp_hide_title=true              | 140  | 88             | +52 ✗  | defaults                            | 140  | 140/140/140    | 0     |
| duolingo        | total_xp                | default  | half | total_xp_hide_title=true              | 140  | 88             | +52 ✗  | defaults                            | 138  | 138/138/138    | 0     |
| duolingo        | total_xp                | terminal | full | defaults                              | 44   | 44             | 0      | defaults                            | 44   | 44/44/44       | 0     |
| duolingo        | total_xp                | terminal | half | defaults                              | 44   | 44             | 0      | defaults                            | 44   | 44/44/44       | 0     |
| duolingo        | (all)                   | default  | full | defaults                              | 463  | 462            | +1     | defaults                            | 462  | 462/462/462    | 0     |
| duolingo        | (all)                   | default  | half | defaults                              | 463  | 458            | +5 ✗   | defaults                            | 458  | 458/458/458    | 0     |
| duolingo        | (all)                   | terminal | full | defaults                              | 160  | 160            | 0      | defaults                            | 160  | 160/160/160    | 0     |
| duolingo        | (all)                   | terminal | half | defaults                              | 160  | 160            | 0      | defaults                            | 160  | 160/160/160    | 0     |
| github          | activity                | default  | full | defaults                              | 156  | 156            | 0      | defaults                            | 156  | 156/156/156    | 0     |
| github          | activity                | default  | half | defaults                              | 156  | 156            | 0      | defaults                            | 156  | 156/156/156    | 0     |
| github          | activity                | terminal | full | defaults                              | 232  | 232            | 0      | defaults                            | 232  | 232/232/232    | 0     |
| github          | activity                | terminal | half | defaults                              | 232  | 232            | 0      | defaults                            | 232  | 232/232/232    | 0     |
| github          | calendar                | default  | full | defaults                              | 190  | 190            | 0      | defaults                            | 190  | 190/189/190    | 0     |
| github          | calendar                | default  | half | defaults                              | 323  | 323            | 0      | defaults                            | 323  | 323/323/323    | 0     |
| github          | calendar                | terminal | full | defaults                              | 157  | 157            | 0      | defaults                            | 157  | 157/157/157    | 0     |
| github          | calendar                | terminal | half | defaults                              | 157  | 157            | 0      | defaults                            | 157  | 157/157/157    | 0     |
| github          | code_habits             | default  | full | defaults                              | 552  | 552            | 0      | defaults                            | 552  | 552/552/552    | 0     |
| github          | code_habits             | default  | half | defaults                              | 604  | 604            | 0      | defaults                            | 604  | 604/604/604    | 0     |
| github          | code_habits             | terminal | full | defaults                              | 1112 | 1112           | 0      | defaults                            | 1112 | 1112/1112/1112 | 0     |
| github          | code_habits             | terminal | half | defaults                              | 1112 | 1112           | 0      | defaults                            | 1112 | 1112/1112/1112 | 0     |
| github          | favorite_languages      | default  | full | defaults                              | 330  | 330            | 0      | defaults                            | 330  | 330/330/330    | 0     |
| github          | favorite_languages      | default  | half | favorite_languages_max_languages=20   | 610  | 634            | -24 ✗  | defaults                            | 330  | 330/330/330    | 0     |
| github          | favorite_languages      | terminal | full | defaults                              | 292  | 292            | 0      | defaults                            | 292  | 292/292/292    | 0     |
| github          | favorite_languages      | terminal | half | defaults                              | 292  | 292            | 0      | defaults                            | 292  | 292/292/292    | 0     |
| github          | favorite_license        | default  | full | defaults                              | 88   | 88             | 0      | defaults                            | 88   | 88/88/88       | 0     |
| github          | favorite_license        | default  | half | defaults                              | 88   | 88             | 0      | defaults                            | 88   | 88/88/88       | 0     |
| github          | favorite_license        | terminal | full | defaults                              | 111  | 111            | 0      | defaults                            | 111  | 111/111/110    | 0     |
| github          | favorite_license        | terminal | half | defaults                              | 111  | 111            | 0      | defaults                            | 111  | 111/111/110    | 0     |
| github          | featured_repositories   | default  | full | defaults                              | 432  | 432            | 0      | defaults                            | 432  | 432/432/432    | 0     |
| github          | featured_repositories   | default  | half | defaults                              | 432  | 432            | 0      | defaults                            | 432  | 432/432/432    | 0     |
| github          | featured_repositories   | terminal | full | defaults                              | 112  | 112            | 0      | defaults                            | 112  | 112/112/112    | 0     |
| github          | featured_repositories   | terminal | half | defaults                              | 112  | 112            | 0      | defaults                            | 112  | 112/112/112    | 0     |
| github          | gists                   | default  | full | defaults                              | 432  | 432            | 0      | defaults                            | 432  | 432/432/432    | 0     |
| github          | gists                   | default  | half | defaults                              | 432  | 432            | 0      | defaults                            | 432  | 432/432/432    | 0     |
| github          | gists                   | terminal | full | defaults                              | 112  | 112            | 0      | defaults                            | 112  | 112/112/112    | 0     |
| github          | gists                   | terminal | half | defaults                              | 112  | 112            | 0      | defaults                            | 112  | 112/112/112    | 0     |
| github          | introduction            | default  | full | defaults                              | 92   | 92             | 0      | defaults                            | 92   | 92/92/92       | 0     |
| github          | introduction            | default  | half | defaults                              | 128  | 128            | 0      | defaults                            | 128  | 128/128/128    | 0     |
| github          | introduction            | terminal | full | defaults                              | 176  | 176            | 0      | defaults                            | 176  | 176/176/176    | 0     |
| github          | introduction            | terminal | half | defaults                              | 176  | 176            | 0      | defaults                            | 176  | 176/176/176    | 0     |
| github          | notable_contributions   | default  | full | defaults                              | 1148 | 1148           | 0      | defaults                            | 440  | 440/440/440    | 0     |
| github          | notable_contributions   | default  | half | defaults                              | 1148 | 1148           | 0      | defaults                            | 440  | 440/440/440    | 0     |
| github          | notable_contributions   | terminal | full | defaults                              | 252  | 252            | 0      | defaults                            | 252  | 252/252/252    | 0     |
| github          | notable_contributions   | terminal | half | defaults                              | 252  | 252            | 0      | defaults                            | 252  | 252/252/252    | 0     |
| github          | people                  | default  | full | defaults                              | 80   | 80             | 0      | defaults                            | 80   | 80/80/80       | 0     |
| github          | people                  | default  | half | defaults                              | 128  | 128            | 0      | defaults                            | 128  | 128/128/128    | 0     |
| github          | people                  | terminal | full | defaults                              | 252  | 252            | 0      | defaults                            | 252  | 252/252/252    | 0     |
| github          | people                  | terminal | half | defaults                              | 252  | 252            | 0      | defaults                            | 252  | 252/252/252    | 0     |
| github          | profile                 | default  | full | defaults                              | 127  | 127            | 0      | defaults                            | 127  | 127/127/127    | 0     |
| github          | profile                 | default  | half | defaults                              | 119  | 119            | 0      | defaults                            | 119  | 119/119/119    | 0     |
| github          | profile                 | terminal | full | defaults                              | 132  | 132            | 0      | defaults                            | 132  | 132/132/132    | 0     |
| github          | profile                 | terminal | half | defaults                              | 132  | 132            | 0      | defaults                            | 132  | 132/132/132    | 0     |
| github          | recent_activity         | default  | full | defaults                              | 1412 | 1412           | 0      | defaults                            | 1057 | 1057/1057/1057 | 0     |
| github          | recent_activity         | default  | half | defaults                              | 1412 | 1412           | 0      | defaults                            | 1057 | 1057/1057/1057 | 0     |
| github          | recent_activity         | terminal | full | defaults                              | 268  | 268            | 0      | defaults                            | 232  | 232/232/232    | 0     |
| github          | recent_activity         | terminal | half | defaults                              | 268  | 268            | 0      | defaults                            | 232  | 232/232/232    | 0     |
| github          | repositories            | default  | full | defaults                              | 132  | 132            | 0      | defaults                            | 132  | 132/132/132    | 0     |
| github          | repositories            | default  | half | defaults                              | 132  | 132            | 0      | defaults                            | 132  | 132/132/132    | 0     |
| github          | repositories            | terminal | full | defaults                              | 212  | 212            | 0      | defaults                            | 212  | 212/212/212    | 0     |
| github          | repositories            | terminal | half | defaults                              | 212  | 212            | 0      | defaults                            | 212  | 212/212/212    | 0     |
| github          | repository_contributors | default  | full | defaults                              | 284  | 284            | 0      | defaults                            | 284  | 284/284/284    | 0     |
| github          | repository_contributors | default  | half | defaults                              | 348  | 348            | 0      | defaults                            | 348  | 348/348/348    | 0     |
| github          | repository_contributors | terminal | full | defaults                              | 252  | 252            | 0      | defaults                            | 252  | 252/252/252    | 0     |
| github          | repository_contributors | terminal | half | defaults                              | 252  | 252            | 0      | defaults                            | 252  | 252/252/252    | 0     |
| github          | sponsors                | default  | full | defaults                              | 248  | 248            | 0      | defaults                            | 248  | 248/248/248    | 0     |
| github          | sponsors                | default  | half | defaults                              | 248  | 248            | 0      | defaults                            | 248  | 248/248/248    | 0     |
| github          | sponsors                | terminal | full | defaults                              | 112  | 112            | 0      | defaults                            | 112  | 112/112/112    | 0     |
| github          | sponsors                | terminal | half | defaults                              | 112  | 112            | 0      | defaults                            | 112  | 112/112/112    | 0     |
| github          | sponsorships            | default  | full | defaults                              | 248  | 248            | 0      | defaults                            | 248  | 248/248/248    | 0     |
| github          | sponsorships            | default  | half | defaults                              | 248  | 248            | 0      | defaults                            | 248  | 248/248/248    | 0     |
| github          | sponsorships            | terminal | full | defaults                              | 112  | 112            | 0      | defaults                            | 112  | 112/112/112    | 0     |
| github          | sponsorships            | terminal | half | defaults                              | 112  | 112            | 0      | defaults                            | 112  | 112/112/112    | 0     |
| github          | star_lists              | default  | full | defaults                              | 356  | 356            | 0      | defaults                            | 356  | 356/356/356    | 0     |
| github          | star_lists              | default  | half | defaults                              | 356  | 356            | 0      | defaults                            | 356  | 356/356/356    | 0     |
| github          | star_lists              | terminal | full | defaults                              | 92   | 92             | 0      | defaults                            | 92   | 92/92/92       | 0     |
| github          | star_lists              | terminal | half | defaults                              | 92   | 92             | 0      | defaults                            | 92   | 92/92/92       | 0     |
| github          | stargazers              | default  | full | defaults                              | 569  | 569            | 0      | defaults                            | 569  | 569/568/569    | 0     |
| github          | stargazers              | default  | half | defaults                              | 569  | 569            | 0      | defaults                            | 569  | 569/568/569    | 0     |
| github          | stargazers              | terminal | full | defaults                              | 172  | 172            | 0      | defaults                            | 172  | 172/172/172    | 0     |
| github          | stargazers              | terminal | half | defaults                              | 172  | 172            | 0      | defaults                            | 172  | 172/172/172    | 0     |
| github          | starred_repositories    | default  | full | defaults                              | 1416 | 1416           | 0      | defaults                            | 1416 | 1416/1416/1416 | 0     |
| github          | starred_repositories    | default  | half | defaults                              | 1416 | 1416           | 0      | defaults                            | 1416 | 1416/1416/1416 | 0     |
| github          | starred_repositories    | terminal | full | defaults                              | 280  | 280            | 0      | defaults                            | 280  | 280/280/280    | 0     |
| github          | starred_repositories    | terminal | half | defaults                              | 280  | 280            | 0      | defaults                            | 280  | 280/280/280    | 0     |
| github          | top_repositories        | default  | full | defaults                              | 704  | 704            | 0      | defaults                            | 704  | 704/704/704    | 0     |
| github          | top_repositories        | default  | half | defaults                              | 704  | 704            | 0      | defaults                            | 704  | 704/704/704    | 0     |
| github          | top_repositories        | terminal | full | defaults                              | 152  | 152            | 0      | defaults                            | 152  | 152/152/152    | 0     |
| github          | top_repositories        | terminal | half | defaults                              | 152  | 152            | 0      | defaults                            | 152  | 152/152/152    | 0     |
| github          | (all)                   | default  | full | defaults                              | 8996 | 8996           | 0      | defaults                            | 7933 | 7933/7924/7933 | 0     |
| github          | (all)                   | default  | half | defaults                              | 9321 | 9321           | 0      | defaults                            | 8258 | 8258/8250/8258 | 0     |
| github          | (all)                   | terminal | full | defaults                              | 4440 | 4440           | 0      | defaults                            | 4404 | 4404/4404/4403 | 0     |
| github          | (all)                   | terminal | half | defaults                              | 4440 | 4440           | 0      | defaults                            | 4404 | 4404/4404/4403 | 0     |
| github_repo     | banner                  | default  | full | defaults                              | 117  | 117            | 0      | defaults                            | 117  | 117/117/117    | 0     |
| github_repo     | banner                  | default  | half | content_size=xl                       | 219  | 245            | -26 ✗  | defaults                            | 137  | 137/137/137    | 0     |
| github_repo     | banner                  | terminal | full | defaults                              | 50   | 74             | -24 ✗  | defaults                            | 50   | 74/75/74       | -25 ✗ |
| github_repo     | banner                  | terminal | half | defaults                              | 70   | 94             | -24 ✗  | defaults                            | 70   | 94/95/94       | -25 ✗ |
| github_repo     | languages               | default  | full | defaults                              | 74   | 74             | 0      | defaults                            | 74   | 74/74/74       | 0     |
| github_repo     | languages               | default  | half | defaults                              | 96   | 96             | 0      | defaults                            | 96   | 96/96/96       | 0     |
| github_repo     | languages               | terminal | full | defaults                              | 34   | 58             | -24 ✗  | defaults                            | 34   | 58/58/58       | -24 ✗ |
| github_repo     | languages               | terminal | half | defaults                              | 54   | 78             | -24 ✗  | defaults                            | 54   | 78/78/78       | -24 ✗ |
| github_repo     | overview                | default  | full | defaults                              | 226  | 225            | +1     | content_size=sm                     | 185  | 184/186/184    | -1 ✗  |
| github_repo     | overview                | default  | half | defaults                              | 226  | 225            | +1     | content_size=sm                     | 185  | 184/186/184    | -1 ✗  |
| github_repo     | overview                | terminal | full | defaults                              | 28   | 52             | -24 ✗  | defaults                            | 28   | 52/52/52       | -24 ✗ |
| github_repo     | overview                | terminal | half | defaults                              | 28   | 52             | -24 ✗  | defaults                            | 28   | 52/52/52       | -24 ✗ |
| github_repo     | star_graph              | default  | full | content_size=xl                       | 298  | 294            | +4 ✗   | content_size=sm                     | 153  | 152/152/152    | +1    |
| github_repo     | star_graph              | default  | half | content_size=xl                       | 298  | 294            | +4 ✗   | content_size=sm                     | 153  | 152/152/152    | +1    |
| github_repo     | star_graph              | terminal | full | defaults                              | 129  | 153            | -24 ✗  | content_size=lg                     | 175  | 199/200/199    | -25 ✗ |
| github_repo     | star_graph              | terminal | half | defaults                              | 129  | 153            | -24 ✗  | content_size=lg                     | 175  | 199/200/199    | -25 ✗ |
| github_repo     | stats                   | default  | full | stats_variant=featured                | 85   | 84             | +1     | content_size=sm                     | 65   | 64/64/64       | +1    |
| github_repo     | stats                   | default  | half | stats_variant=featured                | 85   | 84             | +1     | content_size=sm                     | 65   | 64/64/64       | +1    |
| github_repo     | stats                   | terminal | full | defaults                              | 28   | 52             | -24 ✗  | defaults                            | 28   | 52/52/52       | -24 ✗ |
| github_repo     | stats                   | terminal | half | defaults                              | 28   | 52             | -24 ✗  | defaults                            | 28   | 52/52/52       | -24 ✗ |
| github_repo     | topics                  | default  | full | defaults                              | 60   | 60             | 0      | defaults                            | 60   | 60/60/60       | 0     |
| github_repo     | topics                  | default  | half | content_size=sm                       | 81   | 80             | +1     | defaults                            | 96   | 96/96/96       | 0     |
| github_repo     | topics                  | terminal | full | defaults                              | 20   | 44             | -24 ✗  | defaults                            | 20   | 44/44/44       | -24 ✗ |
| github_repo     | topics                  | terminal | half | defaults                              | 20   | 44             | -24 ✗  | defaults                            | 20   | 44/44/44       | -24 ✗ |
| github_repo     | (all)                   | default  | full | defaults                              | 742  | 739            | +3 ✗   | defaults                            | 742  | 739/740/740    | +2    |
| github_repo     | (all)                   | default  | half | defaults                              | 820  | 818            | +2     | defaults                            | 820  | 818/819/818    | +1    |
| github_repo     | (all)                   | terminal | full | defaults                              | 409  | 433            | -24 ✗  | defaults                            | 409  | 433/434/433    | -25 ✗ |
| github_repo     | (all)                   | terminal | half | defaults                              | 449  | 473            | -24 ✗  | defaults                            | 449  | 473/474/473    | -25 ✗ |
| lastfm          | recent_tracks           | default  | full | recent_tracks_hide_title=true         | 314  | 274            | +40 ✗  | defaults                            | 314  | 314/314/314    | 0     |
| lastfm          | recent_tracks           | default  | half | recent_tracks_hide_title=true         | 314  | 274            | +40 ✗  | defaults                            | 314  | 314/314/314    | 0     |
| lastfm          | recent_tracks           | terminal | full | defaults                              | 117  | 112            | 0      | defaults                            | 112  | 112/112/112    | 0     |
| lastfm          | recent_tracks           | terminal | half | defaults                              | 117  | 112            | 0      | defaults                            | 112  | 112/112/112    | 0     |
| lastfm          | statistics              | default  | full | statistics_hide_title=true            | 200  | 184            | +16 ✗  | defaults                            | 236  | 236/236/236    | 0     |
| lastfm          | statistics              | default  | half | statistics_hide_title=true            | 184  | 174            | +10 ✗  | statistics_hide_featured_track=true | 122  | 120/120/120    | +2    |
| lastfm          | statistics              | terminal | full | statistics_hide_featured_track=true   | 52   | 72             | -20 ✗  | defaults                            | 110  | 110/110/108    | 0     |
| lastfm          | statistics              | terminal | half | statistics_hide_featured_track=true   | 52   | 72             | -20 ✗  | defaults                            | 110  | 110/110/108    | 0     |
| lastfm          | top_albums              | default  | full | top_albums_hide_title=true            | 252  | 212            | +40 ✗  | defaults                            | 252  | 252/252/252    | 0     |
| lastfm          | top_albums              | default  | half | top_albums_hide_title=true            | 252  | 212            | +40 ✗  | defaults                            | 252  | 252/252/252    | 0     |
| lastfm          | top_albums              | terminal | full | top_albums_style=list                 | 117  | 116            | -3 ✗   | defaults                            | 251  | 251/251/250    | 0     |
| lastfm          | top_albums              | terminal | half | top_albums_style=list                 | 117  | 116            | -3 ✗   | defaults                            | 251  | 251/251/250    | 0     |
| lastfm          | top_artists             | default  | full | top_artists_hide_title=true           | 291  | 251            | +40 ✗  | defaults                            | 291  | 291/290/291    | 0     |
| lastfm          | top_artists             | default  | half | top_artists_hide_title=true           | 291  | 247            | +44 ✗  | defaults                            | 287  | 287/287/287    | 0     |
| lastfm          | top_artists             | terminal | full | defaults                              | 251  | 251            | 0      | defaults                            | 251  | 251/251/250    | 0     |
| lastfm          | top_artists             | terminal | half | defaults                              | 251  | 251            | 0      | defaults                            | 251  | 251/251/250    | 0     |
| lastfm          | top_tracks              | default  | full | top_tracks_hide_title=true            | 252  | 212            | +40 ✗  | defaults                            | 252  | 252/252/252    | 0     |
| lastfm          | top_tracks              | default  | half | top_tracks_hide_title=true            | 252  | 212            | +40 ✗  | defaults                            | 252  | 252/252/252    | 0     |
| lastfm          | top_tracks              | terminal | full | defaults                              | 351  | 351            | 0      | defaults                            | 351  | 351/351/350    | 0     |
| lastfm          | top_tracks              | terminal | half | defaults                              | 351  | 351            | 0      | defaults                            | 351  | 351/351/350    | 0     |
| lastfm          | (all)                   | default  | full | defaults                              | 1349 | 1345           | +4 ✗   | data:1 item                         | 1123 | 1122/1120/1122 | +1    |
| lastfm          | (all)                   | default  | half | defaults                              | 1333 | 1329           | +4 ✗   | data:no featured track              | 1227 | 1225/1223/1225 | +2    |
| lastfm          | (all)                   | terminal | full | defaults                              | 1080 | 1043           | +32 ✗  | defaults                            | 1043 | 1043/1043/1038 | 0     |
| lastfm          | (all)                   | terminal | half | defaults                              | 1080 | 1043           | +32 ✗  | defaults                            | 1043 | 1043/1043/1038 | 0     |
| lyfta           | exercises               | default  | full | exercises_hide_title=true             | 310  | 264            | +46 ✗  | defaults                            | 268  | 268/268/268    | 0     |
| lyfta           | exercises               | default  | half | exercises_hide_title=true             | 290  | 244            | +46 ✗  | defaults                            | 268  | 268/268/268    | 0     |
| lyfta           | exercises               | terminal | full | exercises_max=20                      | 452  | 508            | -56 ✗  | defaults                            | 132  | 132/132/132    | 0     |
| lyfta           | exercises               | terminal | half | exercises_max=20                      | 452  | 508            | -56 ✗  | defaults                            | 132  | 132/132/132    | 0     |
| lyfta           | last_workout            | default  | full | last_workout_max_exercises=10         | 374  | 378            | -4 ✗   | defaults                            | 364  | 364/364/364    | 0     |
| lyfta           | last_workout            | default  | half | last_workout_max_exercises=10         | 352  | 356            | -15 ✗  | defaults                            | 364  | 364/364/364    | 0     |
| lyfta           | last_workout            | terminal | full | last_workout_max_exercises=1          | 104  | 132            | -28 ✗  | defaults                            | 212  | 212/212/212    | 0     |
| lyfta           | last_workout            | terminal | half | last_workout_max_exercises=1          | 104  | 132            | -28 ✗  | defaults                            | 212  | 212/212/212    | 0     |
| lyfta           | overview                | default  | full | overview_hide_title=true              | 221  | 181            | +39 ✗  | defaults                            | 108  | 108/108/108    | 0     |
| lyfta           | overview                | default  | half | overview_hide_title=true              | 221  | 173            | +47 ✗  | defaults                            | 168  | 168/168/168    | 0     |
| lyfta           | overview                | terminal | full | overview_show_volume=false            | 112  | 92             | +20 ✗  | defaults                            | 112  | 112/112/112    | 0     |
| lyfta           | overview                | terminal | half | overview_show_volume=false            | 112  | 92             | +20 ✗  | defaults                            | 112  | 112/112/112    | 0     |
| lyfta           | recent_workouts         | default  | full | workouts_max=20                       | 1514 | 1569           | -55 ✗  | defaults                            | 292  | 292/292/292    | 0     |
| lyfta           | recent_workouts         | default  | half | workouts_max=20                       | 1452 | 1500           | -48 ✗  | defaults                            | 292  | 292/292/292    | 0     |
| lyfta           | recent_workouts         | terminal | full | defaults                              | 118  | 112            | +6 ✗   | defaults                            | 132  | 132/132/132    | 0     |
| lyfta           | recent_workouts         | terminal | half | defaults                              | 118  | 112            | +6 ✗   | defaults                            | 132  | 132/132/132    | 0     |
| lyfta           | statistics              | default  | full | statistics_hide_title=true            | 132  | 92             | +40 ✗  | defaults                            | 152  | 152/152/152    | 0     |
| lyfta           | statistics              | default  | half | statistics_hide_title=true            | 132  | 88             | +44 ✗  | defaults                            | 212  | 212/212/212    | 0     |
| lyfta           | statistics              | terminal | full | defaults                              | 91   | 72             | +19 ✗  | defaults                            | 152  | 152/152/152    | 0     |
| lyfta           | statistics              | terminal | half | defaults                              | 91   | 72             | +19 ✗  | defaults                            | 152  | 152/152/152    | 0     |
| lyfta           | (all)                   | default  | full | defaults                              | 1343 | 1331           | +12 ✗  | defaults                            | 1184 | 1184/1182/1184 | 0     |
| lyfta           | (all)                   | default  | half | defaults                              | 1290 | 1266           | +16 ✗  | defaults                            | 1304 | 1304/1302/1304 | 0     |
| lyfta           | (all)                   | terminal | full | defaults                              | 689  | 624            | +65 ✗  | defaults                            | 708  | 708/708/708    | 0     |
| lyfta           | (all)                   | terminal | half | defaults                              | 689  | 624            | +65 ✗  | defaults                            | 708  | 708/708/708    | 0     |
| myanimelist     | anime_bar               | default  | full | anime_bar_hide_title=true             | 78   | 38             | +40 ✗  | defaults                            | 78   | 78/78/78       | 0     |
| myanimelist     | anime_bar               | default  | half | anime_bar_hide_title=true             | 134  | 94             | +40 ✗  | defaults                            | 134  | 134/134/134    | 0     |
| myanimelist     | anime_bar               | terminal | full | defaults                              | 156  | 151            | +5 ✗   | defaults                            | 151  | 151/151/150    | 0     |
| myanimelist     | anime_bar               | terminal | half | defaults                              | 156  | 151            | +5 ✗   | defaults                            | 151  | 151/151/150    | 0     |
| myanimelist     | anime_favorites         | default  | full | defaults                              | 656  | 656            | 0      | defaults                            | 656  | 656/656/656    | 0     |
| myanimelist     | anime_favorites         | default  | half | defaults                              | 656  | 656            | 0      | defaults                            | 656  | 656/656/656    | 0     |
| myanimelist     | anime_favorites         | terminal | full | defaults                              | 552  | 552            | 0      | defaults                            | 552  | 552/527/502    | 0     |
| myanimelist     | anime_favorites         | terminal | half | defaults                              | 552  | 552            | 0      | defaults                            | 552  | 552/527/502    | 0     |
| myanimelist     | character_favorites     | default  | full | defaults                              | 306  | 306            | 0      | defaults                            | 306  | 306/306/306    | 0     |
| myanimelist     | character_favorites     | default  | half | defaults                              | 306  | 306            | 0      | defaults                            | 306  | 306/306/306    | 0     |
| myanimelist     | character_favorites     | terminal | full | defaults                              | 128  | 128            | 0      | defaults                            | 128  | 128/128/128    | 0     |
| myanimelist     | character_favorites     | terminal | half | defaults                              | 128  | 128            | 0      | defaults                            | 128  | 128/128/128    | 0     |
| myanimelist     | last_activity           | default  | full | last_activity_hide_title=true         | 510  | 470            | +40 ✗  | defaults                            | 510  | 510/510/510    | 0     |
| myanimelist     | last_activity           | default  | half | last_activity_hide_title=true         | 510  | 470            | +40 ✗  | defaults                            | 510  | 510/510/510    | 0     |
| myanimelist     | last_activity           | terminal | full | last_activity_hide_anime=true         | 262  | 321            | -59 ✗  | defaults                            | 504  | 504/474/447    | 0     |
| myanimelist     | last_activity           | terminal | half | last_activity_hide_anime=true         | 262  | 321            | -59 ✗  | defaults                            | 504  | 504/474/447    | 0     |
| myanimelist     | manga_bar               | default  | full | manga_bar_hide_title=true             | 78   | 38             | +40 ✗  | defaults                            | 78   | 78/78/78       | 0     |
| myanimelist     | manga_bar               | default  | half | manga_bar_hide_title=true             | 134  | 94             | +40 ✗  | defaults                            | 134  | 134/134/134    | 0     |
| myanimelist     | manga_bar               | terminal | full | defaults                              | 156  | 151            | +5 ✗   | defaults                            | 151  | 151/151/150    | 0     |
| myanimelist     | manga_bar               | terminal | half | defaults                              | 156  | 151            | +5 ✗   | defaults                            | 151  | 151/151/150    | 0     |
| myanimelist     | manga_favorites         | default  | full | defaults                              | 656  | 656            | 0      | defaults                            | 656  | 656/656/656    | 0     |
| myanimelist     | manga_favorites         | default  | half | defaults                              | 656  | 656            | 0      | defaults                            | 656  | 656/656/656    | 0     |
| myanimelist     | manga_favorites         | terminal | full | defaults                              | 552  | 552            | 0      | defaults                            | 552  | 552/527/502    | 0     |
| myanimelist     | manga_favorites         | terminal | half | defaults                              | 552  | 552            | 0      | defaults                            | 552  | 552/527/502    | 0     |
| myanimelist     | people_favorites        | default  | full | defaults                              | 306  | 306            | 0      | defaults                            | 306  | 306/306/306    | 0     |
| myanimelist     | people_favorites        | default  | half | defaults                              | 306  | 306            | 0      | defaults                            | 306  | 306/306/306    | 0     |
| myanimelist     | people_favorites        | terminal | full | defaults                              | 128  | 128            | 0      | defaults                            | 128  | 128/128/128    | 0     |
| myanimelist     | people_favorites        | terminal | half | defaults                              | 128  | 128            | 0      | defaults                            | 128  | 128/128/128    | 0     |
| myanimelist     | statistics              | default  | full | statistics_hide_title=true            | 184  | 144            | +40 ✗  | defaults                            | 184  | 184/184/184    | 0     |
| myanimelist     | statistics              | default  | half | statistics_hide_title=true            | 376  | 296            | +80 ✗  | defaults                            | 376  | 376/376/376    | 0     |
| myanimelist     | statistics              | terminal | full | defaults                              | 272  | 272            | 0      | defaults                            | 272  | 272/272/272    | 0     |
| myanimelist     | statistics              | terminal | half | defaults                              | 496  | 496            | 0      | defaults                            | 496  | 496/496/496    | 0     |
| myanimelist     | statistics_simple       | default  | full | statistics_simple_hide_title=true     | 72   | 32             | +40 ✗  | defaults                            | 72   | 72/72/72       | 0     |
| myanimelist     | statistics_simple       | default  | half | statistics_simple_hide_title=true     | 100  | 60             | +40 ✗  | defaults                            | 100  | 100/100/100    | 0     |
| myanimelist     | statistics_simple       | terminal | full | defaults                              | 112  | 112            | 0      | defaults                            | 112  | 112/112/112    | 0     |
| myanimelist     | statistics_simple       | terminal | half | defaults                              | 112  | 112            | 0      | defaults                            | 112  | 112/112/112    | 0     |
| myanimelist     | (all)                   | default  | full | defaults                              | 2846 | 2846           | 0      | defaults                            | 2846 | 2846/2843/2846 | 0     |
| myanimelist     | (all)                   | default  | half | defaults                              | 3178 | 3178           | 0      | defaults                            | 3178 | 3178/3174/3178 | 0     |
| myanimelist     | (all)                   | terminal | full | defaults                              | 2564 | 2543           | +21 ✗  | defaults                            | 2486 | 2486/2406/2327 | 0     |
| myanimelist     | (all)                   | terminal | half | defaults                              | 2788 | 2767           | +21 ✗  | defaults                            | 2710 | 2710/2630/2551 | 0     |
| stackoverflow   | answers_questions       | default  | full | answers_questions_hide_title=true     | 80   | 28             | +52 ✗  | defaults                            | 80   | 80/80/80       | 0     |
| stackoverflow   | answers_questions       | default  | half | answers_questions_hide_title=true     | 80   | 28             | +52 ✗  | defaults                            | 78   | 78/78/78       | 0     |
| stackoverflow   | answers_questions       | terminal | full | answers_questions_hide_questions=true | 64   | 44             | +20 ✗  | defaults                            | 64   | 64/64/64       | 0     |
| stackoverflow   | answers_questions       | terminal | half | answers_questions_hide_questions=true | 64   | 44             | +20 ✗  | defaults                            | 64   | 64/64/64       | 0     |
| stackoverflow   | badges                  | default  | full | badges_hide_title=true                | 108  | 56             | +52 ✗  | defaults                            | 108  | 108/108/108    | 0     |
| stackoverflow   | badges                  | default  | half | badges_hide_title=true                | 108  | 56             | +52 ✗  | defaults                            | 106  | 106/106/106    | 0     |
| stackoverflow   | badges                  | terminal | full | defaults                              | 104  | 104            | 0      | defaults                            | 104  | 104/104/104    | 0     |
| stackoverflow   | badges                  | terminal | half | defaults                              | 104  | 104            | 0      | defaults                            | 104  | 104/104/104    | 0     |
| stackoverflow   | reputation              | default  | full | reputation_hide_title=true            | 80   | 28             | +52 ✗  | defaults                            | 80   | 80/80/80       | 0     |
| stackoverflow   | reputation              | default  | half | reputation_hide_title=true            | 80   | 28             | +52 ✗  | defaults                            | 78   | 78/78/78       | 0     |
| stackoverflow   | reputation              | terminal | full | defaults                              | 44   | 44             | 0      | defaults                            | 44   | 44/44/44       | 0     |
| stackoverflow   | reputation              | terminal | half | defaults                              | 44   | 44             | 0      | defaults                            | 44   | 44/44/44       | 0     |
| stackoverflow   | tags_expertise          | default  | full | tags_expertise_hide_title=true        | 319  | 266            | +53 ✗  | defaults                            | 318  | 318/318/318    | 0     |
| stackoverflow   | tags_expertise          | default  | half | tags_expertise_hide_title=true        | 319  | 266            | +53 ✗  | defaults                            | 316  | 316/316/316    | 0     |
| stackoverflow   | tags_expertise          | terminal | full | defaults                              | 104  | 104            | 0      | defaults                            | 104  | 104/104/104    | 0     |
| stackoverflow   | tags_expertise          | terminal | half | defaults                              | 104  | 104            | 0      | defaults                            | 104  | 104/104/104    | 0     |
| stackoverflow   | (all)                   | default  | full | defaults                              | 587  | 586            | +1     | defaults                            | 586  | 586/585/586    | 0     |
| stackoverflow   | (all)                   | default  | half | defaults                              | 587  | 578            | +9 ✗   | defaults                            | 578  | 578/577/578    | 0     |
| stackoverflow   | (all)                   | terminal | full | defaults                              | 316  | 316            | 0      | defaults                            | 316  | 316/316/316    | 0     |
| stackoverflow   | (all)                   | terminal | half | defaults                              | 316  | 316            | 0      | defaults                            | 316  | 316/316/316    | 0     |
| steam           | recent_games            | default  | full | recent_games_style=compact            | 408  | 206            | +202 ✗ | recent_games_style=compact          | 207  | 206/206/206    | +1    |
| steam           | recent_games            | default  | half | recent_games_style=compact            | 360  | 282            | +78 ✗  | defaults                            | 360  | 360/360/360    | 0     |
| steam           | recent_games            | terminal | full | defaults                              | 132  | 132            | 0      | defaults                            | 132  | 132/132/132    | 0     |
| steam           | recent_games            | terminal | half | defaults                              | 132  | 132            | 0      | defaults                            | 132  | 132/132/132    | 0     |
| steam           | statistics              | default  | full | statistics_hide_title=true            | 306  | 294            | +12 ✗  | defaults                            | 346  | 346/346/346    | 0     |
| steam           | statistics              | default  | half | statistics_hide_title=true            | 272  | 260            | +12 ✗  | defaults                            | 310  | 310/310/310    | 0     |
| steam           | statistics              | terminal | full | defaults                              | 132  | 132            | 0      | defaults                            | 132  | 132/132/132    | 0     |
| steam           | statistics              | terminal | half | defaults                              | 132  | 132            | 0      | defaults                            | 132  | 132/132/132    | 0     |
| steam           | top_games               | default  | full | top_games_style=compact               | 500  | 371            | +129 ✗ | top_games_style=compact             | 373  | 371/371/371    | +2    |
| steam           | top_games               | default  | half | top_games_style=compact               | 440  | 282            | +158 ✗ | defaults                            | 440  | 440/440/440    | 0     |
| steam           | top_games               | terminal | full | defaults                              | 152  | 152            | 0      | defaults                            | 152  | 152/152/152    | 0     |
| steam           | top_games               | terminal | half | defaults                              | 152  | 152            | 0      | defaults                            | 152  | 152/152/152    | 0     |
| steam           | (all)                   | default  | full | defaults                              | 1254 | 1254           | 0      | defaults                            | 1254 | 1254/1253/1254 | 0     |
| steam           | (all)                   | default  | half | defaults                              | 1112 | 1110           | +2     | defaults                            | 1110 | 1110/1109/1110 | 0     |
| steam           | (all)                   | terminal | full | defaults                              | 416  | 400            | +16 ✗  | defaults                            | 400  | 400/400/400    | 0     |
| steam           | (all)                   | terminal | half | defaults                              | 416  | 400            | +16 ✗  | defaults                            | 400  | 400/400/400    | 0     |
| websites        | websites                | default  | full | websites_variant=list                 | 356  | 340            | +16 ✗  | defaults                            | 358  | 358/358/358    | 0     |
| websites        | websites                | default  | half | defaults                              | 472  | 457            | +15 ✗  | defaults                            | 457  | 457/457/457    | 0     |
| websites        | websites                | terminal | full | defaults                              | 138  | 128            | +10 ✗  | defaults                            | 128  | 128/128/128    | 0     |
| websites        | websites                | terminal | half | defaults                              | 138  | 128            | +10 ✗  | defaults                            | 128  | 128/128/128    | 0     |
