import { HistoryCard } from "./historyCard"

export const HistoryPage = ()=>{
    return (
        <div className="bg-gray-300 mt-12 min-h-screen max-w-sm flex flex-col">
          <HistoryCard></HistoryCard>
          <HistoryCard></HistoryCard>
        </div>
    )
}