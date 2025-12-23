/**
 * Mock data for Lyfta plugin development
 *
 * ⚠️  THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY ⚠️
 *
 * Generated from real API data
 */

import type { LyftaData, LyftaExerciseData, LyftaStatistics, LyftaWorkout, LyftaWorkoutSummary } from '../types.js'

const baseWorkouts: LyftaWorkout[] = [
  {
    "id": 11033771,
    "title": "Pull #1 (Back,Biceps,Abs,Traps)",
    "workout_perform_date": "2025-12-01 23:33:34",
    "body_weight": 100,
    "total_volume": 5840,
    "totalLiftedWeight": 5840,
    "exercises": [
      {
        "exercise_id": 4255,
        "excercise_name": "Barbell Pendlay Row",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/30171101-Barbell-Pendlay-Row_Back_small.png",
        "exercise_rest_time": 29,
        "sets": [
          {
            "id": "212962192",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "212962193",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 2025,
        "excercise_name": "Lever Bent over Row ",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/05741101-Lever-Bent-over-Row-(plate-loaded)_Back_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "212962194",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "212962195",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 4551,
        "excercise_name": "Dumbbell Hammer Grip Incline Bench Two Arm Row",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/33201101-Dumbbell-Hammer-Grip-Incline-Bench-Two-Arm-Row_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "212962196",
            "weight": "20.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 142,
        "excercise_name": "Incline Shrug",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03291101-Dumbbell-Incline-Shrug_Back_small.png",
        "exercise_rest_time": 18,
        "sets": [
          {
            "id": "212962197",
            "weight": "20.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "212962198",
            "weight": "20.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "212962199",
            "weight": "20.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "212962200",
            "weight": "20.000",
            "reps": "13",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1768,
        "excercise_name": "Dumbbell Incline Curl ",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03171101-Dumbbell-Incline-Curl-II_Upper-Arms_small.png",
        "exercise_rest_time": 23,
        "sets": [
          {
            "id": "212962201",
            "weight": "12.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "212962202",
            "weight": "12.000",
            "reps": "6",
            "is_completed": true
          },
          {
            "id": "212962203",
            "weight": "12.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1763,
        "excercise_name": "Dumbbell Hammer Curl ",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03121101-Dumbbell-Hammer-Curl-II_Upper-Arms_small.png",
        "exercise_rest_time": 26,
        "sets": [
          {
            "id": "212962204",
            "weight": "12.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "212962205",
            "weight": "16.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 10968521,
    "title": "Treino Noturno",
    "workout_perform_date": "2025-11-30 02:22:23",
    "body_weight": 100,
    "total_volume": 5488,
    "totalLiftedWeight": 5488,
    "exercises": [
      {
        "exercise_id": 2,
        "excercise_name": "Bench Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/00251101-Barbell-Bench-Press_Chest-FIX_small.png",
        "exercise_rest_time": 36,
        "sets": [
          {
            "id": "211713924",
            "weight": "60.000",
            "reps": "13",
            "is_completed": true
          },
          {
            "id": "211713925",
            "weight": "64.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "211713926",
            "weight": "64.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 136,
        "excercise_name": "Incline Bench Press",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03141101-Dumbbell-Incline-Bench-Press_Chest_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "211713927",
            "weight": "24.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "211713928",
            "weight": "24.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "211713929",
            "weight": "24.000",
            "reps": "7",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 176,
        "excercise_name": "Seated Shoulder Press",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/04051101-Dumbbell-Seated-Shoulder-Press_Shoulders_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "211713930",
            "weight": "14.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "211713931",
            "weight": "16.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "211713932",
            "weight": "16.000",
            "reps": "11",
            "is_completed": true
          },
          {
            "id": "211713933",
            "weight": "16.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 115,
        "excercise_name": "Alternate Biceps Curl",
        "exercise_type": "db_1_alt_sides",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02851101-Dumbbell-Alternate-Biceps-Curl_Upper-Arms-AFIX_small.png",
        "exercise_rest_time": 28,
        "sets": [
          {
            "id": "211713934",
            "weight": "16.000",
            "reps": "20",
            "is_completed": true
          },
          {
            "id": "211713935",
            "weight": "16.000",
            "reps": "16",
            "is_completed": true
          },
          {
            "id": "211713936",
            "weight": "16.000",
            "reps": "7",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 10687363,
    "title": "Treino Noturno",
    "workout_perform_date": "2025-11-22 00:29:43",
    "body_weight": 100,
    "total_volume": 7096,
    "totalLiftedWeight": 7096,
    "exercises": [
      {
        "exercise_id": 2,
        "excercise_name": "Bench Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/00251101-Barbell-Bench-Press_Chest-FIX_small.png",
        "exercise_rest_time": 36,
        "sets": [
          {
            "id": "206322358",
            "weight": "60.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "206322359",
            "weight": "60.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "206322360",
            "weight": "60.000",
            "reps": "7",
            "is_completed": true
          },
          {
            "id": "206322361",
            "weight": "60.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 136,
        "excercise_name": "Incline Bench Press",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03141101-Dumbbell-Incline-Bench-Press_Chest_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "206322362",
            "weight": "20.000",
            "reps": "11",
            "is_completed": true
          },
          {
            "id": "206322363",
            "weight": "20.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "206322364",
            "weight": "20.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 176,
        "excercise_name": "Seated Shoulder Press",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/04051101-Dumbbell-Seated-Shoulder-Press_Shoulders_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "206322365",
            "weight": "14.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "206322366",
            "weight": "14.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "206322367",
            "weight": "14.000",
            "reps": "11",
            "is_completed": true
          },
          {
            "id": "206322368",
            "weight": "14.000",
            "reps": "12",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 115,
        "excercise_name": "Alternate Biceps Curl",
        "exercise_type": "db_1_alt_sides",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02851101-Dumbbell-Alternate-Biceps-Curl_Upper-Arms-AFIX_small.png",
        "exercise_rest_time": 28,
        "sets": [
          {
            "id": "206322369",
            "weight": "14.000",
            "reps": "20",
            "is_completed": true
          },
          {
            "id": "206322370",
            "weight": "14.000",
            "reps": "14",
            "is_completed": true
          },
          {
            "id": "206322371",
            "weight": "14.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 171,
        "excercise_name": "Seated Lateral Raise",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03951101-Dumbbell-Seated-Lateral-Raise-II_shoulder_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "206322372",
            "weight": "10.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "206322373",
            "weight": "10.000",
            "reps": "11",
            "is_completed": true
          },
          {
            "id": "206322374",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 27954,
        "excercise_name": "Dumbbell Seated Single Arm Overhead Triceps Extension",
        "exercise_type": "db_1_alt_sides",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/61581101-Dumbbell-Seated-Single-Arm-Overhead-Triceps-Extension_Upper-Arms_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "206322375",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "206322376",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "206322377",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "206322378",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "206322379",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "206322380",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 10454554,
    "title": ":(",
    "workout_perform_date": "2025-11-16 03:30:17",
    "body_weight": 100,
    "total_volume": 6034,
    "totalLiftedWeight": 6034,
    "exercises": [
      {
        "exercise_id": 2,
        "excercise_name": "Bench Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/00251101-Barbell-Bench-Press_Chest-FIX_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "201862903",
            "weight": "60.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "201862904",
            "weight": "60.000",
            "reps": "9",
            "is_completed": true
          },
          {
            "id": "201862905",
            "weight": "60.000",
            "reps": "9",
            "is_completed": true
          },
          {
            "id": "201862906",
            "weight": "60.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 132,
        "excercise_name": "Fly",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03081101-Dumbbell-Fly_Chest-FIX_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "201862907",
            "weight": "14.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "201862908",
            "weight": "14.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 176,
        "excercise_name": "Seated Shoulder Press",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/04051101-Dumbbell-Seated-Shoulder-Press_Shoulders_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "201862909",
            "weight": "14.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "201862910",
            "weight": "14.000",
            "reps": "13",
            "is_completed": true
          },
          {
            "id": "201862911",
            "weight": "14.000",
            "reps": "11",
            "is_completed": true
          },
          {
            "id": "201862912",
            "weight": "14.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 115,
        "excercise_name": "Alternate Biceps Curl",
        "exercise_type": "db_1_alt_sides",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02851101-Dumbbell-Alternate-Biceps-Curl_Upper-Arms-AFIX_small.png",
        "exercise_rest_time": 28,
        "sets": [
          {
            "id": "201862913",
            "weight": "14.000",
            "reps": "16",
            "is_completed": true
          },
          {
            "id": "201862914",
            "weight": "14.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "201862915",
            "weight": "14.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 171,
        "excercise_name": "Seated Lateral Raise",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03951101-Dumbbell-Seated-Lateral-Raise-II_shoulder_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "201862916",
            "weight": "10.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "201862917",
            "weight": "10.000",
            "reps": "11",
            "is_completed": true
          },
          {
            "id": "201862918",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 27954,
        "excercise_name": "Dumbbell Seated Single Arm Overhead Triceps Extension",
        "exercise_type": "db_1_alt_sides",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/61581101-Dumbbell-Seated-Single-Arm-Overhead-Triceps-Extension_Upper-Arms_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "201862919",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "201862920",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 9996415,
    "title": "sleepy",
    "workout_perform_date": "2025-11-04 01:20:37",
    "body_weight": 100,
    "total_volume": 5078,
    "totalLiftedWeight": 5078,
    "exercises": [
      {
        "exercise_id": 2,
        "excercise_name": "Bench Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/00251101-Barbell-Bench-Press_Chest-FIX_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "193083319",
            "weight": "60.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "193083320",
            "weight": "70.000",
            "reps": "7",
            "is_completed": true
          },
          {
            "id": "193083321",
            "weight": "74.000",
            "reps": "5",
            "is_completed": true
          },
          {
            "id": "193083322",
            "weight": "60.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 132,
        "excercise_name": "Fly",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03081101-Dumbbell-Fly_Chest-FIX_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "193083323",
            "weight": "10.000",
            "reps": "23",
            "is_completed": true
          },
          {
            "id": "193083324",
            "weight": "10.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "193083325",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 115,
        "excercise_name": "Alternate Biceps Curl",
        "exercise_type": "db_1_alt_sides",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02851101-Dumbbell-Alternate-Biceps-Curl_Upper-Arms-AFIX_small.png",
        "exercise_rest_time": 28,
        "sets": [
          {
            "id": "193083326",
            "weight": "14.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "193083327",
            "weight": "14.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "193083328",
            "weight": "14.000",
            "reps": "5",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 36,
        "excercise_name": "Romanian Deadlift",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/00851101-Barbell-Romanian-Deadlift_Hips_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "193083329",
            "weight": "84.000",
            "reps": "6",
            "is_completed": true
          },
          {
            "id": "193083330",
            "weight": "84.000",
            "reps": "6",
            "is_completed": true
          },
          {
            "id": "193083331",
            "weight": "84.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 9610322,
    "title": "Push #1 (Chest,Shoulders,Triceps)",
    "workout_perform_date": "2025-10-23 23:21:25",
    "body_weight": 100,
    "total_volume": 6230,
    "totalLiftedWeight": 6230,
    "exercises": [
      {
        "exercise_id": 2,
        "excercise_name": "Bench Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/00251101-Barbell-Bench-Press_Chest-FIX_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "185794799",
            "weight": "60.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "185794800",
            "weight": "70.000",
            "reps": "9",
            "is_completed": true
          },
          {
            "id": "185794801",
            "weight": "70.000",
            "reps": "6",
            "is_completed": true
          },
          {
            "id": "185794802",
            "weight": "60.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 132,
        "excercise_name": "Fly",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03081101-Dumbbell-Fly_Chest-FIX_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "185794803",
            "weight": "10.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "185794804",
            "weight": "10.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "185794805",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1542,
        "excercise_name": "Barbell Seated Overhead Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/00911101-Barbell-Seated-Overhead-Press_Shoulders_small.png",
        "exercise_rest_time": 36,
        "sets": [
          {
            "id": "185794806",
            "weight": "40.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "185794807",
            "weight": "40.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "185794808",
            "weight": "40.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "185794809",
            "weight": "40.000",
            "reps": "9",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 171,
        "excercise_name": "Seated Lateral Raise",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03951101-Dumbbell-Seated-Lateral-Raise-II_shoulder_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "185794810",
            "weight": "10.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "185794811",
            "weight": "10.000",
            "reps": "11",
            "is_completed": true
          },
          {
            "id": "185794812",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1481,
        "excercise_name": "Barbell Close-Grip Bench Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/00301101-Barbell-Close-Grip-Bench-Press_Upper-Arms-FIX_small.png",
        "exercise_rest_time": 19,
        "sets": [
          {
            "id": "185794813",
            "weight": "40.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "185794814",
            "weight": "40.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 9243061,
    "title": "Push #1 (Chest,Shoulders,Triceps)",
    "workout_perform_date": "2025-10-13 22:39:55",
    "body_weight": 100,
    "total_volume": 5472,
    "totalLiftedWeight": 5472,
    "exercises": [
      {
        "exercise_id": 2,
        "excercise_name": "Bench Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/00251101-Barbell-Bench-Press_Chest-FIX_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "178792031",
            "weight": "60.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "178792032",
            "weight": "60.000",
            "reps": "5",
            "is_completed": true
          },
          {
            "id": "178792033",
            "weight": "60.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "178792034",
            "weight": "60.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 132,
        "excercise_name": "Fly",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03081101-Dumbbell-Fly_Chest-FIX_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "178792035",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "178792036",
            "weight": "10.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "178792037",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 171,
        "excercise_name": "Seated Lateral Raise",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03951101-Dumbbell-Seated-Lateral-Raise-II_shoulder_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "178792038",
            "weight": "10.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "178792039",
            "weight": "10.000",
            "reps": "11",
            "is_completed": true
          },
          {
            "id": "178792040",
            "weight": "10.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 27954,
        "excercise_name": "Dumbbell Seated Single Arm Overhead Triceps Extension",
        "exercise_type": "db_1_alt_sides",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/61581101-Dumbbell-Seated-Single-Arm-Overhead-Triceps-Extension_Upper-Arms_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "178792041",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "178792042",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "178792043",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "178792044",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "178792045",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "178792046",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "178792047",
            "weight": "10.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "178792048",
            "weight": "10.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1763,
        "excercise_name": "Dumbbell Hammer Curl ",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03121101-Dumbbell-Hammer-Curl-II_Upper-Arms_small.png",
        "exercise_rest_time": 26,
        "sets": [
          {
            "id": "178792049",
            "weight": "10.000",
            "reps": "20",
            "is_completed": true
          },
          {
            "id": "178792050",
            "weight": "10.000",
            "reps": "20",
            "is_completed": true
          },
          {
            "id": "178792051",
            "weight": "12.000",
            "reps": "18",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 8944906,
    "title": "Treino Noturno",
    "workout_perform_date": "2025-10-04 21:21:23",
    "body_weight": 100,
    "total_volume": 4100,
    "totalLiftedWeight": 4100,
    "exercises": [
      {
        "exercise_id": 2,
        "excercise_name": "Bench Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/00251101-Barbell-Bench-Press_Chest-FIX_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "173120703",
            "weight": "60.000",
            "reps": "11",
            "is_completed": true
          },
          {
            "id": "173120704",
            "weight": "60.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "173120705",
            "weight": "60.000",
            "reps": "12",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 136,
        "excercise_name": "Incline Bench Press",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03141101-Dumbbell-Incline-Bench-Press_Chest_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "173120706",
            "weight": "20.000",
            "reps": "11",
            "is_completed": true
          },
          {
            "id": "173120707",
            "weight": "20.000",
            "reps": "9",
            "is_completed": true
          },
          {
            "id": "173120708",
            "weight": "20.000",
            "reps": "12",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1763,
        "excercise_name": "Dumbbell Hammer Curl ",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03121101-Dumbbell-Hammer-Curl-II_Upper-Arms_small.png",
        "exercise_rest_time": 26,
        "sets": [
          {
            "id": "173120709",
            "weight": "12.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "173120710",
            "weight": "12.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "173120711",
            "weight": "12.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 8712499,
    "title": "TST pull Costa biceps trap\\u00E9zio ab",
    "workout_perform_date": "2025-09-27 12:16:36",
    "body_weight": 100,
    "total_volume": 9715,
    "totalLiftedWeight": 9715,
    "exercises": [
      {
        "exercise_id": 86,
        "excercise_name": "Pulldown",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/01971101-Cable-Pulldown-(pro-lat-bar)_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "168694045",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "168694046",
            "weight": "50.000",
            "reps": "11",
            "is_completed": true
          },
          {
            "id": "168694047",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "168694048",
            "weight": "50.000",
            "reps": "9",
            "is_completed": true
          },
          {
            "id": "168694049",
            "weight": "30.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 105,
        "excercise_name": "Straight Back Seated Row",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02391101-Cable-Straight-Back-Seated-Row_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "168694050",
            "weight": "50.000",
            "reps": "13",
            "is_completed": true
          },
          {
            "id": "168694051",
            "weight": "52.500",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "168694052",
            "weight": "50.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "168694053",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1763,
        "excercise_name": "Dumbbell Hammer Curl ",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03121101-Dumbbell-Hammer-Curl-II_Upper-Arms_small.png",
        "exercise_rest_time": 26,
        "sets": [
          {
            "id": "168694054",
            "weight": "14.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "168694055",
            "weight": "12.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "168694056",
            "weight": "12.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 28019,
        "excercise_name": "EZ Barbell Preacher Curl",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/64061101-EZ-Barbell-Preacher-Curl_Upper-Arms_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "168694057",
            "weight": "25.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "168694058",
            "weight": "25.000",
            "reps": "6",
            "is_completed": true
          },
          {
            "id": "168694059",
            "weight": "25.000",
            "reps": "6",
            "is_completed": true
          },
          {
            "id": "168694060",
            "weight": "20.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "168694061",
            "weight": "20.000",
            "reps": "6",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1626,
        "excercise_name": "Cable Kneeling Crunch",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/01751101-Cable-Kneeling-Crunch_Waist-FIX_small.png",
        "exercise_rest_time": 15,
        "sets": [
          {
            "id": "168694062",
            "weight": "60.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "168694063",
            "weight": "60.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "168694064",
            "weight": "60.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "168694065",
            "weight": "70.000",
            "reps": "15",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 8545168,
    "title": "Pull #2 Back,Biceps,Abs,Traps (Alternative)",
    "workout_perform_date": "2025-09-20 15:19:34",
    "body_weight": 100,
    "total_volume": 1900,
    "totalLiftedWeight": 1900,
    "exercises": [
      {
        "exercise_id": 51,
        "excercise_name": "Reverse Grip Bent over Row",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/01181101-Barbell-Reverse-Grip-Bent-over-Row_Back-FIX_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "165488588",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "165488589",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "165488590",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1743,
        "excercise_name": "Dumbbell One Arm Bent-over Row",
        "exercise_type": "db_1_alt_sides",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02921101-Dumbbell-Bent-over-Row_back_Back-AFIX_small.png",
        "exercise_rest_time": 19,
        "sets": [
          {
            "id": "165488591",
            "weight": "20.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "165488592",
            "weight": "20.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 8278832,
    "title": "TST pull Costa biceps trap\\u00E9zio ab",
    "workout_perform_date": "2025-09-13 11:15:41",
    "body_weight": 100,
    "total_volume": 9957.2,
    "totalLiftedWeight": 9957.2,
    "exercises": [
      {
        "exercise_id": 86,
        "excercise_name": "Pulldown",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/01971101-Cable-Pulldown-(pro-lat-bar)_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "160421974",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "160421975",
            "weight": "60.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "160421976",
            "weight": "60.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "160421977",
            "weight": "60.000",
            "reps": "6",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 105,
        "excercise_name": "Straight Back Seated Row",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02391101-Cable-Straight-Back-Seated-Row_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "160421978",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "160421979",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "160421980",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 347,
        "excercise_name": "Lever Seated Row",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/13501101-Lever-Seated-Row_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "160421981",
            "weight": "99.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "160421982",
            "weight": "99.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "160421983",
            "weight": "99.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1763,
        "excercise_name": "Dumbbell Hammer Curl ",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03121101-Dumbbell-Hammer-Curl-II_Upper-Arms_small.png",
        "exercise_rest_time": 26,
        "sets": [
          {
            "id": "160421984",
            "weight": "12.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "160421985",
            "weight": "12.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "160421986",
            "weight": "14.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 28019,
        "excercise_name": "EZ Barbell Preacher Curl",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/64061101-EZ-Barbell-Preacher-Curl_Upper-Arms_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "160421987",
            "weight": "25.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "160421988",
            "weight": "25.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "160421989",
            "weight": "25.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1768,
        "excercise_name": "Dumbbell Incline Curl ",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03171101-Dumbbell-Incline-Curl-II_Upper-Arms_small.png",
        "exercise_rest_time": 23,
        "sets": [
          {
            "id": "160421990",
            "weight": "12.000",
            "reps": "7",
            "is_completed": true
          },
          {
            "id": "160421991",
            "weight": "12.000",
            "reps": "7",
            "is_completed": true
          },
          {
            "id": "160421992",
            "weight": "10.000",
            "reps": "12",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1626,
        "excercise_name": "Cable Kneeling Crunch",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/01751101-Cable-Kneeling-Crunch_Waist-FIX_small.png",
        "exercise_rest_time": 15,
        "sets": [
          {
            "id": "160421993",
            "weight": "60.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "160421994",
            "weight": "60.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "160421995",
            "weight": "60.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "160421996",
            "weight": "60.000",
            "reps": "15",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 4201,
        "excercise_name": "Captains Chair Straight Leg Raise",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/29631101-Captains-Chair-Straight-Leg-Raise_Waist_small.png",
        "exercise_rest_time": 0,
        "sets": [
          {
            "id": "160421997",
            "weight": null,
            "reps": "10",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 8252083,
    "title": "TST push",
    "workout_perform_date": "2025-09-12 10:02:52",
    "body_weight": 100,
    "total_volume": 9775.6,
    "totalLiftedWeight": 9775.6,
    "exercises": [
      {
        "exercise_id": 326,
        "excercise_name": "Lever Incline Chest Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/12991101-Leverage-Incline-Chest-Press_Chest_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "159901751",
            "weight": "70.000",
            "reps": "7",
            "is_completed": true
          },
          {
            "id": "159901752",
            "weight": "70.000",
            "reps": "6",
            "is_completed": true
          },
          {
            "id": "159901753",
            "weight": "70.000",
            "reps": "4",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 204,
        "excercise_name": "Lever Chest Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/05761101-Lever-Chest-Press-(plate-loaded)_Chest_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "159901754",
            "weight": "60.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "159901755",
            "weight": "60.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "159901756",
            "weight": "60.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 219,
        "excercise_name": "Lever Seated Fly",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/05961101-Lever-Seated-Fly_Chest_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "159901757",
            "weight": "143.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159901758",
            "weight": "143.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "159901759",
            "weight": "143.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 223,
        "excercise_name": "Lever Seated Reverse Fly",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/06021101-Lever-Seated-Reverse-Fly_Shoulders_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "159901760",
            "weight": "77.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159901761",
            "weight": "77.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159901762",
            "weight": "77.000",
            "reps": "6",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 4859,
        "excercise_name": "Lever Lateral Raise ",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/36291101-Lever-Lateral-Raise-(female)_Shoulder_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "159901763",
            "weight": "54.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159901764",
            "weight": "54.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159901765",
            "weight": "54.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 2320,
        "excercise_name": "Lever Shoulder Press ",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/08691101-Lever-Shoulder-Press-(plate-loaded)-II_Shoulders_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "159901766",
            "weight": "154.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159901767",
            "weight": "154.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "159901768",
            "weight": "154.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 107,
        "excercise_name": "Triceps Pushdown",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02411101-Cable-Triceps-Pushdown-(V-bar-attachment)_Upper-Arms_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "159901769",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159901770",
            "weight": "50.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "159901771",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1651,
        "excercise_name": "Cable Pushdown ",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02001101-Cable-Pushdown-(with-rope-attachment)_Upper-Arms_small.png",
        "exercise_rest_time": 0,
        "sets": [
          {
            "id": "159901772",
            "weight": "30.000",
            "reps": "20",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 8216043,
    "title": "Treino Matinal",
    "workout_perform_date": "2025-09-11 10:12:58",
    "body_weight": 100,
    "total_volume": 11767.9,
    "totalLiftedWeight": 11767.9,
    "exercises": [
      {
        "exercise_id": 236,
        "excercise_name": "Sled 45° Leg Wide Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/07401101-Sled-45-Leg-Wide-Press_Thighs_small.png",
        "exercise_rest_time": 27,
        "sets": [
          {
            "id": "159213204",
            "weight": "120.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159213205",
            "weight": "120.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159213206",
            "weight": "140.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 3507,
        "excercise_name": "Lever Seated Leg Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/22671101-Lever-Seated-Leg-Press_Thighs_small.png",
        "exercise_rest_time": 26,
        "sets": [
          {
            "id": "159213207",
            "weight": "89.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159213208",
            "weight": "89.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159213209",
            "weight": "89.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 212,
        "excercise_name": "Lever Leg Extension",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/05851101-Lever-Leg-Extension_Thighs_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "159213210",
            "weight": "65.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159213211",
            "weight": "70.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159213212",
            "weight": "70.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 222,
        "excercise_name": "Lever Seated Leg Curl",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/05991101-Lever-Seated-Leg-Curl_Thighs-FIX_small.png",
        "exercise_rest_time": 26,
        "sets": [
          {
            "id": "159213213",
            "weight": "99.210",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159213214",
            "weight": "110.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159213215",
            "weight": "110.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 218,
        "excercise_name": "Lever Seated Calf Raise",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/05941101-Lever-Seated-Calf-Raise-(plate-loaded)_Calf_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "159213216",
            "weight": "40.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "159213217",
            "weight": "40.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "159213218",
            "weight": "40.000",
            "reps": "15",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 8214681,
    "title": "TST pull Costa biceps trap\\u00E9zio ab",
    "workout_perform_date": "2025-09-10 09:56:43",
    "body_weight": 100,
    "total_volume": 8957.4,
    "totalLiftedWeight": 8957.4,
    "exercises": [
      {
        "exercise_id": 86,
        "excercise_name": "Pulldown",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/01971101-Cable-Pulldown-(pro-lat-bar)_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "159186700",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159186701",
            "weight": "60.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "159186702",
            "weight": "60.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "159186703",
            "weight": "55.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 105,
        "excercise_name": "Straight Back Seated Row",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02391101-Cable-Straight-Back-Seated-Row_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "159186704",
            "weight": "45.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159186705",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159186706",
            "weight": "50.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 347,
        "excercise_name": "Lever Seated Row",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/13501101-Lever-Seated-Row_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "159186707",
            "weight": "99.000",
            "reps": "9",
            "is_completed": true
          },
          {
            "id": "159186708",
            "weight": "99.000",
            "reps": "9",
            "is_completed": true
          },
          {
            "id": "159186709",
            "weight": "99.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1763,
        "excercise_name": "Dumbbell Hammer Curl ",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03121101-Dumbbell-Hammer-Curl-II_Upper-Arms_small.png",
        "exercise_rest_time": 26,
        "sets": [
          {
            "id": "159186710",
            "weight": "14.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159186711",
            "weight": "14.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "159186712",
            "weight": "14.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 28019,
        "excercise_name": "EZ Barbell Preacher Curl",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/64061101-EZ-Barbell-Preacher-Curl_Upper-Arms_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "159186713",
            "weight": "20.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "159186714",
            "weight": "25.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "159186715",
            "weight": "25.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1768,
        "excercise_name": "Dumbbell Incline Curl ",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03171101-Dumbbell-Incline-Curl-II_Upper-Arms_small.png",
        "exercise_rest_time": 23,
        "sets": [
          {
            "id": "159186716",
            "weight": "9.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "159186717",
            "weight": "10.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159186718",
            "weight": "12.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1626,
        "excercise_name": "Cable Kneeling Crunch",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/01751101-Cable-Kneeling-Crunch_Waist-FIX_small.png",
        "exercise_rest_time": 15,
        "sets": [
          {
            "id": "159186719",
            "weight": "50.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "159186720",
            "weight": "60.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159186721",
            "weight": "60.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "159186722",
            "weight": "70.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 8179336,
    "title": "TST push",
    "workout_perform_date": "2025-09-07 13:22:57",
    "body_weight": 100,
    "total_volume": 13109.8,
    "totalLiftedWeight": 13109.8,
    "exercises": [
      {
        "exercise_id": 326,
        "excercise_name": "Lever Incline Chest Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/12991101-Leverage-Incline-Chest-Press_Chest_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "158515669",
            "weight": "144.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "158515670",
            "weight": "144.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "158515671",
            "weight": "144.000",
            "reps": "9",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 204,
        "excercise_name": "Lever Chest Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/05761101-Lever-Chest-Press-(plate-loaded)_Chest_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "158515672",
            "weight": "60.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "158515673",
            "weight": "60.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "158515674",
            "weight": "60.000",
            "reps": "6",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 219,
        "excercise_name": "Lever Seated Fly",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/05961101-Lever-Seated-Fly_Chest_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "158515675",
            "weight": "132.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "158515676",
            "weight": "143.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "158515677",
            "weight": "143.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 223,
        "excercise_name": "Lever Seated Reverse Fly",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/06021101-Lever-Seated-Reverse-Fly_Shoulders_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "158515678",
            "weight": "77.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "158515679",
            "weight": "77.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "158515680",
            "weight": "77.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 4859,
        "excercise_name": "Lever Lateral Raise ",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/36291101-Lever-Lateral-Raise-(female)_Shoulder_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "158515681",
            "weight": "51.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "158515682",
            "weight": "36.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "158515683",
            "weight": "63.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 2320,
        "excercise_name": "Lever Shoulder Press ",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/08691101-Lever-Shoulder-Press-(plate-loaded)-II_Shoulders_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "158515684",
            "weight": "154.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "158515685",
            "weight": "154.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "158515686",
            "weight": "154.000",
            "reps": "7",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 107,
        "excercise_name": "Triceps Pushdown",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02411101-Cable-Triceps-Pushdown-(V-bar-attachment)_Upper-Arms_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "158515687",
            "weight": "40.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "158515688",
            "weight": "45.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "158515689",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 84,
        "excercise_name": "Overhead Triceps Extension",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/01941101-Cable-Overhead-Triceps-Extension-(rope-attachment)_Upper-Arms_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "158515690",
            "weight": "25.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "158515691",
            "weight": "30.000",
            "reps": "9",
            "is_completed": true
          },
          {
            "id": "158515692",
            "weight": "30.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1651,
        "excercise_name": "Cable Pushdown ",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02001101-Cable-Pushdown-(with-rope-attachment)_Upper-Arms_small.png",
        "exercise_rest_time": 0,
        "sets": [
          {
            "id": "158515693",
            "weight": "30.000",
            "reps": "20",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 8037997,
    "title": "Treino Matinal",
    "workout_perform_date": "2025-09-05 09:58:35",
    "body_weight": 100,
    "total_volume": 9886.5,
    "totalLiftedWeight": 9886.5,
    "exercises": [
      {
        "exercise_id": 236,
        "excercise_name": "Sled 45° Leg Wide Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/07401101-Sled-45-Leg-Wide-Press_Thighs_small.png",
        "exercise_rest_time": 0,
        "sets": [
          {
            "id": "155819865",
            "weight": "80.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155819866",
            "weight": "100.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155819867",
            "weight": "120.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 3507,
        "excercise_name": "Lever Seated Leg Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/22671101-Lever-Seated-Leg-Press_Thighs_small.png",
        "exercise_rest_time": 0,
        "sets": [
          {
            "id": "155819868",
            "weight": "64.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155819869",
            "weight": "79.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155819870",
            "weight": "89.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 212,
        "excercise_name": "Lever Leg Extension",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/05851101-Lever-Leg-Extension_Thighs_small.png",
        "exercise_rest_time": 0,
        "sets": [
          {
            "id": "155819871",
            "weight": "65.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155819872",
            "weight": "65.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155819873",
            "weight": "65.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 222,
        "excercise_name": "Lever Seated Leg Curl",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/05991101-Lever-Seated-Leg-Curl_Thighs-FIX_small.png",
        "exercise_rest_time": 0,
        "sets": [
          {
            "id": "155819874",
            "weight": "121.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155819875",
            "weight": "121.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155819876",
            "weight": "121.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 218,
        "excercise_name": "Lever Seated Calf Raise",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/05941101-Lever-Seated-Calf-Raise-(plate-loaded)_Calf_small.png",
        "exercise_rest_time": 0,
        "sets": [
          {
            "id": "155819877",
            "weight": "40.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155819878",
            "weight": "40.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155819879",
            "weight": "30.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 8033881,
    "title": "TST pull Costa biceps trap\\u00E9zio ab",
    "workout_perform_date": "2025-09-03 10:01:52",
    "body_weight": 100,
    "total_volume": 8669.1,
    "totalLiftedWeight": 8669.1,
    "exercises": [
      {
        "exercise_id": 86,
        "excercise_name": "Pulldown",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/01971101-Cable-Pulldown-(pro-lat-bar)_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "155740319",
            "weight": "55.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155740320",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155740321",
            "weight": "45.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155740322",
            "weight": "45.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 105,
        "excercise_name": "Straight Back Seated Row",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02391101-Cable-Straight-Back-Seated-Row_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "155740323",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155740324",
            "weight": "45.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155740325",
            "weight": "45.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 347,
        "excercise_name": "Lever Seated Row",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/13501101-Lever-Seated-Row_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "155740326",
            "weight": "110.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "155740327",
            "weight": "99.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155740328",
            "weight": "99.000",
            "reps": "12",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1763,
        "excercise_name": "Dumbbell Hammer Curl ",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03121101-Dumbbell-Hammer-Curl-II_Upper-Arms_small.png",
        "exercise_rest_time": 26,
        "sets": [
          {
            "id": "155740329",
            "weight": "14.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "155740330",
            "weight": "14.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "155740331",
            "weight": "14.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 28019,
        "excercise_name": "EZ Barbell Preacher Curl",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/64061101-EZ-Barbell-Preacher-Curl_Upper-Arms_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "155740332",
            "weight": "20.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "155740333",
            "weight": "20.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "155740334",
            "weight": "25.000",
            "reps": "6",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1768,
        "excercise_name": "Dumbbell Incline Curl ",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03171101-Dumbbell-Incline-Curl-II_Upper-Arms_small.png",
        "exercise_rest_time": 23,
        "sets": [
          {
            "id": "155740335",
            "weight": "12.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155740336",
            "weight": "12.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155740337",
            "weight": "12.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1626,
        "excercise_name": "Cable Kneeling Crunch",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/01751101-Cable-Kneeling-Crunch_Waist-FIX_small.png",
        "exercise_rest_time": 15,
        "sets": [
          {
            "id": "155740338",
            "weight": "30.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155740339",
            "weight": "45.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155740340",
            "weight": "60.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155740341",
            "weight": "60.000",
            "reps": "12",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 4201,
        "excercise_name": "Captains Chair Straight Leg Raise",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/29631101-Captains-Chair-Straight-Leg-Raise_Waist_small.png",
        "exercise_rest_time": 0,
        "sets": [
          {
            "id": "155740342",
            "weight": null,
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155740343",
            "weight": null,
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "155740344",
            "weight": null,
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "155740345",
            "weight": null,
            "reps": "8",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 7933319,
    "title": "TST push",
    "workout_perform_date": "2025-09-02 10:07:13",
    "body_weight": 100,
    "total_volume": 9323.7,
    "totalLiftedWeight": 9323.7,
    "exercises": [
      {
        "exercise_id": 326,
        "excercise_name": "Lever Incline Chest Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/12991101-Leverage-Incline-Chest-Press_Chest_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "153832053",
            "weight": "144.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "153832054",
            "weight": "144.000",
            "reps": "9",
            "is_completed": true
          },
          {
            "id": "153832055",
            "weight": "140.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 2,
        "excercise_name": "Bench Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/00251101-Barbell-Bench-Press_Chest-FIX_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "153832056",
            "weight": "60.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "153832057",
            "weight": "60.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "153832058",
            "weight": "60.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 204,
        "excercise_name": "Lever Chest Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/05761101-Lever-Chest-Press-(plate-loaded)_Chest_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "153832059",
            "weight": "110.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "153832060",
            "weight": "110.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "153832061",
            "weight": "110.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 223,
        "excercise_name": "Lever Seated Reverse Fly",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/06021101-Lever-Seated-Reverse-Fly_Shoulders_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "153832062",
            "weight": "77.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "153832063",
            "weight": "77.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "153832064",
            "weight": "66.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 116,
        "excercise_name": "Arnold Press",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02871101-Dumbbell-Arnold-Press-II_Shoulders_small.png",
        "exercise_rest_time": 12,
        "sets": [
          {
            "id": "153832065",
            "weight": "18.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "153832066",
            "weight": "18.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "153832067",
            "weight": "18.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 84,
        "excercise_name": "Overhead Triceps Extension",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/01941101-Cable-Overhead-Triceps-Extension-(rope-attachment)_Upper-Arms_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "153832068",
            "weight": "20.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "153832069",
            "weight": "25.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "153832070",
            "weight": "30.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 107,
        "excercise_name": "Triceps Pushdown",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02411101-Cable-Triceps-Pushdown-(V-bar-attachment)_Upper-Arms_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "153832071",
            "weight": "40.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "153832072",
            "weight": "45.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "153832073",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 171,
        "excercise_name": "Seated Lateral Raise",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03951101-Dumbbell-Seated-Lateral-Raise-II_shoulder_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "153832074",
            "weight": "14.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "153832075",
            "weight": "14.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "153832076",
            "weight": "14.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 7879047,
    "title": "TST costa",
    "workout_perform_date": "2025-08-31 13:05:06",
    "body_weight": 100,
    "total_volume": 7464.1,
    "totalLiftedWeight": 7464.1,
    "exercises": [
      {
        "exercise_id": 86,
        "excercise_name": "Pulldown",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/01971101-Cable-Pulldown-(pro-lat-bar)_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "152789292",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152789293",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152789294",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152789295",
            "weight": "45.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 105,
        "excercise_name": "Straight Back Seated Row",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02391101-Cable-Straight-Back-Seated-Row_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "152789296",
            "weight": "40.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152789297",
            "weight": "40.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152789298",
            "weight": "55.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 300,
        "excercise_name": "Lever Lying T-bar Row",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/11941101-Lever-Lying-T-bar-Row_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "152789299",
            "weight": "40.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152789300",
            "weight": "40.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152789301",
            "weight": "40.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 28286,
        "excercise_name": "Cable Standing Supinated Face Pull (with rope)",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/77441101-Cable-Standing-Supinated-Face-Pull-(with-rope)_Shoulders_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "152789302",
            "weight": "40.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152789303",
            "weight": "35.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152789304",
            "weight": "35.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 223,
        "excercise_name": "Lever Seated Reverse Fly",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/06021101-Lever-Seated-Reverse-Fly_Shoulders_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "152789305",
            "weight": "77.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152789306",
            "weight": "77.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "152789307",
            "weight": "66.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 3400,
        "excercise_name": "Dumbbell Arnold Press",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/21371101-Dumbbell-Arnold-Press_Shoulders_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "152789308",
            "weight": "18.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152789309",
            "weight": "18.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "152789310",
            "weight": "18.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 7860801,
    "title": "Treino Matinal",
    "workout_perform_date": "2025-08-30 13:49:26",
    "body_weight": 100,
    "total_volume": 7050.3,
    "totalLiftedWeight": 7050.3,
    "exercises": [
      {
        "exercise_id": 326,
        "excercise_name": "Lever Incline Chest Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/12991101-Leverage-Incline-Chest-Press_Chest_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "152445323",
            "weight": "140.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "152445324",
            "weight": "140.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "152445325",
            "weight": "140.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 219,
        "excercise_name": "Lever Seated Fly",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/05961101-Lever-Seated-Fly_Chest_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "152445326",
            "weight": "132.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152445327",
            "weight": "132.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152445328",
            "weight": "132.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 107,
        "excercise_name": "Triceps Pushdown",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/02411101-Cable-Triceps-Pushdown-(V-bar-attachment)_Upper-Arms_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "152445329",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152445330",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152445331",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 2,
        "excercise_name": "Bench Press",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/00251101-Barbell-Bench-Press_Chest-FIX_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "152445332",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "152445333",
            "weight": "60.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "152445334",
            "weight": "60.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 84,
        "excercise_name": "Overhead Triceps Extension",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/01941101-Cable-Overhead-Triceps-Extension-(rope-attachment)_Upper-Arms_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "152445335",
            "weight": "25.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "152445336",
            "weight": "25.000",
            "reps": "8",
            "is_completed": true
          },
          {
            "id": "152445337",
            "weight": "25.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      }
    ]
  }
]

const baseExercises: LyftaExerciseData[] = [
  {
    "id": "142",
    "name": "Incline Shrug",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/03291101-Dumbbell-Incline-Shrug_Back_small.png",
    "equipment_id": "[\"4\"]",
    "body_part_id": "[\"4\"]",
    "Target_muscles_id": "[\"43\"]",
    "Synergist_muscles_id": "[\"21\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "1763",
    "name": "Dumbbell Hammer Curl ",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/03121101-Dumbbell-Hammer-Curl-II_Upper-Arms_small.png",
    "equipment_id": "[\"4\"]",
    "body_part_id": "[\"17\",\"5\"]",
    "Target_muscles_id": "[\"6\"]",
    "Synergist_muscles_id": "[\"4\",\"5\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "1768",
    "name": "Dumbbell Incline Curl ",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/03171101-Dumbbell-Incline-Curl-II_Upper-Arms_small.png",
    "equipment_id": "[\"4\"]",
    "body_part_id": "[\"17\"]",
    "Target_muscles_id": "[\"5\",\"4\"]",
    "Synergist_muscles_id": "[\"6\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "2025",
    "name": "Lever Bent over Row ",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/05741101-Lever-Bent-over-Row-(plate-loaded)_Back_small.png",
    "equipment_id": "[\"1\"]",
    "body_part_id": "[\"4\"]",
    "Target_muscles_id": "[\"19\",\"20\",\"37\",\"38\",\"41\",\"42\"]",
    "Synergist_muscles_id": "[\"5\",\"6\",\"10\",\"25\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "4255",
    "name": "Barbell Pendlay Row",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/30171101-Barbell-Pendlay-Row_Back_small.png",
    "equipment_id": "[\"1\"]",
    "body_part_id": "[\"4\"]",
    "Target_muscles_id": "[\"19\",\"20\",\"37\",\"38\",\"41\",\"42\"]",
    "Synergist_muscles_id": "[\"5\",\"6\",\"10\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "4551",
    "name": "Dumbbell Hammer Grip Incline Bench Two Arm Row",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/33201101-Dumbbell-Hammer-Grip-Incline-Bench-Two-Arm-Row_Back_small.png",
    "equipment_id": "[\"4\"]",
    "body_part_id": "[\"4\"]",
    "Target_muscles_id": "[\"19\",\"20\",\"37\",\"38\",\"41\",\"42\"]",
    "Synergist_muscles_id": "[\"5\",\"6\",\"10\",\"25\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "2",
    "name": "Bench Press",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/00251101-Barbell-Bench-Press_Chest-FIX_small.png",
    "equipment_id": "[\"1\"]",
    "body_part_id": "[\"2\"]",
    "Target_muscles_id": "[\"25\"]",
    "Synergist_muscles_id": "[\"8\",\"24\",\"44\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "115",
    "name": "Alternate Biceps Curl",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/02851101-Dumbbell-Alternate-Biceps-Curl_Upper-Arms-AFIX_small.png",
    "equipment_id": "[\"4\"]",
    "body_part_id": "[\"17\",\"5\"]",
    "Target_muscles_id": "[\"4\"]",
    "Synergist_muscles_id": "[\"5\",\"6\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "136",
    "name": "Incline Bench Press",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/03141101-Dumbbell-Incline-Bench-Press_Chest_small.png",
    "equipment_id": "[\"4\"]",
    "body_part_id": "[\"2\"]",
    "Target_muscles_id": "[\"24\"]",
    "Synergist_muscles_id": "[\"8\",\"44\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "176",
    "name": "Seated Shoulder Press",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/04051101-Dumbbell-Seated-Shoulder-Press_Shoulders_small.png",
    "equipment_id": "[\"4\"]",
    "body_part_id": "[\"6\"]",
    "Target_muscles_id": "[\"8\"]",
    "Synergist_muscles_id": "[\"9\",\"24\",\"31\",\"44\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "171",
    "name": "Seated Lateral Raise",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/03951101-Dumbbell-Seated-Lateral-Raise-II_shoulder_small.png",
    "equipment_id": "[\"4\"]",
    "body_part_id": "[\"6\"]",
    "Target_muscles_id": "[\"9\"]",
    "Synergist_muscles_id": "[\"8\",\"31\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "27954",
    "name": "Dumbbell Seated Single Arm Overhead Triceps Extension",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/61581101-Dumbbell-Seated-Single-Arm-Overhead-Triceps-Extension_Upper-Arms_small.png",
    "equipment_id": "[\"4\"]",
    "body_part_id": "[\"18\", \"5\"]",
    "Target_muscles_id": "[\"44\"]",
    "Synergist_muscles_id": "[\"8\",\"9\",\"43\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "132",
    "name": "Fly",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/03081101-Dumbbell-Fly_Chest-FIX_small.png",
    "equipment_id": "[\"4\"]",
    "body_part_id": "[\"2\"]",
    "Target_muscles_id": "[\"24\",\"25\"]",
    "Synergist_muscles_id": "[\"4\",\"8\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "36",
    "name": "Romanian Deadlift",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/00851101-Barbell-Romanian-Deadlift_Hips_small.png",
    "equipment_id": "[\"1\"]",
    "body_part_id": "[\"3\"]",
    "Target_muscles_id": "[\"11\",\"17\"]",
    "Synergist_muscles_id": "[\"17\",\"27\",\"32\",\"13\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "1481",
    "name": "Barbell Close-Grip Bench Press",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/00301101-Barbell-Close-Grip-Bench-Press_Upper-Arms-FIX_small.png",
    "equipment_id": "[\"1\"]",
    "body_part_id": "[\"18\",\"5\"]",
    "Target_muscles_id": "[\"44\"]",
    "Synergist_muscles_id": "[\"8\",\"24\",\"25\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "1542",
    "name": "Barbell Seated Overhead Press",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/00911101-Barbell-Seated-Overhead-Press_Shoulders_small.png",
    "equipment_id": "[\"1\"]",
    "body_part_id": "[\"6\"]",
    "Target_muscles_id": "[\"8\"]",
    "Synergist_muscles_id": "[\"9\",\"31\",\"44\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "86",
    "name": "Pulldown",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/01971101-Cable-Pulldown-(pro-lat-bar)_Back_small.png",
    "equipment_id": "[\"3\"]",
    "body_part_id": "[\"4\"]",
    "Target_muscles_id": "[\"20\"]",
    "Synergist_muscles_id": "[\"5\",\"6\",\"10\",\"19\",\"37\",\"38\",\"41\",\"42\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "105",
    "name": "Straight Back Seated Row",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/02391101-Cable-Straight-Back-Seated-Row_Back_small.png",
    "equipment_id": "[\"3\"]",
    "body_part_id": "[\"4\"]",
    "Target_muscles_id": "[\"19\",\"20\",\"37\",\"38\",\"41\",\"42\"]",
    "Synergist_muscles_id": "[\"5\",\"6\",\"10\",\"25\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "1626",
    "name": "Cable Kneeling Crunch",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/01751101-Cable-Kneeling-Crunch_Waist-FIX_small.png",
    "equipment_id": "[\"3\"]",
    "body_part_id": "[\"12\"]",
    "Target_muscles_id": "[\"28\"]",
    "Synergist_muscles_id": "[\"22\"]",
    "exercise_type": "weight_reps"
  },
  {
    "id": "28019",
    "name": "EZ Barbell Preacher Curl",
    "image_name": "https://apilyfta.com/static/GymvisualPNG/64061101-EZ-Barbell-Preacher-Curl_Upper-Arms_small.png",
    "equipment_id": "[\"5\"]",
    "body_part_id": "[\"17\", \"5\"]",
    "Target_muscles_id": "[\"4\"]",
    "Synergist_muscles_id": "[\"5\",\"6\",\"46\"]",
    "exercise_type": "weight_reps"
  }
]

const baseStatistics: LyftaStatistics = {
  "totalWorkouts": 20,
  "totalDuration": 0,
  "totalLiftedWeight": 152914.6,
  "favoriteExercise": null,
  "topMuscleGroups": [
    {
      "name": "General",
      "count": 0
    }
  ],
  "weeklyActivity": [
    {
      "day": "Sun",
      "count": 0
    },
    {
      "day": "Mon",
      "count": 0
    },
    {
      "day": "Tue",
      "count": 0
    },
    {
      "day": "Wed",
      "count": 0
    },
    {
      "day": "Thu",
      "count": 0
    },
    {
      "day": "Fri",
      "count": 0
    },
    {
      "day": "Sat",
      "count": 0
    }
  ],
  "currentStreak": 0,
  "longestStreak": 0,
  "lastWorkout": {
    "id": 11033771,
    "title": "Pull #1 (Back,Biceps,Abs,Traps)",
    "workout_perform_date": "2025-12-01 23:33:34",
    "body_weight": 100,
    "total_volume": 5840,
    "totalLiftedWeight": 5840,
    "exercises": [
      {
        "exercise_id": 4255,
        "excercise_name": "Barbell Pendlay Row",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/30171101-Barbell-Pendlay-Row_Back_small.png",
        "exercise_rest_time": 29,
        "sets": [
          {
            "id": "212962192",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "212962193",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 2025,
        "excercise_name": "Lever Bent over Row ",
        "exercise_type": "weight_reps",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/05741101-Lever-Bent-over-Row-(plate-loaded)_Back_small.png",
        "exercise_rest_time": 25,
        "sets": [
          {
            "id": "212962194",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "212962195",
            "weight": "50.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 4551,
        "excercise_name": "Dumbbell Hammer Grip Incline Bench Two Arm Row",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/33201101-Dumbbell-Hammer-Grip-Incline-Bench-Two-Arm-Row_Back_small.png",
        "exercise_rest_time": 24,
        "sets": [
          {
            "id": "212962196",
            "weight": "20.000",
            "reps": "10",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 142,
        "excercise_name": "Incline Shrug",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03291101-Dumbbell-Incline-Shrug_Back_small.png",
        "exercise_rest_time": 18,
        "sets": [
          {
            "id": "212962197",
            "weight": "20.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "212962198",
            "weight": "20.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "212962199",
            "weight": "20.000",
            "reps": "15",
            "is_completed": true
          },
          {
            "id": "212962200",
            "weight": "20.000",
            "reps": "13",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1768,
        "excercise_name": "Dumbbell Incline Curl ",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03171101-Dumbbell-Incline-Curl-II_Upper-Arms_small.png",
        "exercise_rest_time": 23,
        "sets": [
          {
            "id": "212962201",
            "weight": "12.000",
            "reps": "10",
            "is_completed": true
          },
          {
            "id": "212962202",
            "weight": "12.000",
            "reps": "6",
            "is_completed": true
          },
          {
            "id": "212962203",
            "weight": "12.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      },
      {
        "exercise_id": 1763,
        "excercise_name": "Dumbbell Hammer Curl ",
        "exercise_type": "db_2_simultaneous",
        "exercise_image": "https://apilyfta.com/static/GymvisualPNG/03121101-Dumbbell-Hammer-Curl-II_Upper-Arms_small.png",
        "exercise_rest_time": 26,
        "sets": [
          {
            "id": "212962204",
            "weight": "12.000",
            "reps": "12",
            "is_completed": true
          },
          {
            "id": "212962205",
            "weight": "16.000",
            "reps": "8",
            "is_completed": true
          }
        ]
      }
    ]
  },
  "workoutStreak": [
    {
      "date": "2025-11-09",
      "count": 0
    },
    {
      "date": "2025-11-10",
      "count": 0
    },
    {
      "date": "2025-11-11",
      "count": 0
    },
    {
      "date": "2025-11-12",
      "count": 0
    },
    {
      "date": "2025-11-13",
      "count": 0
    },
    {
      "date": "2025-11-14",
      "count": 0
    },
    {
      "date": "2025-11-15",
      "count": 0
    },
    {
      "date": "2025-11-16",
      "count": 0
    },
    {
      "date": "2025-11-17",
      "count": 0
    },
    {
      "date": "2025-11-18",
      "count": 0
    },
    {
      "date": "2025-11-19",
      "count": 0
    },
    {
      "date": "2025-11-20",
      "count": 0
    },
    {
      "date": "2025-11-21",
      "count": 0
    },
    {
      "date": "2025-11-22",
      "count": 0
    },
    {
      "date": "2025-11-23",
      "count": 0
    },
    {
      "date": "2025-11-24",
      "count": 0
    },
    {
      "date": "2025-11-25",
      "count": 0
    },
    {
      "date": "2025-11-26",
      "count": 0
    },
    {
      "date": "2025-11-27",
      "count": 0
    },
    {
      "date": "2025-11-28",
      "count": 0
    },
    {
      "date": "2025-11-29",
      "count": 0
    },
    {
      "date": "2025-11-30",
      "count": 0
    },
    {
      "date": "2025-12-01",
      "count": 0
    },
    {
      "date": "2025-12-02",
      "count": 0
    },
    {
      "date": "2025-12-03",
      "count": 0
    },
    {
      "date": "2025-12-04",
      "count": 0
    },
    {
      "date": "2025-12-05",
      "count": 0
    },
    {
      "date": "2025-12-06",
      "count": 0
    },
    {
      "date": "2025-12-07",
      "count": 0
    },
    {
      "date": "2025-12-08",
      "count": 0
    }
  ],
  "exerciseStats": {
    "totalExercises": 20,
    "uniqueExercises": 20,
    "mostUsedWeight": 0,
    "averageReps": null
  }
}

const baseWorkoutSummaries: LyftaWorkoutSummary[] = [
  {
    "id": 11033771,
    "title": "Pull #1 (Back,Biceps,Abs,Traps)",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 5840,
    "workout_perform_date": "2025-12-01 23:33:34"
  },
  {
    "id": 10968521,
    "title": "Treino Noturno",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 5488,
    "workout_perform_date": "2025-11-30 02:22:23"
  },
  {
    "id": 10687363,
    "title": "Treino Noturno",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 7096,
    "workout_perform_date": "2025-11-22 00:29:43"
  },
  {
    "id": 10454554,
    "title": ":(",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 6034,
    "workout_perform_date": "2025-11-16 03:30:17"
  },
  {
    "id": 9996415,
    "title": "sleepy",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 5078,
    "workout_perform_date": "2025-11-04 01:20:37"
  },
  {
    "id": 9610322,
    "title": "Push #1 (Chest,Shoulders,Triceps)",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 6230,
    "workout_perform_date": "2025-10-23 23:21:25"
  },
  {
    "id": 9243061,
    "title": "Push #1 (Chest,Shoulders,Triceps)",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 5472,
    "workout_perform_date": "2025-10-13 22:39:55"
  },
  {
    "id": 8944906,
    "title": "Treino Noturno",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 4100,
    "workout_perform_date": "2025-10-04 21:21:23"
  },
  {
    "id": 8712499,
    "title": "TST pull Costa biceps trap\\u00E9zio ab",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 9715,
    "workout_perform_date": "2025-09-27 12:16:36"
  },
  {
    "id": 8545168,
    "title": "Pull #2 Back,Biceps,Abs,Traps (Alternative)",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 1900,
    "workout_perform_date": "2025-09-20 15:19:34"
  },
  {
    "id": 8278832,
    "title": "TST pull Costa biceps trap\\u00E9zio ab",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 9957.2,
    "workout_perform_date": "2025-09-13 11:15:41"
  },
  {
    "id": 8252083,
    "title": "TST push",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 9775.6,
    "workout_perform_date": "2025-09-12 10:02:52"
  },
  {
    "id": 8216043,
    "title": "Treino Matinal",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 11767.9,
    "workout_perform_date": "2025-09-11 10:12:58"
  },
  {
    "id": 8214681,
    "title": "TST pull Costa biceps trap\\u00E9zio ab",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 8957.4,
    "workout_perform_date": "2025-09-10 09:56:43"
  },
  {
    "id": 8179336,
    "title": "TST push",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 13109.8,
    "workout_perform_date": "2025-09-07 13:22:57"
  },
  {
    "id": 8037997,
    "title": "Treino Matinal",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 9886.5,
    "workout_perform_date": "2025-09-05 09:58:35"
  },
  {
    "id": 8033881,
    "title": "TST pull Costa biceps trap\\u00E9zio ab",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 8669.1,
    "workout_perform_date": "2025-09-03 10:01:52"
  },
  {
    "id": 7933319,
    "title": "TST push",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 9323.7,
    "workout_perform_date": "2025-09-02 10:07:13"
  },
  {
    "id": 7879047,
    "title": "TST costa",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 7464.1,
    "workout_perform_date": "2025-08-31 13:05:06"
  },
  {
    "id": 7860801,
    "title": "Treino Matinal",
    "description": null,
    "workout_duration": "00:00:00",
    "total_volume": 7050.3,
    "workout_perform_date": "2025-08-30 13:49:26"
  }
]

export async function getMockLyftaData(): Promise<LyftaData> {
  return {
    workouts: baseWorkouts,
    workoutSummaries: baseWorkoutSummaries,
    exercises: baseExercises,
    statistics: baseStatistics,
  }
}
