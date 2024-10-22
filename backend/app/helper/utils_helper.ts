// Utility function to shuffle an array -  This function uses the Fisher-Yates shuffle algorithm to shuffle the elements in the array in place. - https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}
