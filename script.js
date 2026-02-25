'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovement = function(movements, sort = false){

  // Resetuje zawartość kontenera z operacjami
  containerMovements.innerHTML = ''

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements

  // Dodaje operacje zapisane na kącie uzytkownika do kontenera
  movs.forEach(function(mov, i){

    const typeOfOperation = mov > 0 ? "deposit" : "withdrawal"

    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${typeOfOperation}">${i + 1} ${typeOfOperation} </div>
          <div class="movements__date"></div>
          <div class="movements__value">${mov}</div>
      </div>
    `

    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}


const calcDisplayBalance = function(acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0)
  labelBalance.textContent = `${balance} EUR`;
  acc.balance = balance
}



const calcDisplaySummary = function(account){
  const incomes = account.movements
      .filter(mov => mov > 0)
      .reduce((acc, mov) => acc + mov, 0)

  const out = account.movements
      .filter(mov => mov < 0)
      .reduce((acc, mov) => acc + mov, 0)

  const interest = account.movements
      .filter(mov => mov > 0)
      .map(deposit => deposit * account.interestRate/100)
      .filter((int, i, arr) => int >= 1)
      .reduce((acc, mov) => acc + mov, 0)

  labelSumIn.textContent = `${Math.round(incomes)}€`
  labelSumOut.textContent = `${Math.round(out)}€`
  labelSumInterest.textContent = `${Math.round(interest)}€`
}

const createUserName =function (acc) {
  // const nameToUpperCase = name.toUpperCase()
  // const nameDivided = nameToUpperCase.split(" ")
  // const initialsArr = nameDivided.map(function(name) {
  //     return name[0]
  // })
  // return initials = initialsArr.join("")

  acc.forEach(function(acc){
    acc.userName = acc.owner
      .toUpperCase()
      .split(" ")
      .map(name => name[0])
      .join("")
  })
}

createUserName(accounts)


//Event handler

let currentAccount

// // Moja wersja
// btnLogin.addEventListener('click', function(e) {
//   e.preventDefault()
//
//   const login = inputLoginUsername.value
//   const password = Number(inputLoginPin.value)
//
//
//     const account = accounts.find(acc => acc.userName === login)
//
//   if(account?.pin === password){
//     currentAccount = account
//   } else {
//     console.log("Bledne dane logowania")
//     currentAccount = undefined
//   }
//
//   console.log(currentAccount)
// })

function display(acc) {
  displayMovement(acc.movements)

  calcDisplayBalance(acc)

  calcDisplaySummary(acc)
}

// Wersja z kursu
btnLogin.addEventListener('click', function(e){
  e.preventDefault()

  if (accounts.find(acc => acc.userName === inputLoginUsername.value && acc.pin === Number(inputLoginPin.value))){

    currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value)

    //Display UI
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(" ")[0]}`

    containerApp.style.opacity = 1

    display(currentAccount)

    // Clear inputs fields
    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur()


  } else {
    alert("Błędne dane logowania")
  }
})

// Transfer money
// // Moja wersja
// btnTransfer.addEventListener('click', function(e){
//   e.preventDefault()
//
//   const amount = Number(inputTransferAmount.value)
//   const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value)
//
//
//   if (amount > 0 && amount <= currentAccount.balance && receiverAcc) {
//     receiverAcc.movements.push(amount)
//     currentAccount.movements.push(amount * -1)
//
//     displayMovement(currentAccount.movements)
//     calcDisplayBalance(currentAccount)
//
//     inputTransferTo.value = ''
//     inputTransferAmount.value = ''
//
//   } else {
//     console.log("Wystapil blad")
//
//     inputTransferTo.value = ''
//     inputTransferAmount.value = ''
//   }
// })

