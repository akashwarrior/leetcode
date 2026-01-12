import type {
  Contest,
  Language,
  ProblemCategory,
  ProblemListItem,
  ProblemWithSnippets,
  Submission,
  Tag,
} from "./types";

export const LANGUAGES: Language[] = [
  { id: 1, name: "JavaScript", monacoId: "javascript" },
  { id: 2, name: "Python", monacoId: "python" },
  { id: 3, name: "Java", monacoId: "java" },
  { id: 4, name: "C++", monacoId: "cpp" },
  { id: 5, name: "TypeScript", monacoId: "typescript" },
  { id: 6, name: "Go", monacoId: "go" },
  { id: 7, name: "Rust", monacoId: "rust" },
];

export const TAGS: Tag[] = [
  { id: "array", name: "Array" },
  { id: "hash-table", name: "Hash Table" },
  { id: "dp", name: "Dynamic Programming" },
  { id: "string", name: "String" },
  { id: "math", name: "Math" },
  { id: "tree", name: "Tree" },
  { id: "graph", name: "Graph" },
  { id: "sliding-window", name: "Sliding Window" },
  { id: "two-pointers", name: "Two Pointers" },
  { id: "binary-search", name: "Binary Search" },
];

const SEED_PROBLEMS: ProblemWithSnippets[] = [
  {
    id: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "EASY",
    isPublished: true,
    submitCount: 10234567,
    acceptedCount: 5432189,
    timeLimitMs: 2000,
    memoryLimitKb: 256000,
    tags: [TAGS[0], TAGS[1]],
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
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "MEDIUM",
    isPublished: true,
    submitCount: 9876543,
    acceptedCount: 4123456,
    timeLimitMs: 2000,
    memoryLimitKb: 256000,
    tags: [TAGS[3], TAGS[7]],
    hints: ["Try a sliding window.", "Track latest index of each character."],
    description: `<p>Given a string <code>s</code>, find the length of the longest substring without repeating characters.</p>
<p><strong>Example:</strong> s = "abcabcbb" -> 3</p>`,
    codeSnippets: [
      {
        languageId: 1,
        code: `function lengthOfLongestSubstring(s) {\n  let left = 0;\n  let best = 0;\n  const last = new Map();\n\n  for (let right = 0; right < s.length; right++) {\n    const ch = s[right];\n    if (last.has(ch) && last.get(ch) >= left) {\n      left = last.get(ch) + 1;\n    }\n    last.set(ch, right);\n    best = Math.max(best, right - left + 1);\n  }\n\n  return best;\n}`,
      },
    ],
    testCases: [
      { id: "1", input: '"abcabcbb"', output: "3", isVisible: true },
      { id: "2", input: '"bbbbb"', output: "1", isVisible: true },
    ],
  },
  {
    id: 3,
    title: "Median of Two Sorted Arrays",
    slug: "median-of-two-sorted-arrays",
    difficulty: "HARD",
    isPublished: true,
    submitCount: 5432109,
    acceptedCount: 1234567,
    timeLimitMs: 2000,
    memoryLimitKb: 256000,
    tags: [TAGS[0], TAGS[9]],
    hints: ["Binary search over partition.", "Keep left partition balanced."],
    description: `<p>Given two sorted arrays <code>nums1</code> and <code>nums2</code>, return the median of the two sorted arrays.</p>
<p>The required complexity is <code>O(log(m+n))</code>.</p>`,
    codeSnippets: [
      {
        languageId: 1,
        code: `function findMedianSortedArrays(nums1, nums2) {\n  // TODO: implement binary-partition approach.\n}`,
      },
    ],
    testCases: [
      { id: "1", input: "[1,3]\n[2]", output: "2.00000", isVisible: true },
      { id: "2", input: "[1,2]\n[3,4]", output: "2.50000", isVisible: true },
    ],
  },
];

const EXTRA_TITLES = [
  "Merge Intervals",
  "Group Anagrams",
  "Kth Largest Element in an Array",
  "Top K Frequent Elements",
  "Binary Tree Level Order Traversal",
  "Number of Islands",
  "Rotate Image",
  "Coin Change",
  "Word Break",
  "Minimum Window Substring",
  "Course Schedule",
  "Trapping Rain Water",
  "Product of Array Except Self",
  "Search in Rotated Sorted Array",
  "Longest Increasing Subsequence",
];

