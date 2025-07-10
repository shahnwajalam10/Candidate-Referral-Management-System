import { Users, Clock, CheckCircle, XCircle } from "lucide-react"

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Candidates",
      value: stats?.total || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Pending",
      value: stats?.byStatus?.Pending || 0,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Hired",
      value: stats?.byStatus?.Hired || 0,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Rejected",
      value: stats?.byStatus?.Rejected || 0,
      icon: XCircle,
      color: "bg-red-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div key={card.title} className="card p-6">
          <div className="flex items-center">
            <div className={`${card.color} p-3 rounded-lg`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
