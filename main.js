const URL = 'http://localhost:3001/'
const createAccount = document.querySelector('.createAccount')
const loginAccount = document.querySelector('.loginToAccount')
const createAccountBtn = document.querySelector('#createAccountBtn')
const loginBtn = document.querySelector('#loginBtn')
const helpPage = document.querySelector('.helpPage')
const profilePage = document.querySelector('.profilePage')
const seeUsersPage = document.querySelector('.seeUsersPage')
const noCityPopup = document.querySelector('.profileCreateCityPopup')
let troopsInReserves = document.querySelector('.troopsInReserves').innerText

const showIfLoggedIn = []
const hideIfLoggedOut = []
const showIfLoggedOut = [createAccountBtn, loginBtn]
const hideIfLoggedIn = [createAccount, loginAccount, createAccountBtn, loginBtn]
const headerLinks = document.querySelectorAll('.hlink')
headerLinks.forEach(item => {
    hideIfLoggedOut.push(item)
    showIfLoggedIn.push(item)
})

document.querySelector('.seeUsersLink').addEventListener('click', async () => {
    // Display each user
    while (seeUsersPage.firstChild !== null) {
        seeUsersPage.removeChild(seeUsersPage.lastChild)
    }
    const users = await getAllUserInfo()
    users.forEach(user => {
        const newDiv = document.createElement('div')
        const userInfoDiv = document.createElement('div')
        const userName = document.createElement('h2')
        const userReserveTroops = document.createElement('p')
        const profilePictureDiv = document.createElement('div')
        const profilePic = document.createElement('img')
        
        userInfoDiv.classList.add('userInfoDivSU')
        profilePictureDiv.classList.add('pPDiv')
        newDiv.classList.add('seeUsersPageUser')

        userName.innerText = user.username
        userReserveTroops.innerText = `Reserve Troops: ${user.infantryInReserve}`
        profilePic.src = 'https://i.imgur.com/CWExPZG.png'
        
        userInfoDiv.appendChild(userName)
        userInfoDiv.appendChild(userReserveTroops)
        profilePictureDiv.appendChild(profilePic)
        
        newDiv.appendChild(profilePictureDiv)
        newDiv.appendChild(userInfoDiv)
        seeUsersPage.appendChild(newDiv)
        
    })
    profilePage.classList.add('hidden')
    helpPage.classList.add('hidden')
    noCityPopup.classList.add('hidden')
    seeUsersPage.classList.remove('hidden')

    
})

document.querySelector('.help').addEventListener('click', e => {
    helpPage.classList.remove('hidden')
    profilePage.classList.add('hidden')
    seeUsersPage.classList.add('hidden')
    noCityPopup.classList.add('hidden')
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
    }).then(res => {
        console.log(res);
    })
    username.value = null
    password.value = null
})

document.querySelector('#createCityForm').addEventListener('submit', e => {
    e.preventDefault()
    profilePage.classList.add('hidden')
    const cityName = document.querySelector('.createCityName')
    const userId = localStorage.getItem('userIn')
    axios.post(`${URL}city`, {
        name: cityName.value,
        infantryInCity: 0,
        userId: userId
    }).then(res => {
        displayAllUserCities()
    })
    profilePage.classList.remove('hidden')
    document.querySelector('.profileCreateCityPopup').classList.add('hidden')
})

document.querySelector('.profileLink').addEventListener('click', () => {
    getAllUserCities()
    profilePage.classList.remove('hidden')
    helpPage.classList.add('hidden')
    seeUsersPage.classList.add('hidden')
})

document.querySelector('.trainInfantryForm').addEventListener('submit', e => {
    e.preventDefault()
    const troops = document.querySelector('.trainInfantryField')
    axios.put(`${URL}user/troops`, {
        id: localStorage.getItem('userIn'),
        infantryInReserve: troops.value
    })
    troops.value = null
})

const displayAllUserCities = async () => {
    const cities = await axios.get(`${URL}city/${localStorage.getItem('userIn')}`)
    const cityPath = cities.data.city
    for(let i in cityPath) {
        if(document.querySelector('.citiesOwned').children.length === 0) {
            const newDiv = document.createElement('div')
            const cityTitle = document.createElement('h2')
            const cityTroops = document.createElement('p')
            const stationTroopsAtCity = document.createElement('form')
            const formInputField = document.createElement('input')
            const formInputSubmitBtn = document.createElement('input')
            
            //add city id to form class to be used to send to DB
            stationTroopsAtCity.id = `${cityPath[i].id}`
            stationTroopsAtCity.classList.add('stationTroopsForm')
            formInputField.classList.add('stationTroopsField')
            formInputField.type = 'number'
            formInputField.placeholder = cityPath[i].name
            formInputSubmitBtn.classList.add('stationTroopsBtn')
            formInputSubmitBtn.type = 'submit'
            formInputSubmitBtn.value = 'Station Troops'
            
            newDiv.classList.add('city')
            cityTitle.classList.add('cityTitle')
            cityTroops.classList.add('cityTroops')
            
            cityTitle.innerText = cityPath[i].name
            cityTroops.innerText = `Stationed Troops: ${cityPath[i].infantryInCity}`
            
            stationTroopsAtCity.appendChild(formInputField)
            stationTroopsAtCity.appendChild(formInputSubmitBtn)

            newDiv.appendChild(cityTitle)
            newDiv.appendChild(cityTroops)
            document.querySelector('.citiesOwned').appendChild(newDiv)
            document.querySelector('.citiesOwned').appendChild(stationTroopsAtCity)

            // add event listener to form when it is created
            stationTroopsAtCity.addEventListener('submit', e => {
                e.preventDefault()
                if(troopsInReserves >= formInputField.value) {
                    axios.put(`${URL}city/${stationTroopsAtCity.id}`, {
                        infantryInCity: formInputField.value
                    }).then(res => {
                        console.log(res);
                    })
                } else {
                    formInputField.value = null
                    formInputField.placeholder = 'You didnt have enough troops'
                }
            })
        }
    }
}

const getAllUserInfo = async () => {
    const response =  await axios.get(`${URL}user`)
    const users = response.data.users
    return users
}

const getAllUserCities = async () => {
    const response = await axios.get(`${URL}city/${localStorage.getItem('userIn')}`)
    if (response.data.city.length === 0) {
        document.querySelector('.profileCreateCityPopup').classList.remove('hidden')
        profilePage.classList.add('hidden')
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

if(localStorage.getItem('userIn')) {
    setInterval(() => {
        axios.get(`${URL}user/${localStorage.getItem('userIn')}`).then(res => {
            document.querySelector('.troopReserves').innerText = `Troops in reserves: ${res.data.user.infantryInReserve}`
        })
    }, 1000);
}