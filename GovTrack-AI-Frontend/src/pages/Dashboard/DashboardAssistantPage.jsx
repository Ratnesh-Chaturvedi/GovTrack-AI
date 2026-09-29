import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { AssistantPage } from '../Assistant/AssistantPage'
import { readDemoUserName } from '../../utils/dashboardUtils'
import './DashboardPage.css'

export function DashboardAssistantPage() {
  return <DashboardLayout showProjectControls={false} userName={readDemoUserName()} view="assistant"><AssistantPage embedded /></DashboardLayout>
}
