const createAccount = document.querySelector('.createAccount')
const loginAccount = document.querySelector('.loginToAccount')
const createAccountBtn = document.querySelector('#createAccountBtn')
const loginBtn = document.querySelector('#loginBtn')

const showIfLoggedIn = []
const hideIfLoggedOut = []
const showIfLoggedOut = [createAccountBtn, loginBtn]
const hideIfLoggedIn = [createAccount, loginAccount, createAccountBtn, loginBtn]
const headerLinks = document.querySelectorAll('.hlink')
headerLinks.forEach(item => {
    hideIfLoggedOut.push(item)
    showIfLoggedIn.push(item)
})

if(localStorage.getItem('userIn')) {
    hideIfLoggedIn.forEach(item => {
        item.classList.add('hidden')
    })
    document.querySelector('.profileCreateCityPopup').classList.remove('hidden')
} else {
    hideIfLoggedOut.forEach(item => {
        item.classList.add('hidden')
    })
    showIfLoggedOut.forEach(item => {
        item.classList.remove('hidden')
    })

}

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
    axios.post('http://localhost:3001/user/login', {
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
    axios.post('http://localhost:3001/user', {
        username: username.value,
        password: password.value
    })
    username.value = null
    password.value = null
})