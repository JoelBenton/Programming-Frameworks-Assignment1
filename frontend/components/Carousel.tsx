import { useState } from "react"

interface CarouselProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  title: string
  itemsPerPage?: number
  clickable?: boolean
  onClick?: (item: T) => void
}

const Carousel = <T,>({
  items,
  renderItem,
  title,
  itemsPerPage = 2,
  clickable = false,
  onClick,
}: CarouselProps<T>) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex + itemsPerPage < items.length) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const displayedItems = items.slice(currentIndex, currentIndex + itemsPerPage)

  return (
    <div className="flex flex-col justify-center w-full max-w-[75%] p-6 rounded-xl bg-[#ffebcd] border border-gray-300 shadow-lg">
      <h2 className="text-xl text-gray-600 font-semibold mb-4 text-center">{title}</h2>

      <div className="flex items-center justify-center gap-7">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className={`${
            currentIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'
          } p-3 rounded-full transition-colors`}
        >
          <span className="text-3xl font-bold">{'<'}</span>
        </button>

        <div className="flex justify-center gap-8">
          {displayedItems.map((item, index) => (
            <div
              key={index}
              className={`w-[400px] h-[120px] p-6 bg-white border border-gray-200 rounded-xl shadow text-center ${
                clickable ? 'cursor-pointer hover:bg-gray-100' : ''
              }`}
              onClick={clickable ? () => onClick?.(item) : undefined}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>

        <button
          onClick={goToNext}
          disabled={currentIndex + itemsPerPage >= items.length}
          className={`${
            currentIndex + itemsPerPage >= items.length ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'
          } p-3 rounded-full transition-colors`}
        >
          <span className="text-3xl font-bold">{'>'}</span>
        </button>
      </div>
    </div>
  )
}

export default Carousel