// Wersja z kursu
btnTransfer.addEventListener('click', function(e){
  e.preventDefault()
  const amount = Number(inputTransferAmount.value)
  const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value)

  if (amount > 0
      && currentAccount.balance >= amount &&
      receiverAcc &&
      receiverAcc?.userName !== currentAccount.userName) {
    currentAccount.movements.push(amount * -1)
    receiverAcc.movements.push(amount)

    display(currentAccount)

  } else {
  alert("Błąd podczas przelewu")

}
  inputTransferTo.value = ''
  inputTransferAmount.value = ''
})

// Usuniecie konta
btnClose.addEventListener('click', function(e){
  e.preventDefault()

  if(inputCloseUsername.value === currentAccount.userName
      && Number(inputClosePin.value) === currentAccount.pin){

    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName)

    accounts.splice(index, 1)

    containerApp.style.opacity = 0

  } else {

    alert("Błąd podczas usuwania konta")

  }

  inputClosePin.value = ''
  inputCloseUsername.value = ''

})


// Loan
// Moja wersja
btnLoan.addEventListener('click', function(e){
  e.preventDefault()

  const loneAmount = Number(inputLoanAmount.value)

  if(loneAmount > 0 && movements.some(mov => mov >= (loneAmount / 10))){
    currentAccount.balance += loneAmount
    currentAccount.movements.push(loneAmount)

  } else {
    alert("Błąd podczas pożyczki")
  }

  inputLoanAmount.value = ""

  display(currentAccount)

})

// Sortowanie
// Moja wersja
// let condition = false
//
// btnSort.addEventListener('click', function(e){
//   e.preventDefault()
//
//   condition ? condition = false : condition = true
//
//   displayMovement( currentAccount.movements, condition)
// })

//Wersja z kursu
let sorted = false
btnSort.addEventListener('click', function(e){
  e.preventDefault()
  displayMovement(currentAccount.movements, !sorted)
  sorted = !sorted
})
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd', 'e']

// // SLICE
// console.log(arr.slice(2))
// console.log(arr.slice(2, 4))
// console.log(arr.slice(-2))
// console.log(arr.slice(-1))
// console.log(arr.slice(1, -2))
// console.log(arr.slice())
// console.log([...arr])

// SPLICE
// console.log(arr.splice(2))
// console.log(arr)
// arr.splice(-1)
// console.log(arr)
// console.log(arr.splice(1, 2)) //
// console.log(arr)

// // REVERSE
// arr = ['a', 'b', 'c', 'd', 'e']
// const arr2 = ["j", "i", "h", "g", "f"]
// console.log(arr2.reverse()) // ['f', 'g', 'h', 'i', 'j']
// console.log(arr2)

// // CONCAT
// let arrX = ['a', 'b', 'c', 'd', 'e']
// let arrY = ['f', 'g', 'h', 'i', 'j']
//
// const arrZ = arrX.concat(arrY)
// console.log(arrZ) // ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

// // JOIN
// const alfabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
// console.log(alfabet.join(" --- ")) // 'a --- b --- c --- d --- e --- f --- g --- h --- i --- j'
//
// const numbers = [1,2,3,4,5,6,7,8,9]
//
// console.log(numbers.join()) // '1,2,3,4,5,6,7,8,9'

// // AT
// arr = [23, 11, 64]
// console.log(arr[0])
// console.log(arr.at(0))
/////////////////////////////////////////////////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // PĘTLA FOR
// for(const movement of movements) {
//   if(movement > 0) {
//     console.log(`You deposited ${movement}`)
//   } else {
//     console.log(`You withdrew ${movement * -1}`)
//   }
// }

// // forEach
// movements.forEach((element) => {
//   if(element > 0) {
//     console.log(`You deposited ${element}`)
//   } else {
//     console.log(`You withdrew ${element * -1}`)
//   }
// })
//
// const numbers = [1,2,3,4,5,6,8,9]
//
// // forEach dla Map i Set
//
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],])
//
// currencies.forEach((value, key,map) => {
//   console.log(`${key}: ${value}`)
// })
//
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

