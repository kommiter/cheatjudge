import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useCalibration } from '@/contexts/CalibrationProvider'

export default function UserLayout() {
  const navigate = useNavigate()
  const { isCalibrated } = useCalibration()

  useEffect(() => {
    if (!isCalibrated) {
      navigate('/calibration')
    }
  }, [isCalibrated, navigate])

  if (!isCalibrated) {
    return null // 리다이렉트 중에는 아무것도 렌더링하지 않음
  }

  return <Outlet />
}
