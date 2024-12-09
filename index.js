'use strict'

const eventTypes = [
  'marker',
  'note',
  'rest',
  'rested',
  'tail',
  'tempo',
]
const eventTypesWithoutData = [
  'rest',
  'tail',
]

const isNumber = value => typeof value === 'number'
const isStrinfiedInt = value => Number.isInteger(parseInt(value))

const splitOutFirstWord = str => {
  str = str.trimStart()
  const foundWhitespace = str.match(/\s/)
  if (!foundWhitespace) return [str, '']
  const indexOfFirstWhitespace = foundWhitespace.index
  const firstWord = str.substring(0, indexOfFirstWhitespace)
  const restOfStr = str.substring(indexOfFirstWhitespace + 1)
  return [firstWord, restOfStr]
}

const toArray = musicline => {
  const array = []
  const lines = musicline.split(/\r\n|\r|\n/)
  lines.forEach(line => {
    line = line.trimStart()
      // Skip empty lines and comments.
    if (line !== '' && line.at(0) !== '#') {
      let timepoint, lineWithoutTimepoint
      [timepoint, lineWithoutTimepoint] = splitOutFirstWord(line)
      timepoint = parseFloat(timepoint)
      if (isNumber(timepoint)) {
        let voice, eventTypeAndData, eventType, eventData
        [voice, eventTypeAndData] = splitOutFirstWord(lineWithoutTimepoint)
          // Handle Musicline short form.
        if (voice === '' || !isStrinfiedInt(voice)) {
          if (voice === '') {
            eventType = 'rest'
            eventData = null
          }
          else {
            eventType = 'note'
            eventData = lineWithoutTimepoint.trimStart()
          }
          voice = 1
          // Handle Musicline Long form.
        }
        else if (isStrinfiedInt(voice)) {
          voice = parseInt(voice)
          let [firstWord, restOfLine] = splitOutFirstWord(eventTypeAndData)
          eventType = firstWord
          eventData = eventTypesWithoutData.includes(eventType)
           ? null
           : restOfLine.trimStart()
        }
        if (eventData !== null && eventData.startsWith('\\')) {
          eventData = eventData.substring(1)
        }
        array.push([
          timepoint,
          voice,
          eventType,
          eventData,
        ])
      }
    }
  })
  return array
}

const toObject = musicline => {
  const array = toArray(musicline)
  const object = { musicline: [] }
  array.forEach(line => {
    object.musicline.push({
      timepoint: line[0],
      voice: line[1],
      eventType: line[2],
      eventData: line[3],
    })
  })
  return object
}

const toJSON = musicline => JSON.stringify(toObject(musicline))

const validate = musicline => {
  let valid = true
  const array = toArray(musicline)
  for (let i = 0, len = array.length; i < len; i++) {
    const line = array[i]
    if (
      !isNumber(line[0]) ||
      !Number.isInteger(line[1]) ||
      !eventTypes.includes(line[2]) ||
      (
        line[3] === null &&
        typeof line[3] === 'string'
      )
    ) {
      valid = false
      break
    }
  }
  return valid
}

exports.toArray = toArray
exports.toObject = toObject
exports.toJSON = toJSON
exports.validate = validate
module.exports = exports
