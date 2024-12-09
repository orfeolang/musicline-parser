'use strict'

const {
  toArray,
  toObject,
  toJSON,
  validate,
} = require('./index')

const input =
`
    
# Ignore this start of line comment.

    # Short form. (ignore this comment)
0
    0    
0 Short form data.
123.456 Short form data with a float timepoint.
0 Short form data with four spaces after.    
0     Short form data with four unescaped spaces before.
0 \\    Short form data with four escaped spaces before.
0 \\1 Short form data that starts with a number.
0 \\\\ Short form data that starts with a backslash.

    # Long form. (ignore this comment)
0 1 marker This is marker data
0 1 note   This is note data
0 1 rest
0 1 rested This is rested data
0 1 tail
0 1 tempo  This is tempo data
`

const expected = [
  { timepoint: 0,       voice: 1, eventType: 'rest',   eventData: null                                                   },
  { timepoint: 0,       voice: 1, eventType: 'rest',   eventData: null                                                   },
  { timepoint: 0,       voice: 1, eventType: 'note',   eventData: 'Short form data.'                                     },
  { timepoint: 123.456, voice: 1, eventType: 'note',   eventData: 'Short form data with a float timepoint.'              },
  { timepoint: 0,       voice: 1, eventType: 'note',   eventData: 'Short form data with four spaces after.    '          },
  { timepoint: 0,       voice: 1, eventType: 'note',   eventData: 'Short form data with four unescaped spaces before.'   },
  { timepoint: 0,       voice: 1, eventType: 'note',   eventData: '    Short form data with four escaped spaces before.' },
  { timepoint: 0,       voice: 1, eventType: 'note',   eventData: '1 Short form data that starts with a number.'         },
  { timepoint: 0,       voice: 1, eventType: 'note',   eventData: '\\ Short form data that starts with a backslash.'     },
  { timepoint: 0,       voice: 1, eventType: 'marker', eventData: 'This is marker data'                                  },
  { timepoint: 0,       voice: 1, eventType: 'note',   eventData: 'This is note data'                                    },
  { timepoint: 0,       voice: 1, eventType: 'rest',   eventData: null                                                   },
  { timepoint: 0,       voice: 1, eventType: 'rested', eventData: 'This is rested data'                                  },
  { timepoint: 0,       voice: 1, eventType: 'tail',   eventData: null                                                   },
  { timepoint: 0,       voice: 1, eventType: 'tempo',  eventData: 'This is tempo data'                                   },
]

const output = toObject(input)

let passed = 0
let failed = 0
output.musicline.forEach((line, i) => {
  let result = JSON.stringify(line) === JSON.stringify(expected[i])
  if (result) {
    passed++
  } else {
    console.log(i + ': ' + JSON.stringify(line))
    failed++
  }
})

console.log((failed + passed) + ' tests run')
console.log('passed: ' + passed)
console.log('failed: ' + failed)

console.log('----------------------------------------------------------------------')
console.log(toArray(input))
console.log('----------------------------------------------------------------------')
console.log(toObject(input))
console.log('----------------------------------------------------------------------')
console.log(toJSON(input))
console.log('----------------------------------------------------------------------')
console.log(validate(input))