// CodingChallenge
/*
Julia and Kate are doing a study on dogs.
So each of them asked 5 dog owners about their dog's age, and
stored the data into an array (one array for each).
For now, they are just interested in knowing whether a dog is an adult or a puppy.
A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
//
// function checkDogs(dogsJulia, dogsKate){
//   const correctedDogsJulia = dogsJulia.slice(0,-2)
//   console.log()
//
//
// }
/////////////////////////////////////////////////

// // Zmiana waluty
// const  eurToUsd = 1.1
//
// const movementsUsd = account1.movements. map((mov) => {return mov * eurToUsd})
//
// console.log(movements)
// console.log(movementsUsd)
//
// const movmentsUSDFor = [];
// for(const mov of movements) {
//   movmentsUSDFor.push(mov * eurToUsd)
// }
// console.log(movmentsUSDFor)
//
//
// const movmentsDescriptions = movements.map((mov, index) => {
//     return `Movement ${index + 1}: ${mov > 0 ? `You deposited ${mov}` : `You withdrew ${mov * -1}`}`
// })
//
// console.log(movmentsDescriptions)


// // .filter()
// const deposits = movements.filter(function(mov){
//   return mov > 0;
// })
//
// const withdrawals = movements.filter(function(mov){
//   return (mov < 0)
// })
//
// console.log(deposits)
// console.log(withdrawals)

// const balance = movements.reduce((acc, mov) => acc + mov, 0)
// console.log(balance)
//
//
// // Maximum value
// const maxMovement = movements.reduce((acc, mov) => {
//   return acc > mov ? acc : mov
// }, movements[0])
//
// console.log(maxMovement)


// // Coding challenge 2
//
// const calcAverageHumanAge = function(arr){
//   const humanAges = arr.map((dogAge) => {
//     if(dogAge <= 2){
//       return 2 * dogAge
//     } else {
//       return 16 + dogAge * 4
//     }
//   })
//
//   console.log("Dogs ages to human ages: " + humanAges)
//
//   const adults = humanAges.filter((age) => {
//     return age >= 18
//   })
//   console.log("Reduced: " + adults)
//
//   const average = adults.reduce((acc, age) => acc + age, 0) / adults.length
//   console.log("Average human age: " + Math.round(average))
// }
//
// calcAverageHumanAge([5,2,4,1,15,8,3])
// calcAverageHumanAge([16,6,10,5,6,1,4])

// const  eurToUsd = 1.1
// const totalDepositsUSD = Math.round(movements
//     .filter(mov => mov > 0)
//     .map((mov) => mov * eurToUsd)
//     .reduce((acc, mov) => acc + mov, 0))
//
// console.log(totalDepositsUSD)


// // Coding challenge 3
// const calcAverageHumanAge = (ages) => {
//   const average = ages.map((dogAge) => {
//     return dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
//   }).filter((age) => {
//     return age >= 18
//   }).reduce((acc, age, i, arr) => {
//     return acc + age / arr.length
//   }, 0)
//   return Math.round(average)
// }
//
// console.log(calcAverageHumanAge([5,2,4,1,15,8,3]))
// console.log(calcAverageHumanAge([16,6,10,5,6,1,4]))

// console.log(movements) // [200, 450, -400, 3000, -650]
// console.log(movements.find(mov => mov > 500)) // 3000
// console.log(movements.find(mov => mov > 0)) // 200
// console.log(movements.find(mov => mov > 200)) // 450
// console.log(movements.find(mov => mov < 0)) // -400
// console.log(movements.find(mov => mov < -400)) // -650
//
// console.log(accounts)
// const account = accounts.find(acc => acc.owner === "Jessica Davis")
// console.log(account)
//
// for(let mov of movements) {
//   console.log(movements.find(mov => mov > 0))
// }

// console.log(movements)
// const lastWithdrawal = movements.findLast(acc => acc < 0)
// console.log(lastWithdrawal)


// // `Your latest large
// console.log(movements)
// const latestLargeMovement = movements.findLast(acc => Math.abs(acc) > 2000)
// const latestLargeMovementIndex = movements.findIndex(mov => mov === latestLargeMovement )
//
// const lastIndex = movements.findLastIndex(mov => mov)
//
// console.log(`Your latest large movement was ${latestLargeMovement} and was ${lastIndex - latestLargeMovementIndex} movement ago`)


// console.log(movements)
// console.log(movements.includes(-130)) // true

// // SOME
// console.log(movements)
// console.log(movements.some(mov => mov > 0)) //true
// console.log(movements.some(mov => mov > 2000)) // true
// console.log(movements.some(mov => mov > 5000)) // false

// // EVERY
// console.log(account4.movements)
// console.log(account4.movements.every(mov => mov > 0)) // true
//
// console.log(account1.movements)
// console.log(account1.movements.every(mov => mov > 0)) // false
//
// // Separate callback
// const deposit = mov => mov > 0
// console.log(movements.some(deposit))
// console.log(movements.every(deposit))
// console.log(movements.filter(deposit))

// //
// const arr = [[1,2,3],[4,5,6],7,8,9]
//
// console.log(arr.flat()) // [1, 2, 3, 4, 5, 6, 7, 8, 9]
//
// const flatArr = arr.flat()
// console.log(flatArr) // [1, 2, 3, 4, 5, 6, 7, 8, 9]
//
//
// const arrDeep = [[[1,2],3],[4,[5,6]],7,8,9]
// console.log(arrDeep.flat()) // [[1, 2], 3, 4, [5, 6], 7, 8, 9
//
// console.log(arrDeep.flat(2)) // 1, 2, 3, 4, 5, 6, 7, 8, 9
//
// const accountMovements = accounts.map(acc => acc.movements)
// console.log(accountMovements)
//
// const allMovements = movements.flat()
// console.log(allMovements)
// allMovements.reduce((acc,mov) => acc + mov, 0)
//

// ///////////////////////////////////////
// // Coding Challenge #4
//
// /*
// This time, Julia and Kate are studying the activity levels of different dog breeds.
//
// YOUR TASKS:
// 1. Store the the average weight of a "Husky" in a variable "huskyWeight"
// 2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
// 3. Create an array "allActivities" of all the activities of all the dog breeds
// 4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
// 5. Many dog breeds like to swim. What other activities do these dogs like?
// Store all the OTHER activities these breeds like to do in a unique array called "swimmingAdjacent".
// 6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
// 7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".
//
// BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.
//
// TEST DATA:
// */
//
//
// const breeds = [
//   {
//     breed: 'German Shepherd',
//     averageWeight: 32,
//     activities: ['fetch', 'swimming'],
//   },
//   {
//     breed: 'Dalmatian',
//     averageWeight: 24,
//     activities: ['running', 'fetch', 'agility'],
//   },
//   {
//     breed: 'Labrador',
//     averageWeight: 28,
//     activities: ['swimming', 'fetch'],
//   },
//   {
//     breed: 'Beagle',
//     averageWeight: 12,
//     activities: ['digging', 'fetch'],
//   },
//   {
//     breed: 'Husky',
//     averageWeight: 26,
//     activities: ['running', 'agility', 'swimming'],
//   },
//   {
//     breed: 'Bulldog',
//     averageWeight: 36,
//     activities: ['sleeping'],
//   },
//   {
//     breed: 'Poodle',
//     averageWeight: 18,
//     activities: ['agility', 'fetch'],
//   },
// ];
//
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // 1. Store the average weight of a "Husky" in a variable "huskyWeight"
// // // Moja wersja
// // const huskyWeight = breeds.reduce((acc, ele) => {
// //   if(ele.breed === 'Husky'){
// //     acc += ele.averageWeight
// //   }
// //
// //   return acc
// // }, 0)
// //
// // console.log(huskyWeight)
//
// // Wersja z kursu
// const huskyWeight2 = breeds.find((element) => element.breed === 'Husky').averageWeight
// console.log(huskyWeight2)
//
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// // 2.Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
// // // Moja wersja
// // const dogBothActivities = breeds.filter((element) => {return element.activities.includes("running") && element.activities.includes("fetch")})
// // console.log(dogBothActivities)
//
// // Wersja z kursu
// const dogBothActivities2 = breeds.find((breed) => breed.activities.includes('running') && breed.activities.includes('fetch')).breed
//
// console.log(`2: ${dogBothActivities2}`)
//
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // 3. Create an array "allActivities" of all the activities of all the dog breeds
// // // Moja wersja
// // const allActivities = breeds.reduce((acc, breed) => {
// //   if(acc.find(activity => activity === breed.activities)){
// //   } else {
// //     acc.push(breed.activities)
// //   }
// //   return acc.flat()
// // }, [])
// //
// // console.log(allActivities)
//
// // Wersja z kursu
// const allActivities2 = breeds.flatMap((breed) => breed.activities)
// console.log(`3: ${allActivities2} `)
//
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // 4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions).
// // HINT: Use a technique with a special data structure that we studied a few sections ago.
// const uniqueActivities = [...new Set(allActivities2)]
// console.log(`4: ${uniqueActivities}`)
//
//
// // 5. Many dog breeds like to swim. What other activities do these dogs like?
// const swimmingAdjacent = breeds.reduce((acc, breed) => {
//
//   if(breed.activities.find((element) => element === 'swimming')){
//     breed.activities.splice(breed.activities.indexOf('swimming'), 1)
//     acc.push(breed.activities)
//   }
//   return acc.flat()
//   }, [])
//
// console.log(swimmingAdjacent)
//
// // 6. Do all the breeds have an average weight of 10kg or more?
// // Log to the console whether "true" or "false".
// const averageWeightOfAllBreeds = breeds.reduce((acc, breed) => {
//   acc += breed.averageWeight
//   if(acc >= 10)
//   return acc
// } , 0)/breeds.length
//
// console.log(averageWeightOfAllBreeds)
// console.log(averageWeightOfAllBreeds >= 10)
//
//
// // 7. Are there any breeds that are "active"?
// // "Active" means that the dog has 3 or more activities.
// // Log to the console whether "true" or "false".
// const areActive = breeds.reduce((acc, breed) => {
//   if(breed.activities.length >= 3){
//     acc.push(true)
//   } else {
//     acc.push(false)
//   }
//   return acc
// }, [])
//
// console.log(areActive)
//
//


