import { useState, useEffect } from 'react'

export const useExamTimer = (initialTime: number) => {
  const [remainingTime, setRemainingTime] = useState(initialTime)

  useEffect(() => {
    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          console.log('시간 종료!')
          clearInterval(timerId)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timerId)
  }, [])

  return { remainingTime }
}
