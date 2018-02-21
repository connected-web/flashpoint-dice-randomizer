document.addEventListener('DOMContentLoaded', () => {
  $diceContainer = document.getElementById('dice-container')
  $d6 = document.getElementById('d6')
  $d8 = document.getElementById('d8')

  const rotations = ['340', '10', '40', '70', '100', '130']

  const dice = [
    {
      d: 6,
      $el: document.getElementById('d6'),
      counters: [],
      results: []
    },
    {
      d: 8,
      $el: document.getElementById('d8'),
      counters: [],
      results: []
    }
  ]

  const results = []

  dice.forEach(die => {
    const {d} = die
    while (die.counters.length < d) {
      let n = die.counters.length + 1
      $el = document.getElementById(`d${d}-${n}-counter`)
      die.counters.push({ $el, n, count: 0 })
    }
  })

  function renderDieCounters(die) {
    die.counters.forEach(counter => {
      const { $el, count } = counter
      $el.innerHTML = count
    })
  }

  function renderDiceResults(results) {
    const $el = document.getElementById('roll-results')
    const $result = document.createElement('p')
    $result.className = 'fade in'
    const result = results[0]
    const { d6, d8 } = result
    $result.innerHTML = [
      `<div class="dice d6 d6-${d6}"></div>`,
      `<div class="dice d8 d8-${d8}"></div>`
    ].join('')
    $el.insertBefore($result, $el.firstChild)
    if ($el.childNodes.length > results.length) {
      $el.removeChild($el.lastChild)
    }
  }

  /* React to mouse clicks on the dice container */
  $diceContainer.addEventListener('click', rollDice)

  function summarise(dice) {
    return dice.reduce((acc, die) => {
      acc[`d${die.d}`] = die.value
      return acc
    }, {})
  }

  function rollDice() {
    let n = 2
    let timeout = setInterval(() => {
      n--
      dice.forEach(die => {
        rollDie(die)
        if (n === 0) {
          die.results.unshift(die.value)
          die.counters[die.value - 1].count++
          renderDieCounters(die)
        }
      })
      if (n <= 0) {
        clearInterval(timeout)
        const summary = summarise(dice)
        results.unshift(summary)
        while (results.length > 5) {
          results.pop()
        }
        renderDiceResults(results)
      }
    }, 150)
  }

  function rollDie(die) {
    const {$el, d} = die
    const rotation = `rotate rotate${pick(rotations)}`
    die.value = roll(d)
    $el.className = `dice d${d} d${d}-${die.value}`
    setTimeout(() => {
      $el.className = `dice d${d} d${d}-${die.value} ${rotation}`
    }, 1)
  }

  /* Roll a dice between 1 and num */
  function roll(num) {
    return 1 + Math.round(Math.random() * num) % num
  }

  function pick(arr) {
    const n = arr.length
    return arr[roll(n) % n]
  }

  /* Test distribution of across 500,000,000 rolls */
  function test() {
    const rolls = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0}
    let n = 0
    while(n < 500000000) {
      rolls[roll(8)]++
      n++
    }
    console.log('Rolls', rolls)
  }

  /* Get this show on the road */
  rollDice()
})
