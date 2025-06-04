import { useEffect, useState, useCallback } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useCalibration } from '@/contexts/CalibrationProvider'
import ActivityWarningModal from '@/components/common/ActivityWarningModal'

export default function UserLayout() {
  const navigate = useNavigate()
  const { isCalibrated, userActivity, resetCalibration } = useCalibration()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!isCalibrated) {
      navigate('/calibration')
    }
  }, [isCalibrated, navigate])

  // 사용자 활동 경고 모달 표시 로직
  useEffect(() => {
    if (isCalibrated && userActivity.warningLevel > 0) {
      setIsModalOpen(true)
    } else {
      setIsModalOpen(false)
    }
  }, [isCalibrated, userActivity.warningLevel])

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleForceExit = useCallback(() => {
    resetCalibration()
    navigate('/calibration')
  }, [resetCalibration, navigate])

  // 강제 종료 처리
  useEffect(() => {
    if (userActivity.warningLevel === 3) {
      handleForceExit()
    }
  }, [userActivity.warningLevel, handleForceExit])

  if (!isCalibrated) {
    return null // 리다이렉트 중에는 아무것도 렌더링하지 않음
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
