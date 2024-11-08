'use client'

import React from 'react'
import { useFlashcardSetsData } from '@/components/context/FlashcardSetsContext'
import Carousel from '@/components/Carousel'
import type { FlashcardSet } from '@/lib/definitions'
import { useRouter } from 'next/navigation'

const Page = () => {
  const flashcardSets = useFlashcardSetsData()
  const router = useRouter()

  if (!flashcardSets) {
    return <></>
  }

  const handleItemClick = (set: FlashcardSet ) => {
    console.log('Clicked Flashcard Set ID:', set.id)
    router.push(`/flashcards/${set.id}`)
  }

  const renderFlashcardSet = (set: FlashcardSet) => (
    <>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{set.name}</h3>
      <p className="text-sm text-gray-600">Cards: {set.cards.length}</p>
    </>
  )

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-10 mb-32">User Library</h1>
      <Carousel
        items={flashcardSets}
        renderItem={renderFlashcardSet}
        title="Created Flashcard Sets"
        itemsPerPage={2}
        clickable={true}
        onClick={handleItemClick}
      />
    </div>
  )
}

export default Page