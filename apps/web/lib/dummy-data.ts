import type { Language } from "@codearena/db";
import type { Contest, Submission } from "../types";

export const LANGUAGES: Language[] = ["CPP", "JAVASCRIPT"];

export const CONTESTS: Contest[] = [
  {
    id: "1",
    name: "Weekly Contest 382",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
    problemCount: 4,
    participantCount: 0,
  },
  {
    id: "2",
    name: "Biweekly Contest 123",
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
    problemCount: 4,
    participantCount: 0,
  },
  {
    id: "3",
    name: "Weekly Contest 381",
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
    problemCount: 4,
    participantCount: 23456,
  },
  {
    id: "4",
    name: "Biweekly Contest 122",
    startTime: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
    problemCount: 4,
    participantCount: 18765,
  },
  {
    id: "5",
    name: "Weekly Contest 380",
    startTime: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
    problemCount: 4,
    participantCount: 21345,
  },
];

export const SAMPLE_SUBMISSIONS: Submission[] = [
  {
    id: "1",
    code: `var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`,
    status: "ACCEPTED",
    memory: 42.3,
    time: 64,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    languageId: 1,
  },
  {
    id: "2",
    code: `var twoSum = function(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
};`,
    status: "TIME_LIMIT_EXCEEDED",
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    languageId: 1,
  },
  {
    id: "3",
    code: `var twoSum = function(nums, target) {
    const map = {};
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (complement in map) {
            return [map[complement], i];
        }
        map[nums[i]] = i;
    }
};`,
    status: "WRONG_ANSWER",
    output: "[0,0]",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    languageId: 1,
  },
];

export const CURRENT_USER = {
  id: "demo-user",
  name: "Akash Sharma",
  userName: "akash_codes",
  rank: 28472,
  solved: 147,
  contests: 28,
  avatar: "",
};

export const CONTEST_LEADERBOARD = [
  { rank: 1, user: "tourist_x", score: 18, penalty: 312 },
  { rank: 2, user: "benq_ai", score: 17, penalty: 337 },
  { rank: 3, user: "jiangly_loop", score: 16, penalty: 380 },
  { rank: 4, user: "akash_codes", score: 15, penalty: 419 },
  { rank: 5, user: "ada_love", score: 14, penalty: 442 },
];

export function getProblemBySlug(slug: string) {
  return {
    id: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "EASY",
    isPublished: true,
    submitCount: 10234567,
    acceptedCount: 5432189,
    timeLimitMs: 2000,
    memoryLimitKb: 256000,
    tags: [{ id: "array", name: "Array" }],
    hints: [
      "Use a hash map to store seen values.",
      "Check whether target - nums[i] already exists.",
    ],
    description: `<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return the indices of two numbers such that they add up to <code>target</code>.</p>
<p>You may assume exactly one valid answer exists, and you may not use the same element twice.</p>
<p><strong>Example:</strong> nums = [2,7,11,15], target = 9 -> [0,1]</p>`,
    codeSnippets: [
      {
        languageId: 1,
        code: `function twoSum(nums, target) {\n  const seen = new Map();\n\n  for (let i = 0; i < nums.length; i++) {\n    const needed = target - nums[i];\n    if (seen.has(needed)) return [seen.get(needed), i];\n    seen.set(nums[i], i);\n  }\n\n  return [];\n}`,
      },
      {
        languageId: 2,
        code: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass`,
      },
    ],
    testCases: [
      { id: "1", input: "[2,7,11,15]\n9", output: "[0,1]", isVisible: true },
      { id: "2", input: "[3,2,4]\n6", output: "[1,2]", isVisible: true },
      { id: "3", input: "[3,3]\n6", output: "[0,1]", isVisible: false },
    ],
  };
}

export function formatAcceptanceRate(accepted: number, submitted: number) {
  return `${((accepted / submitted) * 100).toFixed(1)}%`;
}
