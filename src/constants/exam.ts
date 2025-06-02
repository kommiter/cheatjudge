import { TestResult, ExamData, Submission } from '@/types/exam'

export const INITIAL_EXAM_TIME = 30 * 60 // 30분을 초 단위로

export const INITIAL_CODE = `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`

export const MOCK_TEST_RESULTS: TestResult[] = [
  {
    id: 1,
    status: 'success',
    input: '1 2',
    expectedOutput: '3',
    actualOutput: '3',
    time: '0.001s',
  },
  {
    id: 2,
    status: 'error',
    input: '5 7',
    expectedOutput: '12',
    actualOutput: '13',
    time: '0.001s',
  },
  {
    id: 3,
    status: 'pending',
    input: '10 20',
    expectedOutput: '30',
    actualOutput: '',
    time: '',
  },
]

export const MOCK_EXAM_DATA: ExamData = {
  totalProblems: 5,
  currentProblem: 1,
  problems: [
    { id: 1, title: '두 수의 합', difficulty: '쉬움', completed: true },
    { id: 2, title: '배열 정렬', difficulty: '중간', completed: false },
    { id: 3, title: '이진 탐색', difficulty: '중간', completed: false },
    { id: 4, title: '링크드 리스트', difficulty: '어려움', completed: false },
    { id: 5, title: '동적 프로그래밍', difficulty: '어려움', completed: false },
  ],
}

export const INITIAL_EXAM_DATA = MOCK_EXAM_DATA

export const PROGRAMMING_LANGUAGES = [
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
] as const

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 3,
    submittedAt: '2025-03-19 14:32:45',
    language: 'C++',
    status: 'wrong' as const,
  },
  {
    id: 2,
    submittedAt: '2025-03-19 14:30:12',
    language: 'C++',
    status: 'compile_error' as const,
  },
  {
    id: 1,
    submittedAt: '2025-03-19 14:25:33',
    language: 'C++',
    status: 'wrong' as const,
  },
]
