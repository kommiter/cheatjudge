module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100], // 제목 길이 100자 제한
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'feature'],
    ],
    'subject-case': [0],
    'subject-full-stop': [2, 'never', '.'], // 제목 끝에 . 금지
    'references-empty': [2, 'never'], // (#숫자) 필수
  },
}
