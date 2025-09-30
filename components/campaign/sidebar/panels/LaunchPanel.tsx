import ReusableButton from '@/components/ui/ReusableButton'
import { Plus } from 'lucide-react'
import React from 'react'

const LaunchPanel = () => {
  return (
    <div>   <div className="mt-4 space-y-3">
      <div className="text-center py-4">
        <div className="text-sm text-gray-600 mb-2">Campaign not ready to launch</div>
        <div className="text-xs text-gray-500">Complete all previous steps to launch</div>
      </div>
      <ReusableButton disabled variant="secondary" icon={Plus} className="w-full">
        Launch Campaign
      </ReusableButton>
    </div></div>
  )
}

export default LaunchPanel

 