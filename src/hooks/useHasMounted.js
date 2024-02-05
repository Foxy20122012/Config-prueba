
import { useEffect, useState } from "react"

const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    // console.log('page is mounted')
  }, [])

  return hasMounted
}

export default useHasMounted
