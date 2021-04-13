const URL = 'http://localhost:3001/'
const createAccount = document.querySelector('.createAccount')
const loginAccount = document.querySelector('.loginToAccount')
const createAccountBtn = document.querySelector('#createAccountBtn')
const loginBtn = document.querySelector('#loginBtn')
const helpPage = document.querySelector('.helpPage')
const profilePage = document.querySelector('.profilePage')
const seeUsersPage = document.querySelector('.seeUsersPage')
const noCityPopup = document.querySelector('.profileCreateCityPopup')
const attackUsersPage = document.querySelector('.attackUsersPage')
let troopsInReserves = document.querySelector('.troopsInReserves').innerText

const showIfLoggedIn = []
const hideIfLoggedOut = []
const showIfLoggedOut = [createAccountBtn, loginBtn, attackUsersPage]
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
        profilePic.src = user.profileImgSrc
        
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
    attackUsersPage.classList.add('hidden')
})

document.querySelector('.attackLink').addEventListener('click', async () => {
    helpPage.classList.add('hidden')
    profilePage.classList.add('hidden')
    seeUsersPage.classList.add('hidden')
    noCityPopup.classList.add('hidden')
    attackUsersPage.classList.remove('hidden')
    const attackUsersPageContainer = document.querySelector('.attackUsersPageContainer')
    while (attackUsersPageContainer.firstChild !== null) {
        attackUsersPageContainer.removeChild(attackUsersPageContainer.lastChild)
    }

    //contains all cities owned by users
    const userCities = []

    // get user information
    const userCall = await getAllUserInfo()
    //console.log(userCall);

    // get cities and push them to userCities array
    for(let user of userCall) {
        let city = await getUserCities(user.id)
        userCities.push(city)
    }

    // Loop through userCities
    for(let i in userCities) {
        const cityPath = userCities[i].data.city
        // Loop through to city
        for(let j in cityPath) {
            //get Owner Of City
            let user = await axios.get(`${URL}user/${cityPath[j].userId}`)
            const userPath = user.data.user

            //create Divs To Display
            const newDiv = document.createElement('div')
            const userCityInfoDiv = document.createElement('div')
            const userAvatarDiv = document.createElement('div')
            const userProfileImg = document.createElement('img')
            const usersName = document.createElement('h2')
            const cityName = document.createElement('h3')
            const attackButton = document.createElement('button')

            newDiv.classList.add('userCityAttackPane')
            userCityInfoDiv.classList.add('userCityAttackPaneInfo')
            userAvatarDiv.classList.add('userCityAttackPaneAvatar')
            attackButton.classList.add('userCityAttackPaneBtn')

            newDiv.classList.add('usersAttackPane')
            userProfileImg.src = userPath.profileImgSrc
            usersName.innerText = userPath.username
            cityName.innerText = cityPath[j].name
            attackButton.innerText = 'War'

            userAvatarDiv.appendChild(userProfileImg)

            userCityInfoDiv.appendChild(usersName)
            userCityInfoDiv.appendChild(cityName)
            userCityInfoDiv.appendChild(attackButton)

            newDiv.appendChild(userAvatarDiv)
            newDiv.appendChild(userCityInfoDiv)

            document.querySelector('.attackUsersPageContainer').appendChild(newDiv)

            attackButton.addEventListener('click', () => {
                warInit(userPath, cityPath[j], attackButton)
                // Get the modal
                const modal = document.querySelector(".initWarModal")
                
                // Get the <span> element that closes the modal
                const span = document.getElementsByClassName("close")[0]
                
                // When the user clicks on the button, open the modal
                modal.style.display = "block";
                
                // When the user clicks on <span> (x), close the modal
                span.onclick = () => {
                    modal.style.display = "none";
                }
                
                // When the user clicks anywhere outside of the modal, close it
                window.onclick = event => {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
            })
        }
    }
})

document.querySelector('.help').addEventListener('click', e => {
    helpPage.classList.remove('hidden')
    profilePage.classList.add('hidden')
    seeUsersPage.classList.add('hidden')
    noCityPopup.classList.add('hidden')
    attackUsersPage.classList.add('hidden')
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
    console.log(password.value);
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
    document.querySelector('.createAccount').classList.add('hidden')
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
    attackUsersPage.classList.add('hidden')
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
    console.log(cities);
    const cityPath = cities.data.city
    const citiesOwnedDiv = document.querySelector('.citiesOwned')

    while(citiesOwnedDiv.firstChild !== null) {
        citiesOwnedDiv.removeChild(citiesOwnedDiv.lastChild)
    }

    for(let i in cityPath) {
        const newDiv = document.createElement('div')
        const cityTitle = document.createElement('h2')
        const cityTroops = document.createElement('p')
        const stationTroopsAtCity = document.createElement('form')
        const formInputField = document.createElement('input')
        const formInputSubmitBtn = document.createElement('input')
        
        //add city id to form class to be used to send to DB
        stationTroopsAtCity.classList.add(`${cityPath[i].id}`)
        stationTroopsAtCity.classList.add('stationTroopsForm')
        formInputField.classList.add('stationTroopsField')
        formInputField.type = 'number'
        formInputField.placeholder = cityPath[i].name
        formInputSubmitBtn.classList.add('stationTroopsBtn')
        formInputSubmitBtn.type = 'submit'
        formInputSubmitBtn.value = 'Station Troops'
        
        newDiv.classList.add('city')
        cityTitle.classList.add('cityTitle')
        cityTroops.classList.add(`cityTroops${i}`)
        cityTroops.classList.add(`cityTroops`)
        
        cityTitle.innerText = cityPath[i].name
        cityTroops.innerText = `Stationed Troops: ${cityPath[i].infantryInCity}`
        
        stationTroopsAtCity.appendChild(formInputField)
        stationTroopsAtCity.appendChild(formInputSubmitBtn)

        newDiv.appendChild(cityTitle)
        newDiv.appendChild(cityTroops)
        citiesOwnedDiv.appendChild(newDiv)
        citiesOwnedDiv.appendChild(stationTroopsAtCity)

        // add event listener to form when it is created
        stationTroopsAtCity.addEventListener('submit', e => {
            e.preventDefault()
            const reserveTroops = parseInt(document.querySelector('.reserveTroopsLinkBar').innerText)
            if(reserveTroops >= formInputField.value) {
                axios.put(`${URL}city/${stationTroopsAtCity.classList[0]}`, {
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

const getAllUserInfo = async () => {
    const response =  await axios.get(`${URL}user`)
    const users = response.data.users
    return users
}

const getUserCities = async userId => {
    const city = await axios.get(`${URL}city/${userId}`)
    return city
}

//used for profile page
const getAllUserCities = async () => {
    const response = await axios.get(`${URL}city/${localStorage.getItem('userIn')}`)
    const userResponse = await axios.get(`${URL}user/${localStorage.getItem('userIn')}`)
    if (response.data.city.length === 0) {
        document.querySelector('.usernameLogout').innerText = `[${userResponse.data.user.username}]`
        document.querySelector('.popUpUserName').innerText = userResponse.data.user.username
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

const warInit = async (cityOwner, city, attackButton) => {
    const cityContainerModal = document.querySelector('.userCityContainerModal')
    while (cityContainerModal.firstChild !== null) {
        cityContainerModal.removeChild(cityContainerModal.lastChild)
    }
    const avatarModalDiv = document.createElement('div')
    const cityInfoModalDiv = document.createElement('div')
    const profileImg = document.createElement('img')
    const cityName = document.createElement('p')
    const username = document.createElement('h2')
    const confirmWarForm = document.createElement('form')
    const confirmWarFormDiv = document.createElement('div')
    const sendTroopsInput = document.createElement('input')
    const sendTroopsBtn = document.createElement('input')
    
    const warModalContent = document.querySelector('.initWarModal_Content')
    if (warModalContent.lastChild === document.querySelector('.confirmWarFormDiv')) {
        warModalContent.removeChild(warModalContent.lastChild)
    }

    confirmWarFormDiv.classList.add('confirmWarFormDiv')
    sendTroopsBtn.classList.add('sendTroopsBtnModal')
    sendTroopsInput.classList.add('sendTroopsInputFormModal')
    confirmWarForm.classList.add('confirmWarFormModal')
    username.classList.add('attackUserModalUsername')
    cityName.classList.add('attackUserModalCityTitle')
    cityInfoModalDiv.classList.add('userCityInfoModal')
    avatarModalDiv.classList.add('userAvatarModal')
    
    username.innerText = cityOwner.username
    cityName.innerText = city.name
    profileImg.src = cityOwner.profileImgSrc
    sendTroopsInput.type = 'number'
    sendTroopsBtn.type = 'submit'
    sendTroopsBtn.value = 'March'
    sendTroopsInput.placeholder = 'Number of troops to send'

    
    avatarModalDiv.appendChild(profileImg)
    cityInfoModalDiv.appendChild(username)
    cityInfoModalDiv.appendChild(cityName)
    confirmWarForm.appendChild(sendTroopsInput)
    confirmWarForm.appendChild(sendTroopsBtn)
    cityContainerModal.appendChild(avatarModalDiv)
    cityContainerModal.appendChild(cityInfoModalDiv)
    confirmWarFormDiv.appendChild(confirmWarForm)
    document.querySelector('.initWarModal_Content').appendChild(confirmWarFormDiv)
    
    confirmWarFormDiv.addEventListener('submit', e => {
        e.preventDefault()
        //make a modal for this gif
        const swordGif = document.createElement('img')
        swordGif.src = "https://media.giphy.com/media/R5AY6wDCytA7ijDrtT/source.gif"
        
        setTimeout(() => {
            document.querySelector('.initWarModal').style.display = 'none'
        }, 1000);
        
        war(cityOwner, city, sendTroopsInput.value)
    })
}

const war = async (cityOwner, city, troopsMarching) => {
    const getAttackingUser = await axios.get(`${URL}user/${localStorage.getItem('userIn')}`)
    const attackingUser = getAttackingUser.data.user
    console.log(city);
    console.log(cityOwner);
    console.log(attackingUser);
    let troopsInCity = city.infantryInCity
    let attackingTroops = parseInt(troopsMarching, 10)

    const rmTroops = await axios.put(`${URL}user/${localStorage.getItem('userIn')}/troops`, {
        infantryInReserve: attackingTroops
    })
    
    //remove dead troops if city has more defenders
    if (troopsInCity > attackingTroops) {
        await axios.put(`${URL}city/${city.id}/troops`, {
            infantryInCity: troopsInCity - attackingTroops
        })
    } else if (troopsInCity < attackingTroops) {
        await axios.put(`${URL}city/${city.id}/troops`, {
            infantryInCity: attackingTroops - troopsInCity
        })
        await axios.put(`${URL}city/${city.id}/owner`, {
            newOwner: attackingUser.id
        })
    } else if (troopsInCity === attackingTroops) {
        await axios.put(`${URL}city/${city.id}/troops`, {
            infantryInCity: 0
        })
    }
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
            document.querySelector('.troopReserves').innerHTML = `Troops in reserves: <span class='reserveTroopsLinkBar'>${res.data.user.infantryInReserve}</span>`
        })
        axios.get(`${URL}city/${localStorage.getItem('userIn')}`).then(res => {
            for(let i in res.data.city) {
                document.querySelector(`.cityTroops${i}`).innerText = `Stationed Troops: ${res.data.city[i].infantryInCity}`
            }
        }) 
    }, 1000);
}