import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

import React from 'react'

const page = async () => {

  const session = await getSession()
  if (!session) {
    redirect('/')
  }

  return (
    <div>
      Admin
    </div>
  )
}

export default page
