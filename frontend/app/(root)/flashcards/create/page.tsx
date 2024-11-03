'use client'

import { Trash2Icon } from 'lucide-react'
import React, { useState } from 'react'

const Page = async () => {

  const [title, setTitle] = useState("")
  const [cards, setCards] = useState(
    Array(5).fill({ question: "", answer: "", difficulty: "Easy" })
  )

  const handleCardChange = (index: number, field: string, value: string) => {
    const newCards = [...cards]
    newCards[index] = { ...newCards[index], [field]: value }
    setCards(newCards)
  }

  const handleDeleteCard = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index)
    setCards(newCards)
  }

  const addNewCard = () => {
    setCards([...cards, { question: "", answer: "", difficulty: "Easy" }])
  }

  return (
    <div className="flex justify-center items-start min-h-screen py-10 overflow-auto">
      <div className="flex w-3/5 h-full flex-col items-start p-6 shadow-xl rounded-3xl">
        <div className='p-3 pt-10 w-full pb-10 text-4xl font-bold'>Create a new flashcard set</div>
        
        <input
          className='w-full h-12 rounded-xl bg-gradient-to-r from-[#ddf8ec] to-[#b3c7f9] text-black p-2'
          placeholder='Enter a title, like "Geography"'
          onChange={(event) => {setTitle(event.target.value)}}
        />

        <div className='p-3 pt-10 text-4xl font-bold'>Cards</div>
        
        {/* Render Flashcard inputs */}
        {cards.map((card, index) => (
          <div key={index} className='w-full bg-gradient-to-br from-[#c2e0d3] to-[#b3c7f9] rounded-xl shadow-xl p-4 my-4'>
            <div className="flex items-center justify-between">
              <input
                className="w-[40%] h-10 text-black p-2 mb-1 bg-transparent border-b-2 border-gray-400 focus:border-violet-500 outline-none"
                placeholder={`Question for card ${index + 1}`}
                value={card.question}
                onChange={(event) => handleCardChange(index, "question", event.target.value)}
              />
              <input
                className="w-[40%] h-10 text-black p-2 mb-1 bg-transparent border-b-2 border-gray-400 focus:border-violet-500 outline-none"
                placeholder={`Answer for card ${index + 1}`}
                value={card.answer}
                onChange={(event) => handleCardChange(index, "answer", event.target.value)}
              />
              <select
                className="w-[10%] h-10 p-2 rounded-xl bg-gradient-to-r from-[#ddf8ec] to-[#b3c7f9] text-black outline-none"
                value={card.difficulty}
                onChange={(event) => handleCardChange(index, "difficulty", event.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <Trash2Icon className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDeleteCard(index)} />
            </div>
          </div>
        ))}

        {/* "Add a new card" button */}
        <button
          className='w-full h-10 rounded-xl bg-blue-500 text-white p-2 mt-4'
          onClick={addNewCard}
        >
          Add a new card
        </button>

        <div className="flex justify-center mt-4 w-full">
          <button
            className='w-[200px] h-10 rounded-xl bg-blue-500 text-white p-2'
          >
            Create Flashcard
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page