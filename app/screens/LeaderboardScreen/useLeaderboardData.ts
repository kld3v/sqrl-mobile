import { useMemo, useState } from "react"
import { UserScore } from "./LeaderboardScreen.types"

export default () => {
  const [leaderboardData, setLeaderboardData] = useState<UserScore[]>([])

  const sortedLeaderboardData = useMemo(() => {
    const sortedData = [...leaderboardData].sort((a, b) => b.score - a.score)
    return sortedData
  }, [leaderboardData])

  return {
    leaderboardData,
    setLeaderboardData,
    sortedLeaderboardData,
  }
}
