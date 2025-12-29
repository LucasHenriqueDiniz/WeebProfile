import type { GithubData } from '../types'
import { urlToBase64 } from '../../../utils/image-to-base64'

export async function getMockGithubData(): Promise<GithubData> {  
  // Dados reais copiados do real-data.json
  const realData: GithubData = {
  "user": {
    "name": "Lucas HDO",
    "login": "LucasHenriqueDiniz",
    "avatarUrl": "https://avatars.githubusercontent.com/u/63087780?v=4",
    "createdAt": "2020-04-03T04:25:06Z",
    "followers": 34,
    "following": 11,
    "repositories": {
      "totalCount": 0
    },
    "contributionCalendar": {
      "totalContributions": 875,
      "weeks": [
        {
          "contributionDays": [
            {
              "color": "#30a14e",
              "contributionCount": 13,
              "date": "2024-11-17"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-11-18"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-11-19"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-11-20"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-11-21"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-11-22"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-11-23"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#9be9a8",
              "contributionCount": 3,
              "date": "2024-11-24"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2024-11-25"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-11-26"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2024-11-27"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-11-28"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-11-29"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-11-30"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-01"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-02"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-03"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-04"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2024-12-05"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-06"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-07"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-08"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2024-12-09"
            },
            {
              "color": "#40c463",
              "contributionCount": 6,
              "date": "2024-12-10"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-11"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-12"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-13"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-14"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-15"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2024-12-16"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-17"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-18"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-19"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-20"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-21"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-22"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-23"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-24"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-25"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-26"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-27"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-28"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-29"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-30"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2024-12-31"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-01"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-02"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-03"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-04"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-05"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-06"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-07"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-08"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-09"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-01-10"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-11"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-12"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-01-13"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-14"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-15"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-16"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-17"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-18"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-19"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-20"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-21"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-22"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-23"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-24"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-25"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-26"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-27"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-28"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-29"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-30"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-01-31"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-01"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-02"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-03"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-04"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-05"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-06"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-07"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-08"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-09"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-10"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-11"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-12"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-13"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-14"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-15"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-16"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-17"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-18"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-19"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-20"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-21"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-22"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-23"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-24"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-25"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-26"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-27"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-02-28"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-01"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-02"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-03"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-04"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-05"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-06"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-07"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-08"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-09"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-10"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-11"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-12"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-13"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-14"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-15"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-16"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-17"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-18"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-19"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-20"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-21"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-22"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-23"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-03-24"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-25"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-26"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-03-27"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-03-28"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-03-29"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-03-30"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-03-31"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-04-01"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-04-02"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-04-03"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-04-04"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-04-05"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-04-06"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-04-07"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-04-08"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-04-09"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-04-10"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-04-11"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-04-12"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-04-13"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-04-14"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-04-15"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-04-16"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-04-17"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-04-18"
            },
            {
              "color": "#216e39",
              "contributionCount": 22,
              "date": "2025-04-19"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#9be9a8",
              "contributionCount": 5,
              "date": "2025-04-20"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-04-21"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-04-22"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-04-23"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-04-24"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-04-25"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-04-26"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-04-27"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-04-28"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-04-29"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-04-30"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 5,
              "date": "2025-05-01"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 5,
              "date": "2025-05-02"
            },
            {
              "color": "#40c463",
              "contributionCount": 6,
              "date": "2025-05-03"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#40c463",
              "contributionCount": 7,
              "date": "2025-05-04"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-05"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-05-06"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-07"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-08"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-05-09"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-10"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-11"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-05-12"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-13"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-05-14"
            },
            {
              "color": "#40c463",
              "contributionCount": 6,
              "date": "2025-05-15"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-05-16"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-17"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-18"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-05-19"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-20"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-05-21"
            },
            {
              "color": "#40c463",
              "contributionCount": 6,
              "date": "2025-05-22"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-23"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-24"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-25"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-05-26"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-05-27"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-28"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-05-29"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-30"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-05-31"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-06-01"
            },
            {
              "color": "#40c463",
              "contributionCount": 7,
              "date": "2025-06-02"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-06-03"
            },
            {
              "color": "#40c463",
              "contributionCount": 8,
              "date": "2025-06-04"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-06-05"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-06-06"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-06-07"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#9be9a8",
              "contributionCount": 3,
              "date": "2025-06-08"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 5,
              "date": "2025-06-09"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-06-10"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-06-11"
            },
            {
              "color": "#40c463",
              "contributionCount": 8,
              "date": "2025-06-12"
            },
            {
              "color": "#30a14e",
              "contributionCount": 14,
              "date": "2025-06-13"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-06-14"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-06-15"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-06-16"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-06-17"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-06-18"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-06-19"
            },
            {
              "color": "#216e39",
              "contributionCount": 21,
              "date": "2025-06-20"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-06-21"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-06-22"
            },
            {
              "color": "#216e39",
              "contributionCount": 19,
              "date": "2025-06-23"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-06-24"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-06-25"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-06-26"
            },
            {
              "color": "#40c463",
              "contributionCount": 6,
              "date": "2025-06-27"
            },
            {
              "color": "#216e39",
              "contributionCount": 17,
              "date": "2025-06-28"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#40c463",
              "contributionCount": 8,
              "date": "2025-06-29"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-06-30"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-07-01"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-07-02"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-07-03"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-07-04"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-07-05"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-07-06"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 5,
              "date": "2025-07-07"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-07-08"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-07-09"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-07-10"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 3,
              "date": "2025-07-11"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-07-12"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-07-13"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-07-14"
            },
            {
              "color": "#40c463",
              "contributionCount": 9,
              "date": "2025-07-15"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-07-16"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-07-17"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-07-18"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-07-19"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-07-20"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-07-21"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-07-22"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-07-23"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-07-24"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-07-25"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-07-26"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-07-27"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-07-28"
            },
            {
              "color": "#40c463",
              "contributionCount": 6,
              "date": "2025-07-29"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 5,
              "date": "2025-07-30"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-07-31"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-08-01"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-08-02"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#40c463",
              "contributionCount": 7,
              "date": "2025-08-03"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 5,
              "date": "2025-08-04"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-08-05"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-08-06"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-08-07"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-08-08"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-08-09"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-08-10"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-08-11"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-08-12"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-08-13"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-08-14"
            },
            {
              "color": "#40c463",
              "contributionCount": 8,
              "date": "2025-08-15"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-08-16"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-08-17"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-08-18"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-08-19"
            },
            {
              "color": "#40c463",
              "contributionCount": 7,
              "date": "2025-08-20"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-08-21"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-08-22"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-08-23"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-08-24"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-08-25"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 5,
              "date": "2025-08-26"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-08-27"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 5,
              "date": "2025-08-28"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-08-29"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-08-30"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-08-31"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-09-01"
            },
            {
              "color": "#40c463",
              "contributionCount": 10,
              "date": "2025-09-02"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-09-03"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-09-04"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-09-05"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-09-06"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#9be9a8",
              "contributionCount": 3,
              "date": "2025-09-07"
            },
            {
              "color": "#40c463",
              "contributionCount": 6,
              "date": "2025-09-08"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-09-09"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-09-10"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-09-11"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-09-12"
            },
            {
              "color": "#30a14e",
              "contributionCount": 15,
              "date": "2025-09-13"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#216e39",
              "contributionCount": 55,
              "date": "2025-09-14"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-09-15"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-09-16"
            },
            {
              "color": "#216e39",
              "contributionCount": 17,
              "date": "2025-09-17"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-09-18"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-09-19"
            },
            {
              "color": "#216e39",
              "contributionCount": 68,
              "date": "2025-09-20"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#216e39",
              "contributionCount": 75,
              "date": "2025-09-21"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-09-22"
            },
            {
              "color": "#40c463",
              "contributionCount": 8,
              "date": "2025-09-23"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 3,
              "date": "2025-09-24"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-09-25"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-09-26"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-09-27"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#216e39",
              "contributionCount": 22,
              "date": "2025-09-28"
            },
            {
              "color": "#40c463",
              "contributionCount": 9,
              "date": "2025-09-29"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-09-30"
            },
            {
              "color": "#40c463",
              "contributionCount": 10,
              "date": "2025-10-01"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-10-02"
            },
            {
              "color": "#40c463",
              "contributionCount": 7,
              "date": "2025-10-03"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-10-04"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-10-05"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-10-06"
            },
            {
              "color": "#40c463",
              "contributionCount": 7,
              "date": "2025-10-07"
            },
            {
              "color": "#30a14e",
              "contributionCount": 14,
              "date": "2025-10-08"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-10-09"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-10-10"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-10-11"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-10-12"
            },
            {
              "color": "#40c463",
              "contributionCount": 10,
              "date": "2025-10-13"
            },
            {
              "color": "#40c463",
              "contributionCount": 9,
              "date": "2025-10-14"
            },
            {
              "color": "#216e39",
              "contributionCount": 19,
              "date": "2025-10-15"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 3,
              "date": "2025-10-16"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-10-17"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-10-18"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-10-19"
            },
            {
              "color": "#40c463",
              "contributionCount": 6,
              "date": "2025-10-20"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-10-21"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 3,
              "date": "2025-10-22"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-10-23"
            },
            {
              "color": "#40c463",
              "contributionCount": 11,
              "date": "2025-10-24"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-10-25"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#9be9a8",
              "contributionCount": 2,
              "date": "2025-10-26"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-10-27"
            },
            {
              "color": "#40c463",
              "contributionCount": 8,
              "date": "2025-10-28"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-10-29"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-10-30"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-10-31"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 4,
              "date": "2025-11-01"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-02"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-03"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-04"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 3,
              "date": "2025-11-05"
            },
            {
              "color": "#40c463",
              "contributionCount": 8,
              "date": "2025-11-06"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-07"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-08"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-09"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-10"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 1,
              "date": "2025-11-11"
            },
            {
              "color": "#9be9a8",
              "contributionCount": 5,
              "date": "2025-11-12"
            },
            {
              "color": "#30a14e",
              "contributionCount": 14,
              "date": "2025-11-13"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-14"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-15"
            }
          ]
        },
        {
          "contributionDays": [
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-16"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-17"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-18"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-19"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-20"
            },
            {
              "color": "#ebedf0",
              "contributionCount": 0,
              "date": "2025-11-21"
            }
          ]
        }
      ]
    },
    "repositoriesContributedTo": 1
  },
  "repositories": {
    "totalCount": 48,
    "nodes": [
      {
        "name": "WeebProfile",
        "description": "A simple and customizable way to display code, anime, and music stats on your GitHub profile README.",
        "url": "https://github.com/LucasHenriqueDiniz/WeebProfile",
        "stargazerCount": 10,
        "forkCount": 2,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2025-11-13T23:15:09Z"
      },
      {
        "name": "LucasHenriqueDiniz",
        "description": "Config files for my GitHub profile.",
        "url": "https://github.com/LucasHenriqueDiniz/LucasHenriqueDiniz",
        "stargazerCount": 1,
        "forkCount": 0,
        "watchers": {
          "totalCount": 0
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": null,
        "updatedAt": "2025-11-13T23:11:43Z"
      },
      {
        "name": "lucashdo",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/lucashdo",
        "stargazerCount": 4,
        "forkCount": 0,
        "watchers": {
          "totalCount": 0
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2025-11-13T20:52:25Z"
      },
      {
        "name": "picnic-challenge",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/picnic-challenge",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 0
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2025-11-10T16:25:08Z"
      },
      {
        "name": "BasicaoFullstack-End",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/BasicaoFullstack-End",
        "stargazerCount": 1,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3572A5",
          "name": "Python"
        },
        "updatedAt": "2025-11-04T20:23:53Z"
      },
      {
        "name": "reclame-mulher",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/reclame-mulher",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 0
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#663399",
          "name": "CSS"
        },
        "updatedAt": "2025-11-02T00:01:52Z"
      },
      {
        "name": "roast-bot",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/roast-bot",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 0
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3178c6",
          "name": "TypeScript"
        },
        "updatedAt": "2025-10-08T04:20:46Z"
      },
      {
        "name": "tavern-sim-test",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/tavern-sim-test",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 0
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#178600",
          "name": "C#"
        },
        "updatedAt": "2025-10-05T22:08:05Z"
      },
      {
        "name": "vscode-context-tools",
        "description": "Copy current file/selection/open editors as fenced blocks, project tree, and diagnostics (Problems). Optimized for pasting into LLM/chat.",
        "url": "https://github.com/LucasHenriqueDiniz/vscode-context-tools",
        "stargazerCount": 1,
        "forkCount": 0,
        "watchers": {
          "totalCount": 0
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3178c6",
          "name": "TypeScript"
        },
        "updatedAt": "2025-09-09T04:09:33Z"
      },
      {
        "name": "loot-farm-bot",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/loot-farm-bot",
        "stargazerCount": 1,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3572A5",
          "name": "Python"
        },
        "updatedAt": "2025-08-21T03:48:25Z"
      },
      {
        "name": "live2d-next",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/live2d-next",
        "stargazerCount": 2,
        "forkCount": 0,
        "watchers": {
          "totalCount": 0
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2025-07-28T00:28:49Z"
      },
      {
        "name": "mannco.store-enhancer-extension",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/mannco.store-enhancer-extension",
        "stargazerCount": 1,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3178c6",
          "name": "TypeScript"
        },
        "updatedAt": "2025-07-23T14:17:54Z"
      },
      {
        "name": "siot-web-flasher",
        "description": "Instalação de firmware e monitoramento serial para ESP32/ESP8266 via navegador web",
        "url": "https://github.com/LucasHenriqueDiniz/siot-web-flasher",
        "stargazerCount": 5,
        "forkCount": 0,
        "watchers": {
          "totalCount": 0
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#C1F12E",
          "name": "Batchfile"
        },
        "updatedAt": "2025-07-04T23:33:01Z"
      },
      {
        "name": "php-laravel-crud",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/php-laravel-crud",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 0
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#384d54",
          "name": "Dockerfile"
        },
        "updatedAt": "2025-07-04T00:40:52Z"
      },
      {
        "name": "exemplo-firebase-login",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/exemplo-firebase-login",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 0
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3572A5",
          "name": "Python"
        },
        "updatedAt": "2025-06-29T22:57:37Z"
      },
      {
        "name": "cron-item-watcher",
        "description": "Bot using Discord Webhook to inform user about items updates from specific websites using GitHub Actions",
        "url": "https://github.com/LucasHenriqueDiniz/cron-item-watcher",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3178c6",
          "name": "TypeScript"
        },
        "updatedAt": "2025-06-29T16:36:12Z"
      },
      {
        "name": "QI-TEST-APP",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/QI-TEST-APP",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3178c6",
          "name": "TypeScript"
        },
        "updatedAt": "2025-06-29T16:16:28Z"
      },
      {
        "name": "sora-project",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/sora-project",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#e34c26",
          "name": "HTML"
        },
        "updatedAt": "2025-06-29T16:11:47Z"
      },
      {
        "name": "windowx-xp-online",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/windowx-xp-online",
        "stargazerCount": 3,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2025-06-28T21:45:30Z"
      },
      {
        "name": "BasicaoFullstack-Start",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/BasicaoFullstack-Start",
        "stargazerCount": 1,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3572A5",
          "name": "Python"
        },
        "updatedAt": "2025-06-28T20:39:07Z"
      },
      {
        "name": "AutoWabba",
        "description": "Automatic download helper for Wabbajack mod lists from Nexus Mods with Electron",
        "url": "https://github.com/LucasHenriqueDiniz/AutoWabba",
        "stargazerCount": 4,
        "forkCount": 0,
        "watchers": {
          "totalCount": 0
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2025-06-28T19:13:17Z"
      },
      {
        "name": "seuiot-new-design",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/seuiot-new-design",
        "stargazerCount": 1,
        "forkCount": 0,
        "watchers": {
          "totalCount": 0
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#e34c26",
          "name": "HTML"
        },
        "updatedAt": "2025-06-23T21:26:16Z"
      },
      {
        "name": "Mannco.Store-Enhancer",
        "description": "This extension aims to enhance your experience for the Mannco.store by providing various functionalities that connect, organize, and improve the platform. With our extension installed, you can enjoy an optimized and streamlined browsing experience on Mannco.store.",
        "url": "https://github.com/LucasHenriqueDiniz/Mannco.Store-Enhancer",
        "stargazerCount": 5,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2025-06-20T02:14:39Z"
      },
      {
        "name": "WeebProfile-old",
        "description": "A simple and customizable way to display code, anime, and music stats on your GitHub profile README.",
        "url": "https://github.com/LucasHenriqueDiniz/WeebProfile-old",
        "stargazerCount": 2,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3178c6",
          "name": "TypeScript"
        },
        "updatedAt": "2024-12-18T20:11:05Z"
      },
      {
        "name": "react-native-admob-starter",
        "description": "Fast start react native admob",
        "url": "https://github.com/LucasHenriqueDiniz/react-native-admob-starter",
        "stargazerCount": 1,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2024-12-10T22:19:43Z"
      },
      {
        "name": "WeebProfile-website",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/WeebProfile-website",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2024-10-17T23:50:43Z"
      },
      {
        "name": "Biblioteca-Augusto-Severo",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/Biblioteca-Augusto-Severo",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3572A5",
          "name": "Python"
        },
        "updatedAt": "2024-09-19T18:59:58Z"
      },
      {
        "name": "vercel-mal-app",
        "description": "\"\"",
        "url": "https://github.com/LucasHenriqueDiniz/vercel-mal-app",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3178c6",
          "name": "TypeScript"
        },
        "updatedAt": "2024-09-01T01:04:59Z"
      },
      {
        "name": "backpacktf-ws-service-cockroach-db",
        "description": "Builds a database of backpack.tf listings, automatically adding and deleting them from the public backpack.tf websocket. Uses CockroachDB",
        "url": "https://github.com/LucasHenriqueDiniz/backpacktf-ws-service-cockroach-db",
        "stargazerCount": 2,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#C1F12E",
          "name": "Batchfile"
        },
        "updatedAt": "2024-08-05T22:48:33Z"
      },
      {
        "name": "RandomCode",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/RandomCode",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3572A5",
          "name": "Python"
        },
        "updatedAt": "2024-06-18T18:52:52Z"
      },
      {
        "name": "TFTbot",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/TFTbot",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3572A5",
          "name": "Python"
        },
        "updatedAt": "2024-06-18T18:49:50Z"
      },
      {
        "name": "SteamGiftsAutoJoin",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/SteamGiftsAutoJoin",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#663399",
          "name": "CSS"
        },
        "updatedAt": "2024-06-18T18:46:17Z"
      },
      {
        "name": "OldSteamBot",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/OldSteamBot",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2024-06-18T18:45:22Z"
      },
      {
        "name": "Old-Random-Discord-Bot",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/Old-Random-Discord-Bot",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2024-06-18T18:36:19Z"
      },
      {
        "name": "open-all-buyorders-test",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/open-all-buyorders-test",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2024-05-21T22:25:00Z"
      },
      {
        "name": "basic-mannco-buyorder",
        "description": "+0.01 buy order button  ",
        "url": "https://github.com/LucasHenriqueDiniz/basic-mannco-buyorder",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2024-03-04T21:57:11Z"
      },
      {
        "name": "skoob-autojoin",
        "description": "Botao para entrar em todas as cortesias disponiveis no site Skoob",
        "url": "https://github.com/LucasHenriqueDiniz/skoob-autojoin",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2024-01-13T16:02:50Z"
      },
      {
        "name": "Auto-BuyOrder-button-for-ManncoStore",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/Auto-BuyOrder-button-for-ManncoStore",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2023-11-27T22:36:27Z"
      },
      {
        "name": "Mannco.Store-Giveaway_Enhancer",
        "description": "Mannco.Store Giveaway Enhancer is a browser extension that enhances the functionality of the giveaway pages on Mannco.Store. This extension adds several features to make it easier for users to join or leave giveaways, view all giveaways on one page, and keep track of which giveaways they have already joined.",
        "url": "https://github.com/LucasHenriqueDiniz/Mannco.Store-Giveaway_Enhancer",
        "stargazerCount": 1,
        "forkCount": 1,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2023-11-27T22:36:24Z"
      },
      {
        "name": "Mannco.Store-Item_Page_Enhancer",
        "description": "This extension enhances the item page of the mannco.store website by adding new functionalities and improvements. It provides a range of features that are designed to improve your browsing experience easier. With this extension, you can enjoy a more efficient and streamlined shopping experience on the Mannco Store website.",
        "url": "https://github.com/LucasHenriqueDiniz/Mannco.Store-Item_Page_Enhancer",
        "stargazerCount": 1,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2023-11-27T22:36:22Z"
      },
      {
        "name": "mannco.store-profile_enhancer",
        "description": "Add some functionalities to the profile page of the mannco.store",
        "url": "https://github.com/LucasHenriqueDiniz/mannco.store-profile_enhancer",
        "stargazerCount": 1,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2023-11-27T22:36:21Z"
      },
      {
        "name": "python-chatbot-test",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/python-chatbot-test",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3572A5",
          "name": "Python"
        },
        "updatedAt": "2023-09-21T22:49:05Z"
      },
      {
        "name": "Mannco.Store-Profit_Calculator_for_item_page",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/Mannco.Store-Profit_Calculator_for_item_page",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": null,
        "updatedAt": "2023-03-16T19:13:51Z"
      },
      {
        "name": "HypixelAutoSkipDaily",
        "description": "Auto skip daily video for ranked hypixel users",
        "url": "https://github.com/LucasHenriqueDiniz/HypixelAutoSkipDaily",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2022-12-07T06:51:32Z"
      },
      {
        "name": "Steam-stats-for-Mannco.Store",
        "description": "Some misc Extensions i made most of the time for personal use",
        "url": "https://github.com/LucasHenriqueDiniz/Steam-stats-for-Mannco.Store",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2022-10-28T16:22:35Z"
      },
      {
        "name": "LucasDiniz.github.io",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/LucasDiniz.github.io",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": null,
        "updatedAt": "2022-10-12T03:44:23Z"
      },
      {
        "name": "ListaDeExercicios-PythonBrasil",
        "description": "https://wiki.python.org.br/ListaDeExercicios",
        "url": "https://github.com/LucasHenriqueDiniz/ListaDeExercicios-PythonBrasil",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#3572A5",
          "name": "Python"
        },
        "updatedAt": "2022-08-12T03:47:27Z"
      },
      {
        "name": "CodeWars",
        "description": "Meus codicos de pateta para o CodeWars",
        "url": "https://github.com/LucasHenriqueDiniz/CodeWars",
        "stargazerCount": 0,
        "forkCount": 0,
        "watchers": {
          "totalCount": 1
        },
        "packages": {
          "totalCount": 0
        },
        "primaryLanguage": {
          "color": "#f1e05a",
          "name": "JavaScript"
        },
        "updatedAt": "2022-04-25T15:20:21Z"
      }
    ]
  },
  "languages": [
    {
      "name": "TypeScript",
      "color": "#3178c6",
      "size": 4388791
    },
    {
      "name": "JavaScript",
      "color": "#f1e05a",
      "size": 526015
    },
    {
      "name": "C#",
      "color": "#178600",
      "size": 490918
    },
    {
      "name": "CSS",
      "color": "#663399",
      "size": 321631
    },
    {
      "name": "Python",
      "color": "#3572A5",
      "size": 235364
    },
    {
      "name": "ShaderLab",
      "color": "#222c37",
      "size": 80492
    },
    {
      "name": "HTML",
      "color": "#e34c26",
      "size": 77706
    },
    {
      "name": "PLpgSQL",
      "color": "#336790",
      "size": 49740
    },
    {
      "name": "Rust",
      "color": "#dea584",
      "size": 19466
    },
    {
      "name": "HLSL",
      "color": "#aace60",
      "size": 13994
    },
    {
      "name": "Batchfile",
      "color": "#C1F12E",
      "size": 10787
    },
    {
      "name": "Kotlin",
      "color": "#A97BFF",
      "size": 4576
    },
    {
      "name": "Shell",
      "color": "#89e051",
      "size": 3531
    },
    {
      "name": "Objective-C++",
      "color": "#6866fb",
      "size": 2723
    },
    {
      "name": "Ruby",
      "color": "#701516",
      "size": 2613
    },
    {
      "name": "Mako",
      "color": "#7e858d",
      "size": 1482
    },
    {
      "name": "Lua",
      "color": "#000080",
      "size": 611
    },
    {
      "name": "Objective-C",
      "color": "#438eff",
      "size": 327
    },
    {
      "name": "Dockerfile",
      "color": "#384d54",
      "size": 282
    },
    {
      "name": "Swift",
      "color": "#F05138",
      "size": 113
    },
    {
      "name": "C",
      "color": "#555555",
      "size": 103
    },
    {
      "name": "SCSS",
      "color": "#c6538c",
      "size": 62
    }
  ],
  "favoriteLicense": {
    "name": "MIT License",
    "count": 14,
    "total": 48
  },
  "calendar": {
    "totalContributions": 844,
    "weeks": [
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-01",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-02",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-03",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-04",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-05",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-06",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-07",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-08",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-09",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-01-10",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-11",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-12",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-01-13",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-14",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-15",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-16",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-17",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-18",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-19",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-20",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-21",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-22",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-23",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-24",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-25",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-26",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-27",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-28",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-29",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-30",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-01-31",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-01",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-02",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-03",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-04",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-05",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-06",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-07",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-08",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-09",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-10",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-11",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-12",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-13",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-14",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-15",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-16",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-17",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-18",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-19",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-20",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-21",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-22",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-23",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-24",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-25",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-26",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-27",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-02-28",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-01",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-02",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-03",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-04",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-05",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-06",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-07",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-08",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-09",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-10",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-11",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-12",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-13",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-14",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-15",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-16",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-17",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-18",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-19",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-20",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-21",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-22",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-23",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-03-24",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-25",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-26",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-03-27",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-03-28",
            "weekday": 5
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-03-29",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-03-30",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-03-31",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-04-01",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-04-02",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-04-03",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-04-04",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-04-05",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-04-06",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-04-07",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-04-08",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-04-09",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-04-10",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-04-11",
            "weekday": 5
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-04-12",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-04-13",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-04-14",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-04-15",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-04-16",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-04-17",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-04-18",
            "weekday": 5
          },
          {
            "color": "#216e39",
            "contributionCount": 22,
            "date": "2025-04-19",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#9be9a8",
            "contributionCount": 5,
            "date": "2025-04-20",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-04-21",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-04-22",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-04-23",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-04-24",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-04-25",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-04-26",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-04-27",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-04-28",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-04-29",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-04-30",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 5,
            "date": "2025-05-01",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 5,
            "date": "2025-05-02",
            "weekday": 5
          },
          {
            "color": "#40c463",
            "contributionCount": 6,
            "date": "2025-05-03",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#40c463",
            "contributionCount": 7,
            "date": "2025-05-04",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-05",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-05-06",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-07",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-08",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-05-09",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-10",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-11",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-05-12",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-13",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-05-14",
            "weekday": 3
          },
          {
            "color": "#40c463",
            "contributionCount": 6,
            "date": "2025-05-15",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-05-16",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-17",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-18",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-05-19",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-20",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-05-21",
            "weekday": 3
          },
          {
            "color": "#40c463",
            "contributionCount": 6,
            "date": "2025-05-22",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-23",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-24",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-25",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-05-26",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-05-27",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-28",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-05-29",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-30",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-05-31",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-06-01",
            "weekday": 0
          },
          {
            "color": "#40c463",
            "contributionCount": 7,
            "date": "2025-06-02",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-06-03",
            "weekday": 2
          },
          {
            "color": "#40c463",
            "contributionCount": 8,
            "date": "2025-06-04",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-06-05",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-06-06",
            "weekday": 5
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-06-07",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#9be9a8",
            "contributionCount": 3,
            "date": "2025-06-08",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 5,
            "date": "2025-06-09",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-06-10",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-06-11",
            "weekday": 3
          },
          {
            "color": "#40c463",
            "contributionCount": 8,
            "date": "2025-06-12",
            "weekday": 4
          },
          {
            "color": "#30a14e",
            "contributionCount": 14,
            "date": "2025-06-13",
            "weekday": 5
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-06-14",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-06-15",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-06-16",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-06-17",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-06-18",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-06-19",
            "weekday": 4
          },
          {
            "color": "#216e39",
            "contributionCount": 21,
            "date": "2025-06-20",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-06-21",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-06-22",
            "weekday": 0
          },
          {
            "color": "#216e39",
            "contributionCount": 19,
            "date": "2025-06-23",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-06-24",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-06-25",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-06-26",
            "weekday": 4
          },
          {
            "color": "#40c463",
            "contributionCount": 6,
            "date": "2025-06-27",
            "weekday": 5
          },
          {
            "color": "#216e39",
            "contributionCount": 17,
            "date": "2025-06-28",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#40c463",
            "contributionCount": 8,
            "date": "2025-06-29",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-06-30",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-07-01",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-07-02",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-07-03",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-07-04",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-07-05",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-07-06",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 5,
            "date": "2025-07-07",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-07-08",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-07-09",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-07-10",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 3,
            "date": "2025-07-11",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-07-12",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-07-13",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-07-14",
            "weekday": 1
          },
          {
            "color": "#40c463",
            "contributionCount": 9,
            "date": "2025-07-15",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-07-16",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-07-17",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-07-18",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-07-19",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-07-20",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-07-21",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-07-22",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-07-23",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-07-24",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-07-25",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-07-26",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-07-27",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-07-28",
            "weekday": 1
          },
          {
            "color": "#40c463",
            "contributionCount": 6,
            "date": "2025-07-29",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 5,
            "date": "2025-07-30",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-07-31",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-08-01",
            "weekday": 5
          },
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-08-02",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#40c463",
            "contributionCount": 7,
            "date": "2025-08-03",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 5,
            "date": "2025-08-04",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-08-05",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-08-06",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-08-07",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-08-08",
            "weekday": 5
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-08-09",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-08-10",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-08-11",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-08-12",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-08-13",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-08-14",
            "weekday": 4
          },
          {
            "color": "#40c463",
            "contributionCount": 8,
            "date": "2025-08-15",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-08-16",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-08-17",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-08-18",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-08-19",
            "weekday": 2
          },
          {
            "color": "#40c463",
            "contributionCount": 7,
            "date": "2025-08-20",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-08-21",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-08-22",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-08-23",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-08-24",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-08-25",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 5,
            "date": "2025-08-26",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-08-27",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 5,
            "date": "2025-08-28",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-08-29",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-08-30",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-08-31",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-09-01",
            "weekday": 1
          },
          {
            "color": "#40c463",
            "contributionCount": 10,
            "date": "2025-09-02",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-09-03",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-09-04",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-09-05",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-09-06",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#9be9a8",
            "contributionCount": 3,
            "date": "2025-09-07",
            "weekday": 0
          },
          {
            "color": "#40c463",
            "contributionCount": 6,
            "date": "2025-09-08",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-09-09",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-09-10",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-09-11",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-09-12",
            "weekday": 5
          },
          {
            "color": "#30a14e",
            "contributionCount": 15,
            "date": "2025-09-13",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#216e39",
            "contributionCount": 55,
            "date": "2025-09-14",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-09-15",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-09-16",
            "weekday": 2
          },
          {
            "color": "#216e39",
            "contributionCount": 17,
            "date": "2025-09-17",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-09-18",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-09-19",
            "weekday": 5
          },
          {
            "color": "#216e39",
            "contributionCount": 68,
            "date": "2025-09-20",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#216e39",
            "contributionCount": 75,
            "date": "2025-09-21",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-09-22",
            "weekday": 1
          },
          {
            "color": "#40c463",
            "contributionCount": 8,
            "date": "2025-09-23",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 3,
            "date": "2025-09-24",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-09-25",
            "weekday": 4
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-09-26",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-09-27",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#216e39",
            "contributionCount": 22,
            "date": "2025-09-28",
            "weekday": 0
          },
          {
            "color": "#40c463",
            "contributionCount": 9,
            "date": "2025-09-29",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-09-30",
            "weekday": 2
          },
          {
            "color": "#40c463",
            "contributionCount": 10,
            "date": "2025-10-01",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-10-02",
            "weekday": 4
          },
          {
            "color": "#40c463",
            "contributionCount": 7,
            "date": "2025-10-03",
            "weekday": 5
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-10-04",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-10-05",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-10-06",
            "weekday": 1
          },
          {
            "color": "#40c463",
            "contributionCount": 7,
            "date": "2025-10-07",
            "weekday": 2
          },
          {
            "color": "#30a14e",
            "contributionCount": 14,
            "date": "2025-10-08",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-10-09",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-10-10",
            "weekday": 5
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-10-11",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-10-12",
            "weekday": 0
          },
          {
            "color": "#40c463",
            "contributionCount": 10,
            "date": "2025-10-13",
            "weekday": 1
          },
          {
            "color": "#40c463",
            "contributionCount": 9,
            "date": "2025-10-14",
            "weekday": 2
          },
          {
            "color": "#216e39",
            "contributionCount": 19,
            "date": "2025-10-15",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 3,
            "date": "2025-10-16",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-10-17",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-10-18",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-10-19",
            "weekday": 0
          },
          {
            "color": "#40c463",
            "contributionCount": 6,
            "date": "2025-10-20",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-10-21",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 3,
            "date": "2025-10-22",
            "weekday": 3
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-10-23",
            "weekday": 4
          },
          {
            "color": "#40c463",
            "contributionCount": 11,
            "date": "2025-10-24",
            "weekday": 5
          },
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-10-25",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#9be9a8",
            "contributionCount": 2,
            "date": "2025-10-26",
            "weekday": 0
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-10-27",
            "weekday": 1
          },
          {
            "color": "#40c463",
            "contributionCount": 8,
            "date": "2025-10-28",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-10-29",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-10-30",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-10-31",
            "weekday": 5
          },
          {
            "color": "#9be9a8",
            "contributionCount": 4,
            "date": "2025-11-01",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-02",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-03",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-04",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 3,
            "date": "2025-11-05",
            "weekday": 3
          },
          {
            "color": "#40c463",
            "contributionCount": 8,
            "date": "2025-11-06",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-07",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-08",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-09",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-10",
            "weekday": 1
          },
          {
            "color": "#9be9a8",
            "contributionCount": 1,
            "date": "2025-11-11",
            "weekday": 2
          },
          {
            "color": "#9be9a8",
            "contributionCount": 5,
            "date": "2025-11-12",
            "weekday": 3
          },
          {
            "color": "#30a14e",
            "contributionCount": 14,
            "date": "2025-11-13",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-14",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-15",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-16",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-17",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-18",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-19",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-20",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-21",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-22",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-23",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-24",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-25",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-26",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-27",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-28",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-29",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-11-30",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-01",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-02",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-03",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-04",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-05",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-06",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-07",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-08",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-09",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-10",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-11",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-12",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-13",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-14",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-15",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-16",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-17",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-18",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-19",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-20",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-21",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-22",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-23",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-24",
            "weekday": 3
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-25",
            "weekday": 4
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-26",
            "weekday": 5
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-27",
            "weekday": 6
          }
        ]
      },
      {
        "contributionDays": [
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-28",
            "weekday": 0
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-29",
            "weekday": 1
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-30",
            "weekday": 2
          },
          {
            "color": "#ebedf0",
            "contributionCount": 0,
            "date": "2025-12-31",
            "weekday": 3
          }
        ]
      }
    ]
  },
  "codeHabits": {
    "commitsByHour": {
      "1": 1,
      "2": 1,
      "3": 2,
      "4": 1,
      "14": 2,
      "15": 2,
      "17": 1,
      "19": 2,
      "20": 7,
      "21": 1,
      "22": 2
    },
    "commitsByDay": {
      "Thursday": 14,
      "Wednesday": 4,
      "Saturday": 4
    },
    "languages": {},
    "commitStats": {
      "averageChangesPerCommit": 0,
      "totalFilesChanged": 0,
      "largestCommit": 0
    },
    "analyzedCommits": 22
  },
  "starredRepositories": {
    "totalCount": 70,
    "nodes": [
      {
        "name": "CharmingKitten",
        "nameWithOwner": "KittenBusters/CharmingKitten",
        "description": "Exposing CharmingKitten's malicious activity for IRGC-IO  Counterintelligence division (1500)",
        "url": "https://github.com/KittenBusters/CharmingKitten",
        "stargazerCount": 378,
        "forkCount": 86,
        "primaryLanguage": {
          "name": "C#",
          "color": "#178600"
        },
        "updatedAt": "2025-11-20T21:38:26Z"
      },
      {
        "name": "vscode-context-tools",
        "nameWithOwner": "LucasHenriqueDiniz/vscode-context-tools",
        "description": "Copy current file/selection/open editors as fenced blocks, project tree, and diagnostics (Problems). Optimized for pasting into LLM/chat.",
        "url": "https://github.com/LucasHenriqueDiniz/vscode-context-tools",
        "stargazerCount": 1,
        "forkCount": 0,
        "primaryLanguage": {
          "name": "TypeScript",
          "color": "#3178c6"
        },
        "updatedAt": "2025-09-09T04:09:33Z"
      },
      {
        "name": "Win11Debloat",
        "nameWithOwner": "Raphire/Win11Debloat",
        "description": "A simple, lightweight PowerShell script to remove pre-installed apps, disable telemetry, as well as perform various other changes to customize, declutter and improve your Windows experience. Win11Debloat works for both Windows 10 and Windows 11.",
        "url": "https://github.com/Raphire/Win11Debloat",
        "stargazerCount": 33351,
        "forkCount": 1305,
        "primaryLanguage": {
          "name": "PowerShell",
          "color": "#012456"
        },
        "updatedAt": "2025-11-21T02:35:54Z"
      },
      {
        "name": "fastsqs",
        "nameWithOwner": "lafayettegabe/fastsqs",
        "description": "📨 Fast and modern SQS routing and middleware for Python.",
        "url": "https://github.com/lafayettegabe/fastsqs",
        "stargazerCount": 2,
        "forkCount": 1,
        "primaryLanguage": {
          "name": "Python",
          "color": "#3572A5"
        },
        "updatedAt": "2025-11-01T18:47:48Z"
      },
      {
        "name": "vscodium",
        "nameWithOwner": "VSCodium/vscodium",
        "description": "binary releases of VS Code without MS branding/telemetry/licensing",
        "url": "https://github.com/VSCodium/vscodium",
        "stargazerCount": 29178,
        "forkCount": 1472,
        "primaryLanguage": {
          "name": "Shell",
          "color": "#89e051"
        },
        "updatedAt": "2025-11-20T22:18:32Z"
      },
      {
        "name": "bs-manager",
        "nameWithOwner": "Zagrios/bs-manager",
        "description": "An all-in-one tool that lets you easly manage BeatSaber versions, maps, mods, and even more.",
        "url": "https://github.com/Zagrios/bs-manager",
        "stargazerCount": 927,
        "forkCount": 73,
        "primaryLanguage": {
          "name": "TypeScript",
          "color": "#3178c6"
        },
        "updatedAt": "2025-11-21T00:33:28Z"
      },
      {
        "name": "openspades",
        "nameWithOwner": "BuildandShoot/openspades",
        "description": "Compatible client of Ace of Spades 0.75",
        "url": "https://github.com/BuildandShoot/openspades",
        "stargazerCount": 13,
        "forkCount": 1,
        "primaryLanguage": {
          "name": "C++",
          "color": "#f34b7d"
        },
        "updatedAt": "2025-10-09T02:38:55Z"
      },
      {
        "name": "obsidian-react-components",
        "nameWithOwner": "elias-sundqvist/obsidian-react-components",
        "description": "Write and use React (Jsx) components in your Obsidian notes.",
        "url": "https://github.com/elias-sundqvist/obsidian-react-components",
        "stargazerCount": 278,
        "forkCount": 20,
        "primaryLanguage": {
          "name": "TypeScript",
          "color": "#3178c6"
        },
        "updatedAt": "2025-11-19T11:24:03Z"
      },
      {
        "name": "elk-deploy",
        "nameWithOwner": "lafayettegabe/elk-deploy",
        "description": "🦌 One-command Terraform stack that deploys single-node ELK + Fleet/APM on AWS, fronted by an ALB with custom domain and HTTPS",
        "url": "https://github.com/lafayettegabe/elk-deploy",
        "stargazerCount": 4,
        "forkCount": 1,
        "primaryLanguage": {
          "name": "HCL",
          "color": "#844FBA"
        },
        "updatedAt": "2025-07-18T06:51:08Z"
      },
      {
        "name": "CubismWebSamples",
        "nameWithOwner": "Live2D/CubismWebSamples",
        "description": null,
        "url": "https://github.com/Live2D/CubismWebSamples",
        "stargazerCount": 352,
        "forkCount": 110,
        "primaryLanguage": null,
        "updatedAt": "2025-11-17T07:09:22Z"
      },
      {
        "name": "CubismWebFramework",
        "nameWithOwner": "Live2D/CubismWebFramework",
        "description": null,
        "url": "https://github.com/Live2D/CubismWebFramework",
        "stargazerCount": 211,
        "forkCount": 43,
        "primaryLanguage": {
          "name": "TypeScript",
          "color": "#3178c6"
        },
        "updatedAt": "2025-10-29T03:17:46Z"
      },
      {
        "name": "pixi-live2d-display",
        "nameWithOwner": "guansss/pixi-live2d-display",
        "description": "A PixiJS plugin to display Live2D models of any kind.",
        "url": "https://github.com/guansss/pixi-live2d-display",
        "stargazerCount": 1283,
        "forkCount": 191,
        "primaryLanguage": {
          "name": "TypeScript",
          "color": "#3178c6"
        },
        "updatedAt": "2025-11-20T12:26:00Z"
      },
      {
        "name": "tf2autobot",
        "nameWithOwner": "TF2Autobot/tf2autobot",
        "description": "tf2autobot: an Improved version from tf2-automatic",
        "url": "https://github.com/TF2Autobot/tf2autobot",
        "stargazerCount": 251,
        "forkCount": 85,
        "primaryLanguage": {
          "name": "TypeScript",
          "color": "#3178c6"
        },
        "updatedAt": "2025-11-01T12:51:18Z"
      },
      {
        "name": "BasicaoFullstack-Start",
        "nameWithOwner": "LucasHenriqueDiniz/BasicaoFullstack-Start",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/BasicaoFullstack-Start",
        "stargazerCount": 1,
        "forkCount": 0,
        "primaryLanguage": {
          "name": "Python",
          "color": "#3572A5"
        },
        "updatedAt": "2025-06-28T20:39:07Z"
      },
      {
        "name": "lucashdo",
        "nameWithOwner": "LucasHenriqueDiniz/lucashdo",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/lucashdo",
        "stargazerCount": 4,
        "forkCount": 0,
        "primaryLanguage": {
          "name": "TypeScript",
          "color": "#3178c6"
        },
        "updatedAt": "2025-11-13T20:52:25Z"
      },
      {
        "name": "seuiot-new-design",
        "nameWithOwner": "LucasHenriqueDiniz/seuiot-new-design",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/seuiot-new-design",
        "stargazerCount": 1,
        "forkCount": 0,
        "primaryLanguage": {
          "name": "TypeScript",
          "color": "#3178c6"
        },
        "updatedAt": "2025-06-23T21:26:16Z"
      },
      {
        "name": "windowx-xp-online",
        "nameWithOwner": "LucasHenriqueDiniz/windowx-xp-online",
        "description": null,
        "url": "https://github.com/LucasHenriqueDiniz/windowx-xp-online",
        "stargazerCount": 3,
        "forkCount": 0,
        "primaryLanguage": {
          "name": "TypeScript",
          "color": "#3178c6"
        },
        "updatedAt": "2025-06-28T21:45:30Z"
      },
      {
        "name": "AutoWabba",
        "nameWithOwner": "LucasHenriqueDiniz/AutoWabba",
        "description": "Automatic download helper for Wabbajack mod lists from Nexus Mods with Electron",
        "url": "https://github.com/LucasHenriqueDiniz/AutoWabba",
        "stargazerCount": 4,
        "forkCount": 0,
        "primaryLanguage": {
          "name": "JavaScript",
          "color": "#f1e05a"
        },
        "updatedAt": "2025-06-28T19:13:17Z"
      },
      {
        "name": "siot-web-flasher",
        "nameWithOwner": "LucasHenriqueDiniz/siot-web-flasher",
        "description": "Instalação de firmware e monitoramento serial para ESP32/ESP8266 via navegador web",
        "url": "https://github.com/LucasHenriqueDiniz/siot-web-flasher",
        "stargazerCount": 5,
        "forkCount": 0,
        "primaryLanguage": {
          "name": "TypeScript",
          "color": "#3178c6"
        },
        "updatedAt": "2025-07-04T23:33:01Z"
      },
      {
        "name": "brave-browser",
        "nameWithOwner": "brave/brave-browser",
        "description": "Brave browser for Android, iOS, Linux, macOS, Windows.",
        "url": "https://github.com/brave/brave-browser",
        "stargazerCount": 20719,
        "forkCount": 2840,
        "primaryLanguage": {
          "name": "JavaScript",
          "color": "#f1e05a"
        },
        "updatedAt": "2025-11-21T01:38:24Z"
      }
    ]
  },
  "topRepositories": [
    {
      "name": "weeb-profile",
      "nameWithOwner": "LucasHenriqueDiniz/weeb-profile",
      "description": "Dynamic SVG generator for GitHub profiles with support for multiple plugins",
      "url": "https://github.com/LucasHenriqueDiniz/weeb-profile",
      "stargazerCount": 450,
      "forkCount": 32,
      "primaryLanguage": {
        "name": "TypeScript",
        "color": "#3178c6"
      },
      "updatedAt": "2025-01-15T10:30:00Z"
    },
    {
      "name": "awesome-project",
      "nameWithOwner": "LucasHenriqueDiniz/awesome-project",
      "description": "A collection of awesome resources and tools for developers",
      "url": "https://github.com/LucasHenriqueDiniz/awesome-project",
      "stargazerCount": 320,
      "forkCount": 45,
      "primaryLanguage": {
        "name": "JavaScript",
        "color": "#f1e05a"
      },
      "updatedAt": "2025-01-14T15:20:00Z"
    },
    {
      "name": "react-components",
      "nameWithOwner": "LucasHenriqueDiniz/react-components",
      "description": "Reusable React components library with TypeScript support",
      "url": "https://github.com/LucasHenriqueDiniz/react-components",
      "stargazerCount": 280,
      "forkCount": 28,
      "primaryLanguage": {
        "name": "TypeScript",
        "color": "#3178c6"
      },
      "updatedAt": "2025-01-13T09:15:00Z"
    },
    {
      "name": "typescript-utils",
      "nameWithOwner": "LucasHenriqueDiniz/typescript-utils",
      "description": "Utility functions and helpers for TypeScript projects",
      "url": "https://github.com/LucasHenriqueDiniz/typescript-utils",
      "stargazerCount": 150,
      "forkCount": 12,
      "primaryLanguage": {
        "name": "TypeScript",
        "color": "#3178c6"
      },
      "updatedAt": "2025-01-12T14:45:00Z"
    },
    {
      "name": "node-api",
      "nameWithOwner": "LucasHenriqueDiniz/node-api",
      "description": "RESTful API built with Node.js and Express",
      "url": "https://github.com/LucasHenriqueDiniz/node-api",
      "stargazerCount": 50,
      "forkCount": 8,
      "primaryLanguage": {
        "name": "JavaScript",
        "color": "#f1e05a"
      },
      "updatedAt": "2025-01-11T11:30:00Z"
    }
  ],
  "stargazers": {
    "totalCount": 1250,
    "repositories": [
      {
        "name": "weeb-profile",
        "stargazerCount": 450
      },
      {
        "name": "awesome-project",
        "stargazerCount": 320
      },
      {
        "name": "react-components",
        "stargazerCount": 280
      },
      {
        "name": "typescript-utils",
        "stargazerCount": 150
      },
      {
        "name": "node-api",
        "stargazerCount": 50
      }
    ]
  },
  "gists": {
    "totalCount": 3,
    "nodes": [
      {
        "name": "Github.svg",
        "description": "Github Profile Charts",
        "url": "https://gist.github.com/LucasHenriqueDiniz/8aacc3d1ccca110d8358e35517d8fe40",
        "files": [
          {
            "name": "Github.svg",
            "language": "SVG"
          },
          {
            "name": "LastFM.svg",
            "language": "SVG"
          },
          {
            "name": "MyAnimeList.svg",
            "language": "SVG"
          }
        ],
        "updatedAt": "2025-11-13T01:40:13Z",
        "stargazerCount": 0
      },
      {
        "name": "myanimelist_data",
        "description": "🌸 Anime & Manga Statistics",
        "url": "https://gist.github.com/LucasHenriqueDiniz/125444fda309e79f7f2aaa1ced3896a5",
        "files": [
          {
            "name": "myanimelist_data",
            "language": null
          },
          {
            "name": "🌸 Last Updated Animes",
            "language": null
          }
        ],
        "updatedAt": "2024-10-18T01:42:14Z",
        "stargazerCount": 0
      },
      {
        "name": "myanimelist_data",
        "description": "🌸 Last Updated Animes & Mangas",
        "url": "https://gist.github.com/LucasHenriqueDiniz/0e8c5e44d2d3e58f0a62ff64169559d3",
        "files": [
          {
            "name": "myanimelist_data",
            "language": null
          },
          {
            "name": "test.svg",
            "language": "SVG"
          },
          {
            "name": "🌸 Anime & Manga Statistics",
            "language": null
          },
          {
            "name": "🌸 Last Updated Mangas",
            "language": null
          }
        ],
        "updatedAt": "2024-10-18T01:42:09Z",
        "stargazerCount": 0
      }
    ]
  },
  "introduction": {
    "bio": "lucashdo@protonmail.com",
    "location": "Brasil",
    "company": "Looking for work",
    "websiteUrl": "www.lucashdo.com"
  },
  "recentActivity": [
    {
      "type": "merged",
      "title": "#106 fix import in xml bench",
      "repository": "lowlighter/libs",
      "url": "https://github.com/lowlighter/libs/pull/106",
      "date": "2025-01-15T10:30:00Z",
      "filesChanged": {
        "files": 2,
        "additions": 45,
        "deletions": 12
      }
    },
    {
      "type": "branch",
      "title": "feature/add-new-component",
      "repository": "LucasHenriqueDiniz/weeb-profile",
      "url": "https://github.com/LucasHenriqueDiniz/weeb-profile/tree/feature/add-new-component",
      "date": "2025-01-14T15:20:00Z"
    },
    {
      "type": "pr",
      "title": "#106 fix import in xml bench",
      "repository": "lowlighter/libs",
      "url": "https://github.com/lowlighter/libs/pull/106",
      "date": "2025-01-13T09:15:00Z",
      "filesChanged": {
        "files": 2,
        "additions": 45,
        "deletions": 12
      }
    },
    {
      "type": "branch",
      "title": "fix/update-dependencies",
      "repository": "LucasHenriqueDiniz/react-components",
      "url": "https://github.com/LucasHenriqueDiniz/react-components/tree/fix/update-dependencies",
      "date": "2025-01-12T14:45:00Z"
    },
    {
      "type": "branch",
      "title": "chore/refactor-utils",
      "repository": "LucasHenriqueDiniz/typescript-utils",
      "url": "https://github.com/LucasHenriqueDiniz/typescript-utils/tree/chore/refactor-utils",
      "date": "2025-01-11T11:30:00Z"
    },
    {
      "type": "commit",
      "title": "163 commits",
      "repository": "LucasHenriqueDiniz/tavern-sim-test",
      "url": "https://github.com/LucasHenriqueDiniz/tavern-sim-test",
      "date": "2025-01-10T08:00:00Z",
      "filesChanged": {
        "files": 15,
        "additions": 320,
        "deletions": 89
      }
    },
    {
      "type": "commit",
      "title": "129 commits",
      "repository": "LucasHenriqueDiniz/lucashdo",
      "url": "https://github.com/LucasHenriqueDiniz/lucashdo",
      "date": "2025-01-09T16:20:00Z",
      "filesChanged": {
        "files": 8,
        "additions": 156,
        "deletions": 43
      }
    },
    {
      "type": "commit",
      "title": "26 commits",
      "repository": "LucasHenriqueDiniz/cron-item-watcher",
      "url": "https://github.com/LucasHenriqueDiniz/cron-item-watcher",
      "date": "2025-01-08T12:10:00Z",
      "filesChanged": {
        "files": 3,
        "additions": 67,
        "deletions": 5
      }
    },
    {
      "type": "commit",
      "title": "21 commits",
      "repository": "LucasHenriqueDiniz/windowx-xp-online",
      "url": "https://github.com/LucasHenriqueDiniz/windowx-xp-online",
      "date": "2025-11-21T03:13:01.997Z"
    },
    {
      "type": "commit",
      "title": "21 commits",
      "repository": "LucasHenriqueDiniz/AutoWabba",
      "url": "https://github.com/LucasHenriqueDiniz/AutoWabba",
      "date": "2025-11-21T03:13:01.997Z"
    },
    {
      "type": "commit",
      "title": "16 commits",
      "repository": "include-gurias/includegurias-website",
      "url": "https://github.com/include-gurias/includegurias-website",
      "date": "2025-11-21T03:13:01.997Z"
    },
    {
      "type": "commit",
      "title": "13 commits",
      "repository": "LucasHenriqueDiniz/siot-web-flasher",
      "url": "https://github.com/LucasHenriqueDiniz/siot-web-flasher",
      "date": "2025-11-21T03:13:01.997Z"
    },
    {
      "type": "commit",
      "title": "12 commits",
      "repository": "LucasHenriqueDiniz/WeebProfile",
      "url": "https://github.com/LucasHenriqueDiniz/WeebProfile",
      "date": "2025-11-21T03:13:01.997Z"
    },
    {
      "type": "commit",
      "title": "10 commits",
      "repository": "LucasHenriqueDiniz/LucasHenriqueDiniz",
      "url": "https://github.com/LucasHenriqueDiniz/LucasHenriqueDiniz",
      "date": "2025-11-21T03:13:01.997Z"
    },
    {
      "type": "commit",
      "title": "9 commits",
      "repository": "LucasHenriqueDiniz/react-native-admob-starter",
      "url": "https://github.com/LucasHenriqueDiniz/react-native-admob-starter",
      "date": "2025-11-21T03:13:01.997Z"
    }
  ],
  "sponsorships": {
    "totalCount": 3,
    "nodes": [
      {
        "sponsorable": {
          "login": "LucasHenriqueDiniz",
          "name": "Lucas Henrique Diniz",
          "avatarUrl": "https://avatars.githubusercontent.com/u/63087780"
        },
        "tier": {
          "name": "Tier 1",
          "monthlyPriceInDollars": 100
        }
      },
      {
        "sponsorable": {
          "login": "LucasHenriqueDiniz",
          "name": "Lucas Henrique Diniz",
          "avatarUrl": "https://avatars.githubusercontent.com/u/63087780"
        },
        "tier": {
          "name": "Tier 1",
          "monthlyPriceInDollars": 100
        }
      },
      {
        "sponsorable": {
          "login": "LucasHenriqueDiniz",
          "name": "Lucas Henrique Diniz",
          "avatarUrl": "https://avatars.githubusercontent.com/u/63087780"
        },
        "tier": {
          "name": "Tier 1",
          "monthlyPriceInDollars": 100
        }
      },
    ]
  },
  "sponsors": {
    "totalCount": 3,
    "nodes": [
      {
        "login": "LucasHenriqueDiniz",
        "name": "Lucas Henrique Diniz",
        "avatarUrl": "https://avatars.githubusercontent.com/u/63087780",
        "tier": {
          "name": "Tier 1",
          "monthlyPriceInDollars": 100
        }
      },
      
      {
        "login": "LucasHenriqueDiniz",
        "name": "Lucas Henrique Diniz",
        "avatarUrl": "https://avatars.githubusercontent.com/u/63087780",
        "tier": {
          "name": "Tier 1",
          "monthlyPriceInDollars": 100
        }
      },
      
      {
        "login": "LucasHenriqueDiniz",
        "name": "Lucas Henrique Diniz",
        "avatarUrl": "https://avatars.githubusercontent.com/u/63087780",
        "tier": {
          "name": "Tier 1",
          "monthlyPriceInDollars": 100
        }
      },
    ]
  },
  "starLists": [
    {
      "name": "Frontend Tools",
      "description": "Useful frontend development tools and libraries",
      "repositories": [
        {
          "name": "react",
          "nameWithOwner": "facebook/react",
          "url": "https://github.com/facebook/react",
          "stargazerCount": 220000
        },
        {
          "name": "next.js",
          "nameWithOwner": "vercel/next.js",
          "url": "https://github.com/vercel/next.js",
          "stargazerCount": 120000
        },
        {
          "name": "tailwindcss",
          "nameWithOwner": "tailwindlabs/tailwindcss",
          "url": "https://github.com/tailwindlabs/tailwindcss",
          "stargazerCount": 80000
        }
      ]
    },
    {
      "name": "Backend Frameworks",
      "description": "Backend frameworks and libraries",
      "repositories": [
        {
          "name": "node",
          "nameWithOwner": "nodejs/node",
          "url": "https://github.com/nodejs/node",
          "stargazerCount": 110000
        },
        {
          "name": "express",
          "nameWithOwner": "expressjs/express",
          "url": "https://github.com/expressjs/express",
          "stargazerCount": 65000
        }
      ]
    }
  ],
  "notableContributions": [
    {
      "repository": "LucasHenriqueDiniz/tavern-sim-test",
      "repositoryUrl": "https://github.com/LucasHenriqueDiniz/tavern-sim-test",
      "contributions": 163,
      "type": "commits"
    },
    {
      "repository": "LucasHenriqueDiniz/lucashdo",
      "repositoryUrl": "https://github.com/LucasHenriqueDiniz/lucashdo",
      "contributions": 129,
      "type": "commits"
    },
    {
      "repository": "LucasHenriqueDiniz/cron-item-watcher",
      "repositoryUrl": "https://github.com/LucasHenriqueDiniz/cron-item-watcher",
      "contributions": 26,
      "type": "commits"
    },
    {
      "repository": "LucasHenriqueDiniz/windowx-xp-online",
      "repositoryUrl": "https://github.com/LucasHenriqueDiniz/windowx-xp-online",
      "contributions": 21,
      "type": "commits"
    },
    {
      "repository": "LucasHenriqueDiniz/AutoWabba",
      "repositoryUrl": "https://github.com/LucasHenriqueDiniz/AutoWabba",
      "contributions": 21,
      "type": "commits"
    },
    {
      "repository": "include-gurias/includegurias-website",
      "repositoryUrl": "https://github.com/include-gurias/includegurias-website",
      "contributions": 16,
      "type": "commits"
    },
    {
      "repository": "LucasHenriqueDiniz/siot-web-flasher",
      "repositoryUrl": "https://github.com/LucasHenriqueDiniz/siot-web-flasher",
      "contributions": 13,
      "type": "commits"
    },
    {
      "repository": "LucasHenriqueDiniz/WeebProfile",
      "repositoryUrl": "https://github.com/LucasHenriqueDiniz/WeebProfile",
      "contributions": 12,
      "type": "commits"
    },
    {
      "repository": "LucasHenriqueDiniz/LucasHenriqueDiniz",
      "repositoryUrl": "https://github.com/LucasHenriqueDiniz/LucasHenriqueDiniz",
      "contributions": 10,
      "type": "commits"
    },
    {
      "repository": "LucasHenriqueDiniz/react-native-admob-starter",
      "repositoryUrl": "https://github.com/LucasHenriqueDiniz/react-native-admob-starter",
      "contributions": 9,
      "type": "commits"
    }
  ],
  "featuredRepositories": [
    {
      "name": "WeebProfile",
      "nameWithOwner": "LucasHenriqueDiniz/WeebProfile",
      "description": "Dynamic SVG generator for GitHub profiles with support for multiple plugins (GitHub, LastFM, MyAnimeList) and customizable themes. Generate beautiful profile cards with real-time data.",
      "url": "https://github.com/LucasHenriqueDiniz/WeebProfile",
      "createdAt": "2024-01-15T10:00:00Z",
      "stargazerCount": 1250,
      "forkCount": 89,
      "issuesCount": 15,
      "pullRequestsCount": 12,
      "primaryLanguage": {
        "name": "TypeScript",
        "color": "#3178c6"
      },
      "license": {
        "name": "MIT License",
        "spdxId": "MIT"
      }
    },
    {
      "name": "react-components",
      "nameWithOwner": "LucasHenriqueDiniz/react-components",
      "description": "Reusable React components library with TypeScript support, comprehensive documentation, and Storybook integration",
      "url": "https://github.com/LucasHenriqueDiniz/react-components",
      "createdAt": "2023-08-20T14:30:00Z",
      "stargazerCount": 280,
      "forkCount": 28,
      "issuesCount": 5,
      "pullRequestsCount": 3,
      "primaryLanguage": {
        "name": "TypeScript",
        "color": "#3178c6"
      },
      "license": {
        "name": "MIT License",
        "spdxId": "MIT"
      }
    },
    {
      "name": "typescript-utils",
      "nameWithOwner": "LucasHenriqueDiniz/typescript-utils",
      "description": "Collection of utility functions and helpers for TypeScript projects. Includes type guards, formatters, validators, and more.",
      "url": "https://github.com/LucasHenriqueDiniz/typescript-utils",
      "createdAt": "2023-05-10T09:15:00Z",
      "stargazerCount": 150,
      "forkCount": 12,
      "issuesCount": 2,
      "pullRequestsCount": 1,
      "primaryLanguage": {
        "name": "TypeScript",
        "color": "#3178c6"
      },
      "license": {
        "name": "Apache License 2.0",
        "spdxId": "Apache-2.0"
      }
    }
  ],
  "people": {
    "type": "profile",
    "totalCount": 34,
    "nodes": [
      {
        "login": "FernandoEGV",
        "name": "FernandoEGV",
        "avatarUrl": "https://avatars.githubusercontent.com/u/104585876?u=53370abe7b42e891789ef25b7f34c32f3e5f87fb&v=4"
      },
      {
        "login": "sh-lucas",
        "name": "Lucas Schwalm Silva",
        "avatarUrl": "https://avatars.githubusercontent.com/u/57202598?u=07d28aa77c08dcef79364a50831a494c1b16fecf&v=4"
      },
      {
        "login": "mikew194",
        "name": "Mike Wassermann",
        "avatarUrl": "https://avatars.githubusercontent.com/u/1824010?v=4"
      },
      {
        "login": "motanelson",
        "name": "nelson jr mota",
        "avatarUrl": "https://avatars.githubusercontent.com/u/118323821?u=7d8591d3397b04783e1202947f719228163737d4&v=4"
      },
      {
        "login": "donjoo",
        "name": "DonJo",
        "avatarUrl": "https://avatars.githubusercontent.com/u/142510150?u=d7e949bc5a74fd061a1b75f4a146fbe2cbf4e8ef&v=4"
      },
      {
        "login": "kunleulysses",
        "name": "Ulysses",
        "avatarUrl": "https://avatars.githubusercontent.com/u/65002977?v=4"
      },
      {
        "login": "seplsy",
        "name": "Murphy",
        "avatarUrl": "https://avatars.githubusercontent.com/u/224399391?u=9b864bd71a864e4724409c62f0e0d2a65c5fcb76&v=4"
      },
      {
        "login": "rmtsixq",
        "name": null,
        "avatarUrl": "https://avatars.githubusercontent.com/u/189560306?v=4"
      },
      {
        "login": "ranawasif896",
        "name": "Muhammad Wasif",
        "avatarUrl": "https://avatars.githubusercontent.com/u/196354093?u=e47a1060b053bbb47116115441e4ac7c08e81c35&v=4"
      },
      {
        "login": "Adeife004",
        "name": "Adebowale Jasmine",
        "avatarUrl": "https://avatars.githubusercontent.com/u/130067040?v=4"
      }
    ]
  },
  "repositoryContributors": [
    {
      "login": "LucasHenriqueDiniz",
      "name": "Lucas HDO",
      "avatarUrl": "https://avatars.githubusercontent.com/u/63087780",
      "contributions": 156
    },
    {
      "login": "octocat",
      "name": "The Octocat",
      "avatarUrl": "https://avatars.githubusercontent.com/u/583231?v=4",
      "contributions": 89
    },
    {
      "login": "github",
      "name": "GitHub",
      "avatarUrl": "https://avatars.githubusercontent.com/u/9919?v=4",
      "contributions": 45
    },
    {
      "login": "defunkt",
      "name": "Chris Wanstrath",
      "avatarUrl": "https://avatars.githubusercontent.com/u/2?v=4",
      "contributions": 32
    },
    {
      "login": "pjhyett",
      "name": "PJ Hyett",
      "avatarUrl": "https://avatars.githubusercontent.com/u/3?v=4",
      "contributions": 28
    },
    {
      "login": "wycats",
      "name": "Yehuda Katz",
      "avatarUrl": "https://avatars.githubusercontent.com/u/4?v=4",
      "contributions": 24
    },
    {
      "login": "ezmobius",
      "name": "Ezra Zygmuntowicz",
      "avatarUrl": "https://avatars.githubusercontent.com/u/5?v=4",
      "contributions": 18
    },
    {
      "login": "brynary",
      "name": "Bryan Helmkamp",
      "avatarUrl": "https://avatars.githubusercontent.com/u/19?v=4",
      "contributions": 15
    },
    {
      "login": "kevinclark",
      "name": "Kevin Clark",
      "avatarUrl": "https://avatars.githubusercontent.com/u/20?v=4",
      "contributions": 12
    },
    {
      "login": "technoweenie",
      "name": "Rick Olson",
      "avatarUrl": "https://avatars.githubusercontent.com/u/21?v=4",
      "contributions": 10
    }
  ],
