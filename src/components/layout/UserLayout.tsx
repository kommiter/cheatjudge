import { useEffect, useState, useCallback } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useCalibration } from '@/contexts/CalibrationProvider'
import ActivityWarningModal from '@/components/common/ActivityWarningModal'

export default function UserLayout() {
  const navigate = useNavigate()
  const {
    isCalibrated,
    isWebGazerReady,
    userActivity,
    resetCalibration,
    startGazeTracking,
  } = useCalibration()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 캐릭터 교정 확인 및 리다이렉트
  useEffect(() => {
    if (!isCalibrated) {
      navigate('/calibration', { replace: true })
    }
  }, [isCalibrated, navigate])

  // WebGazer 준비되면 시선 추적 시작
  useEffect(() => {
    if (isWebGazerReady && isCalibrated) {
      startGazeTracking()
    }
  }, [isWebGazerReady, isCalibrated, startGazeTracking])

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleForceExit = useCallback(() => {
    resetCalibration()
    navigate('/calibration')
  }, [resetCalibration, navigate])

  // 사용자 활동 모니터링
  useEffect(() => {
    if (userActivity.warningLevel > 0 && !isModalOpen) {
      setIsModalOpen(true)
    }

    // 경고 레벨 3일 때 강제 종료
    if (userActivity.warningLevel >= 3) {
      handleForceExit()
    }
  }, [userActivity.warningLevel, isModalOpen, handleForceExit])

  if (!isCalibrated) {
    return null
  }

  return (
    <>
      <Outlet />
      <ActivityWarningModal
        isOpen={isModalOpen}
        warningLevel={userActivity.warningLevel}
        onClose={handleModalClose}
        onForceExit={handleForceExit}
      />
    </>
  )
}
