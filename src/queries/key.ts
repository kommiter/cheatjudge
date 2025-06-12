export const queryKeys = {
  submitCode: {
    all: ['submitCode'] as const,
    submit: (data: unknown) =>
      [...queryKeys.submitCode.all, 'submit', data] as const,
  },
} as const