const buildProblem = (title: string, index: number): ProblemWithSnippets => {
  const id = index + 4;
  const difficulty = (["EASY", "MEDIUM", "HARD"] as const)[id % 3];
  const firstTag = TAGS[id % TAGS.length];
  const secondTag = TAGS[(id + 4) % TAGS.length];
  return {
    id,
    title,
    slug: title.toLowerCase().replaceAll(/[^a-z0-9 ]/g, "").replaceAll(" ", "-"),
    difficulty,
    isPublished: true,
    submitCount: 300000 + id * 12731,
    acceptedCount: 120000 + id * 5279,
    timeLimitMs: 2000,
    memoryLimitKb: 256000,
    tags: [firstTag, secondTag],
    hints: [
      "Start with a brute force baseline then optimize.",
      "Look for recurring substructure in the input.",
    ],
    description: `<p>Solve <strong>${title}</strong> with an efficient algorithm.</p><p>This is synthetic demo content for the frontend experience.</p>`,
    codeSnippets: [
      {
        languageId: 1,
        code: `function solve(input) {\n  // TODO: ${title}\n  return input;\n}`,
      },
      {
        languageId: 2,
        code: `class Solution:\n    def solve(self, input):\n        pass`,
      },
    ],
    testCases: [
      { id: `${id}-1`, input: "sample input 1", output: "sample output 1", isVisible: true },
      { id: `${id}-2`, input: "sample input 2", output: "sample output 2", isVisible: true },
      { id: `${id}-3`, input: "hidden stress", output: "n/a", isVisible: false },
    ],
  };
};

export const PROBLEMS: ProblemWithSnippets[] = [
  ...SEED_PROBLEMS,
  ...EXTRA_TITLES.map(buildProblem),
];

export const PROBLEM_LIST: ProblemListItem[] = PROBLEMS.map((p) => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  difficulty: p.difficulty,
  submitCount: p.submitCount,
  acceptedCount: p.acceptedCount,
  tags: p.tags,
  status: p.id % 4 === 0 ? "SOLVED" : p.id % 5 === 0 ? "ATTEMPTED" : undefined,
}));

export const PROBLEM_CATEGORIES: ProblemCategory[] = [
  {
    id: "1",
    title: "Top Interview 150",
    description: "Must-do list for interview prep",
    problemCount: 150,
    slug: "top-interview-150",
  },
  {
    id: "2",
    title: "CodeArena 75",
    description: "Ace Coding Interview with 75 Questions",
    problemCount: 75,
    slug: "leetcode-75",
  },
  {
    id: "3",
    title: "SQL 50",
    description: "Crack SQL Interview in 50 Questions",
    problemCount: 50,
    slug: "sql-50",
  },
  {
    id: "4",
    title: "Beginner Topics",
    description: "Arrays, Strings, Linked Lists",
    problemCount: 45,
    slug: "beginner",
    difficulty: "EASY",
  },
  {
    id: "5",
    title: "Dynamic Programming",
    description: "Master DP patterns",
    problemCount: 89,
    slug: "dynamic-programming",
    difficulty: "MEDIUM",
  },
  {
    id: "6",
    title: "Graph Algorithms",
    description: "BFS, DFS, Shortest Path",
    problemCount: 67,
    slug: "graph",
    difficulty: "MEDIUM",
  },
  {
    id: "7",
    title: "Binary Search",
    description: "Search algorithms and variations",
    problemCount: 34,
    slug: "binary-search",
    difficulty: "MEDIUM",
  },
  {
    id: "8",
    title: "Hard Collection",
    description: "Challenge yourself",
    problemCount: 125,
    slug: "hard-collection",
    difficulty: "HARD",
  },
];

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

export type DifficultyFilter = "ALL" | "EASY" | "MEDIUM" | "HARD";

export const STREAK_DAYS = 36;

export const CURRENT_USER = {
  id: "demo-user",
  name: "Akash Sharma",
  userName: "akash_codes",
  rank: 28472,
  solved: 147,
  contests: 28,
  avatar: "",
};

export const ACTIVITY_HEATMAP = Array.from({ length: 364 }, (_, idx) => {
  // Seeded pseudo-random for deterministic but natural-looking data 
  const seed = ((idx * 2654435761) >>> 0) % 100;
  const dayOfWeek = idx % 7;
  const weekIdx = Math.floor(idx / 7);
  // Simulate more activity on weekdays and in recent weeks
  const recencyBoost = weekIdx > 40 ? 20 : weekIdx > 30 ? 12 : weekIdx > 20 ? 6 : 0;
  const weekdayBoost = dayOfWeek < 5 ? 12 : 0;
  // Add a "break" period in weeks 10-15 for realism
  const breakPenalty = weekIdx >= 10 && weekIdx <= 15 ? -20 : 0;
  const score = seed + recencyBoost + weekdayBoost + breakPenalty;
  let count = 0;
  if (score > 88) count = 4;
  else if (score > 75) count = 3;
  else if (score > 58) count = 2;
  else if (score > 40) count = 1;
  return { day: idx + 1, count };
});

export const CONTEST_LEADERBOARD = [
  { rank: 1, user: "tourist_x", score: 18, penalty: 312 },
  { rank: 2, user: "benq_ai", score: 17, penalty: 337 },
  { rank: 3, user: "jiangly_loop", score: 16, penalty: 380 },
  { rank: 4, user: "akash_codes", score: 15, penalty: 419 },
  { rank: 5, user: "ada_love", score: 14, penalty: 442 },
];

export function getProblemBySlug(slug: string) {
  return PROBLEMS.find((problem) => problem.slug === slug);
}

export function formatAcceptanceRate(accepted: number, submitted: number) {
  return `${((accepted / submitted) * 100).toFixed(1)}%`;
}
