export const problems = [
  {
  id: 1,

  title: "Two Sum",

  difficulty: "Easy",

  topic: "Array",

  companies: ["Google", "Amazon"],

  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",

  bruteForce:
    "Use two nested loops and check every pair of elements.",

  optimal:
    "Use a HashMap to store visited numbers and find complements in O(1).",

  complexity: {
    brute: "O(n²)",
    optimal: "O(n)",
  },

  pattern: "Hashing",

  interviewTips: [
    "Clarify if array is sorted.",
    "Ask if multiple answers exist.",
    "Mention HashMap optimization quickly."
  ],

  mistakes: [
    "Using same element twice.",
    "Forgetting duplicate values.",
    "Returning values instead of indices."
  ],

  starterCode: {
  javascript: `function twoSum(nums, target) {

}`,

  python: `def twoSum(nums, target):

    pass`,
    
  java: `class Solution {

    public int[] twoSum(int[] nums, int target) {

    }

}`,

  cpp: `class Solution {
public:

    vector<int> twoSum(vector<int>& nums, int target) {

    }

};`
},

visibleTests: [
  {
    input: [[2, 7, 11, 15], 9],
    expected: "[0,1]"
  }
],

hiddenTests: [
  {
    input: [[3, 2, 4], 6],
    expected: "[1,2]"
  },

  {
    input: [[1, 5, 3, 7], 8],
    expected: "[0,3]"
  }
],
  },

  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Sliding Window",

    companies: ["Amazon", "Microsoft"],

    description:
      "Find the length of the longest substring without repeating characters.",

    bruteForce:
      "Generate all substrings and check duplicates.",

    optimal:
      "Use sliding window with HashSet.",

    pattern: "Sliding Window",

    starterCode: `function lengthOfLongestSubstring(s) {

}`,
  },

  {
    id: 3,
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    topic: "Linked List",

    companies: ["Google", "Meta"],

    description:
      "Merge k sorted linked lists and return one sorted list.",

    bruteForce:
      "Merge lists one by one.",

    optimal:
      "Use Min Heap / Priority Queue.",

    pattern: "Heap",

    starterCode: `function mergeKLists(lists) {

}`,
  },
];