// Sortowanie

// //Strings
// const owners = ['Jonas', 'Zach', "Adam"]
// console.log(owners.sort()) // ["Adam", "Jonas", "Zach"]
//
// //numbers
// console.log(movements)
// console.log(movements.sort()) // [-130, -400, 160, 200, 3000, 450]
// console.log(movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
//   return 0;
// }))
//
// console.log(movements)
//
// const groupedMovements = Object.groupBy

// const randomDiceArray = Array.from({length: 100}, () => Math.floor(Math.random()*6)+1)
// console.log(randomDiceArray)
//
// // Practice time
// const numsDeposits1000 = accounts
//     .flatMap((account)=>account.movements)
//     // .reduce((acc,element)=>element >= 1000 ? acc + 1 : acc,0)
//     .reduce((acc,element)=>element >= 1000 ? ++acc : acc,0)
//
//
// console.log(numsDeposits1000)
// console.log(accounts.flatMap((account) => account.movements).filter((element) => element >= 1000))
//
// const bankDepositSum = accounts.flatMap((account) => account.movements).reduce((acc, element) => acc + element, 0)
// console.log(bankDepositSum)
//
// // 3
// const sum = accounts.flatMap((account) => account.movements).reduce((acc, element) => {
//   element >= 0 ? acc.deposits += element : acc.withdrawals += element;
//   return acc;
// }, { deposits: 0, withdrawals: 0 })
// console.log(sum)
//
//
// const {deposits, withdrawals} = accounts
//     .flatMap((account) => account.movements)
//     .reduce((acc, element) => {
//           acc[element > 0 ? 'deposits' : 'withdrawals'] += element;
//           return acc
//         }, { deposits: 0, withdrawals: 0 }
//     )
// console.log(deposits, withdrawals)
//
// // 4
// const convertTitle = (title) => title.split(" ").map((word => {
//   if (word.length > 1) return word[0].toUpperCase() + word.slice(1).toLowerCase();
//   return word;
// })).join(" ")
//
//
// const xyz = convertTitle("this is a nice title")
// console.log(xyz)


