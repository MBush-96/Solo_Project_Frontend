const URL = 'http://localhost:3001/'
const createAccount = document.querySelector('.createAccount')
const loginAccount = document.querySelector('.loginToAccount')
const createAccountBtn = document.querySelector('#createAccountBtn')
const loginBtn = document.querySelector('#loginBtn')
const helpPage = document.querySelector('.helpPage')

const showIfLoggedIn = []
const hideIfLoggedOut = []
const showIfLoggedOut = [createAccountBtn, loginBtn]
const hideIfLoggedIn = [createAccount, loginAccount, createAccountBtn, loginBtn]
const headerLinks = document.querySelectorAll('.hlink')
headerLinks.forEach(item => {
    hideIfLoggedOut.push(item)
    showIfLoggedIn.push(item)
})

document.querySelector('.logoutLink').addEventListener('click', () => {
    localStorage.removeItem('userIn')
    location.reload()
})

document.querySelector('#loginBtn').addEventListener('click', () => {
    if(loginAccount.classList.contains('hidden')) {
        loginAccount.classList.remove('hidden')
    } else {
        loginAccount.classList.add('hidden')
    }
})

document.querySelector('#loginForm').addEventListener('submit', e => {
    e.preventDefault()
    const username = document.querySelector('#usernameFieldLogin')
    const password = document.querySelector('#passwordFieldLogin')
    axios.post(`${URL}user/login`, {
        username: username.value,
        password: password.value
    }).then(res => {
        console.log(res);
        localStorage.setItem('userIn', res.data.user.id)
        location.reload()
    })
    username.value = null
    password.value = null
})

document.querySelector('#createAccountBtn').addEventListener('click', () => {
    if(createAccount.classList.contains('hidden')) {
        createAccount.classList.remove('hidden')
    } else {
        createAccount.classList.add('hidden')
    }
})

document.querySelector('#createAccountForm').addEventListener('submit', e => {
    e.preventDefault()
    const username = document.querySelector('#usernameFieldCa')
    const password = document.querySelector('#passwordFieldCa')
    axios.post(`${URL}user`, {
        username: username.value,
        password: password.value
    })
    username.value = null
    password.value = null
})

document.querySelector('#createCityForm').addEventListener('submit', e => {
    e.preventDefault()
    const cityName = document.querySelector('.createCityName')
    const userId = localStorage.getItem('userIn')
    axios.post(`${URL}city`, {
        name: cityName.value,
        infantryInCity: 0,
        userId: userId
    }).then(res => {
        displayAllUserCities()
    })
    document.querySelector('.profileCreateCityPopup').classList.add('hidden')
})

const displayAllUserCities = async () => {
    const cities = await axios.get(`${URL}city/${localStorage.getItem('userIn')}`)
    const cityPath = cities.data.city
    for(let i in cityPath) {
        if(document.querySelector('.citiesOwned').children.length === 0) {
            const newDiv = document.createElement('div')
            const cityTitle = document.createElement('h2')
            const cityTroops = document.createElement('p')
            
            newDiv.classList.add('city')
            cityTitle.classList.add('cityTitle')
            cityTroops.classList.add('cityTroops')
            
            cityTitle.innerText = cityPath[i].name
            cityTroops.innerText = `Stationed Troops: ${cityPath[i].infantryInCity}`
            
            newDiv.appendChild(cityTitle)
            newDiv.appendChild(cityTroops)
            document.querySelector('.citiesOwned').appendChild(newDiv)
        }
    }
}

document.querySelector('.profileLink').addEventListener('click', () => {
    getAllUserCities()
    document.querySelector('.profilePage').classList.remove('hidden')
    helpPage.classList.add('hidden')
})

const getAllUserCities = async () => {
    const response = await axios.get(`${URL}city/${localStorage.getItem('userIn')}`)
    if (response.data.city.length === 0) {
        document.querySelector('.profileCreateCityPopup').classList.remove('hidden')
    } else {
        displayAllUserCities()
    }
}

const deleteTroops = async casualties => {
    const response = await axios.put(`${URL}user/${localStorage.getItem('userIn')}/troops`, {
        removeTroops: casualties
    })
    console.log(response);
}

document.querySelector('.trainInfantryForm').addEventListener('submit', e => {
    e.preventDefault()
    const troops = document.querySelector('.trainInfantryField')
    axios.put(`${URL}user/troops`, {
        id: localStorage.getItem('userIn'),
        infantryInReserve: troops.value
    })
    troops.value = null
})

if(localStorage.getItem('userIn')) {
    hideIfLoggedIn.forEach(item => {
        item.classList.add('hidden')
    })
    document.querySelector('.helpPage').classList.remove('hidden')
} else {
    hideIfLoggedOut.forEach(item => {
        item.classList.add('hidden')
    })
    showIfLoggedOut.forEach(item => {
        item.classList.remove('hidden')
    })

}

setInterval(() => {
    axios.get(`${URL}user/${localStorage.getItem('userIn')}`).then(res => {
        document.querySelector('.troopReserves').innerText = `Troops in reserves: ${res.data.user.infantryInReserve}`
    })
}, 1000);