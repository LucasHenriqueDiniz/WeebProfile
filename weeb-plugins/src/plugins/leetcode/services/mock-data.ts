/**
 * Mock data for the LeetCode plugin
 */

import type { LeetCodeData } from "../types"

export function getMockLeetCodeData(): LeetCodeData {
  return {
    username: "example",
    solved: {
      total: 612,
      questions: 4115,
      byDifficulty: [
        { difficulty: "Easy", solved: 214, total: 976 },
        { difficulty: "Medium", solved: 321, total: 2148 },
        { difficulty: "Hard", solved: 77, total: 991 },
      ],
    },
    skills: [
      { name: "Array", category: "fundamental", solved: 341 },
      { name: "String", category: "fundamental", solved: 158 },
      { name: "Hash Table", category: "intermediate", solved: 147 },
      { name: "Dynamic Programming", category: "advanced", solved: 121 },
      { name: "Math", category: "intermediate", solved: 112 },
      { name: "Sorting", category: "fundamental", solved: 96 },
      { name: "Greedy", category: "intermediate", solved: 84 },
      { name: "Depth-First Search", category: "intermediate", solved: 71 },
      { name: "Binary Search", category: "advanced", solved: 58 },
      { name: "Two Pointers", category: "fundamental", solved: 55 },
      { name: "Tree", category: "intermediate", solved: 49 },
      { name: "Breadth-First Search", category: "intermediate", solved: 44 },
    ],
    languages: [
      { name: "Python3", solved: 402 },
      { name: "C++", solved: 168 },
      { name: "Java", solved: 51 },
      { name: "TypeScript", solved: 17 },
      { name: "MySQL", solved: 9 },
    ],
    recent: [
      { title: "Two Sum", slug: "two-sum", date: "2026-11-17T21:14:00Z" },
      { title: "Longest Palindromic Substring", slug: "longest-palindromic-substring", date: "2026-11-16T18:02:00Z" },
      { title: "Merge k Sorted Lists", slug: "merge-k-sorted-lists", date: "2026-11-15T09:41:00Z" },
      { title: "Course Schedule II", slug: "course-schedule-ii", date: "2026-11-13T22:27:00Z" },
      { title: "Trapping Rain Water", slug: "trapping-rain-water", date: "2026-11-12T12:05:00Z" },
    ],
  }
}
