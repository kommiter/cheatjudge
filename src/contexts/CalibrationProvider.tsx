import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

interface CalibrationContextType {
  isCalibrated: boolean
  setCalibrated: () => void
  resetCalibration: () => void
}

const CalibrationContext = createContext<CalibrationContextType | undefined>(
  undefined,
)

export function CalibrationProvider({ children }: { children: ReactNode }) {
  const [isCalibrated, setIsCalibrated] = useState(false)

  const setCalibrated = () => {
    setIsCalibrated(true)
  }

  const resetCalibration = () => {
    setIsCalibrated(false)
  }

  return (
    <CalibrationContext.Provider
      value={{
        isCalibrated,
        setCalibrated,
        resetCalibration,
      }}
    >
      {children}
    </CalibrationContext.Provider>
  )
}

export function useCalibration() {
  const context = useContext(CalibrationContext)
  if (context === undefined) {
    throw new Error('useCalibration must be used within a CalibrationProvider')
  }
  return context
}