///////////////////////////////////////
// Coding Challenge #5

/*
Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28.
(The result is in grams of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion,
and eating too little is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above
and below the recommended portion (see hint).

YOUR TASKS:
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood)
and add it to the object as a new property. Do NOT create a new array, simply loop over the array
(We never did this before, so think about how you can do this without creating a new array).
2. Find Sarah's dog and log to the console whether it's eating too much or too little.
HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much (ownersTooMuch)
and an array with all owners of dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3.,
like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little',
based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion
means: current > (recommended * 0.90) && current < (recommended * 1.10).
 Basically, the current portion should be between 90% and 110% of the recommended portion.

*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1 add new variable recFood
console.log("1")
dogs.forEach((dog) => {
  dog.recFood = Math.round(dog.weight ** 0.75 * 28);
  return dog;
})
console.log(dogs)

// 2. Find Sarah's dog and log to the console whether it's eating too much or too little.
console.log("2")
const sarahDog = dogs.find((dog) => dog.owners.find(owner => owner === 'Sarah'))


const toMuchOrToLittle = (dog) => {
  if (dog.curFood <= (dog.recFood * 0.90)) {
    return "too little"
  } else if (dog.curFood >= (dog.recFood * 1.10)) {
    return "too much"
  } else {
    return "exact"
  }
}
console.log(`Sarah's dog is eating ${toMuchOrToLittle(sarahDog)}`)


// 3. Create an array containing all owners of dogs who eat too much (ownersTooMuch)
// and an array with all owners of dogs who eat too little (ownersTooLittle).
console.log("3")
  const {ownersTooMuch, ownersTooLittle} = dogs
      .reduce((acc, dog) => {

    if (dog.curFood < (dog.recFood * 0.90)) {
      acc.ownersTooLittle
          .push(dog.owners
              .flat()
          )
    } else if (dog.curFood > (dog.recFood * 1.10)) {
      acc.ownersTooMuch
          .push(dog.owners
              .flat()
          )
    }

    return acc

  }, {ownersTooMuch: [], ownersTooLittle: [] })

// 4. Log a string to the console for each array created in 3.,
// like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
console.log("4")
console.log(`${ownersTooMuch.flat().join(" and ")}'s dogs eat too much!`)
console.log(`${ownersTooLittle.flat().join(" and ")}'s dogs eat too little!`)


//5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or fal
console.log("5")
console.log(dogs.some( ( dog )  => dog.curFood === dog.recFood ) )

//6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
console.log("6")
const checkEatingOkay = (dog) => dog.curFood >= (dog.recFood * 0.90) && dog.curFood <= (dog.recFood * 1.10)
console.log(dogs.every(checkEatingOkay))

console.log(dogs.toSorted((a,b) => b.owners.length - a.owners.length))

// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
const dogsThatEatOkAmountOfFood = dogs.filter(checkEatingOkay)
console.log("7")
console.log(dogsThatEatOkAmountOfFood)

//9. Group the dogs by the number of owners they have
console.log("9")
const groupedDogs = Object.groupBy(dogs, (dog) => dog.owners.length)
console.log(groupedDogs)


//10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!
console.log("10")
console.log(...(dogs.toSorted((a,b) => a.recFood - b.recFood)))