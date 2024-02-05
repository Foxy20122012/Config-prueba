import { useContext } from "react"
import { LayoutContext } from '@/layout/ResponsiveContainer'

const useGlobalContainer = () => {
  const container = useContext(LayoutContext)
  return container
}

export default useGlobalContainer
