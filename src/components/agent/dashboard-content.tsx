import { AgentMetricsCards } from '@/components/agent/metrics-cards'
import { DistributionHistory } from '@/components/agent/distribution-history'
import { getAgentDashboardData } from '@/app/dashboard/agent/actions'

export async function AgentDashboardContent() {
  let data;
  try {
    data = await getAgentDashboardData()
  } catch (err) {
    data = {
      distributions: [],
      metrics: {
        distributedToday: 0,
        staffServed: 0,
        totalThisWeek: 0,
        activeStaffCount: 0
      }
    }
  }

  return (
    <>
      <section className="mb-8">
        <AgentMetricsCards metrics={data.metrics} />
      </section>

      <section className="grid grid-cols-1 gap-6">
        <DistributionHistory distributions={data.distributions} />
      </section>
    </>
  )
}
