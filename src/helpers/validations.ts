// Different Validations, for additional GameModes/Settings

export const continuationValidation = (prevWord: string, newWord: string): boolean => {
  return newWord[0] == prevWord[prevWord.length - 1] ? true : false
}

export const wordValidation = (newWord: string): boolean => {
  // Existing the the db
  return newWord ? true : false
}
