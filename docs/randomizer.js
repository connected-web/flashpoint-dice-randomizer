document.addEventListener('DOMContentLoaded', () => {
  $diceContainer = document.getElementById('dice-container')
  $d6 = document.getElementById('d6')
  $d8 = document.getElementById('d8')

  const rotations = ['340', '10', '40', '70', '100', '130']

  /* React to mouse clicks on the dice container */
  $diceContainer.addEventListener('click', () => {
    let n = 5
    let timeout = setInterval(() => {
      rollDice($d6, 6)
      rollDice($d8, 8)
      n--
      if (n <= 0) {
        clearInterval(timeout)
      }
    }, 125)
  })

  function rollDice($el, d) {
    const rotation = `rotate rotate${pick(rotations)}`
    $el.className = `dice d${d} d${d}-${roll(d)} ${rotation}`
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
})
