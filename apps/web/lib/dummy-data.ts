import type { Submission } from "@codearena/db";

export const SAMPLE_SUBMISSIONS: Submission[] = [
  {
    id: "1",
    codeSnippet: `var twoSum = function(nums, target) {
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
    memoryInKb: 42.3,
    timeInMs: 64,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    language: "JAVASCRIPT",
    problemId: "two-sum",
    userId: "user123",
    contestId: null,
    errorMessage: null,
  },
  {
    id: "2",
    codeSnippet: `var twoSum = function(nums, target) {
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
    language: "JAVASCRIPT",
    contestId: null,
    errorMessage: null,
    memoryInKb: null,
    timeInMs: null,
    problemId: "two-sum",
    userId: "user123",
  },
  {
    id: "3",
    codeSnippet: `var twoSum = function(nums, target) {
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
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    language: "JAVASCRIPT",
    contestId: null,
    errorMessage: null,
    memoryInKb: null,
    timeInMs: null,
    problemId: "two-sum",
    userId: "user123",
  },
];