"activity": {
  "totalCommitContributions": 6521,
  "totalRepositoriesWithContributedCommits": 74,
  "totalPullRequestContributions": 231,
  "totalPullRequestReviewContributions": 89,
  "totalIssueContributions": 143,
  "restrictedContributionsCount": 17,
  "repositoriesContributedTo": 86,
  "issueComments": 210,
  "organizations": 3,
  "following": 58,
  "sponsorshipsAsSponsor": 2,
  "starredRepositories": 187,
  "watching": 26,
  "pullRequests": 231,
  "issues": 143,
  "gists": 12
},
"totalDiskUsage": 512000,
"sponsoringCount": 3,
} as GithubData
  
  // Converter todos os avatarUrls para base64
  const convertAvatarUrl = async (url: string | undefined): Promise<string | undefined> => {
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      return url
    }
    try {
      return await urlToBase64(url)
    } catch (error) {
      console.warn(`Failed to convert avatar URL to base64: ${url}`, error)
      return url
    }
  }

  // Converter avatarUrl do user
  const userAvatarUrl = await convertAvatarUrl(realData.user?.avatarUrl ?? 'https://avatars.githubusercontent.com/octocat')

  // Converter avatarUrls de people
  const peopleNodes = await Promise.all(
    (realData.people?.nodes || []).map(async (person) => ({
      ...person,
      avatarUrl: await convertAvatarUrl(person.avatarUrl) || person.avatarUrl,
    }))
  )

  // Converter avatarUrls de sponsors
  const sponsorsNodes = await Promise.all(
    (realData.sponsors?.nodes || []).map(async (sponsor) => ({
      ...sponsor,
      avatarUrl: await convertAvatarUrl(sponsor.avatarUrl) || sponsor.avatarUrl,
    }))
  )

  // Converter avatarUrls de sponsorships
  const sponsorshipsNodes = await Promise.all(
    (realData.sponsorships?.nodes || []).map(async (sponsorship) => ({
      ...sponsorship,
      sponsorable: {
        ...sponsorship.sponsorable,
        avatarUrl: await convertAvatarUrl(sponsorship.sponsorable.avatarUrl) || sponsorship.sponsorable.avatarUrl,
      },
    }))
  )

  // Converter avatarUrls de repositoryContributors
  const repositoryContributors = await Promise.all(
    (realData.repositoryContributors || []).map(async (contributor) => ({
      ...contributor,
      avatarUrl: await convertAvatarUrl(contributor.avatarUrl) || contributor.avatarUrl,
    }))
  )

  return {
    ...realData,
    user: {
      ...realData.user,
      avatarUrl: userAvatarUrl ?? 'https://avatars.githubusercontent.com/octocat',
    },
    people: realData.people ? {
      ...realData.people,
      nodes: peopleNodes,
    } : undefined,
    sponsors: realData.sponsors ? {
      ...realData.sponsors,
      nodes: sponsorsNodes,
    } : undefined,
    sponsorships: realData.sponsorships ? {
      ...realData.sponsorships,
      nodes: sponsorshipsNodes,
    } : undefined,
    repositoryContributors: repositoryContributors.length > 0 ? repositoryContributors : realData.repositoryContributors,
  }
}
