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


const displayMovement = function(movements){

  // Resetuje zawartość kontenera z operacjami
  containerMovements.innerHTML = ''

  // Dodaje operacje zapisane na kącie uzytkownika do kontenera
  movements.forEach(function(mov, i){

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

  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value)

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    console.log('LOGIN')
    console.log(currentAccount)
  }

  //Display UI
  labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(" ")[0]}`

  containerApp.style.opacity = 1

  display(currentAccount)

  // Clear inputs fields
  inputLoginUsername.value = inputLoginPin.value = ''
  inputLoginPin.blur()
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

    inputTransferTo.value = ''
    inputTransferAmount.value = ''
  } else {
  console.log("Wystapil blad")

  inputTransferTo.value = ''
  inputTransferAmount.value = ''
}
})

// Usuniecie konta
btnClose.addEventListener('click', function(e){
  e.preventDefault()

  if(inputCloseUsername.value === currentAccount.userName
      && Number(inputClosePin.value) === currentAccount.pin){

  }


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