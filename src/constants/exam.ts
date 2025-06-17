import { ExamData } from '@/types/exam'

export const INITIAL_EXAM_TIME = 30 * 60 // 30분을 초 단위로

export const INITIAL_CODE = `#include <iostream>
using namespace std;

int main() {
  return 0;
}`

export const MOCK_EXAM_DATA: ExamData = {
  totalProblems: 1,
  currentProblem: 1,
  problems: [
    { id: 1, title: '두 수의 합', difficulty: '쉬움', completed: true },
    // { id: 2, title: '배열 정렬', difficulty: '중간', completed: false },
  ],
}

// 테스트 케이스 목 데이터
export const MOCK_TEST_CASES: Record<
  number,
  Array<{ input: string; expectedOutput: string }>
> = {
  1: [
    // 문제 ID 1번: 두 수의 합
    {
      input: '1 2',
      expectedOutput: '3',
    },
    {
      input: '5 7',
      expectedOutput: '12',
    },
    {
      input: '10 20',
      expectedOutput: '30',
    },
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
