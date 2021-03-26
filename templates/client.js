const ws = new WebSocket(`ws://localhost:3000/chatRoom/:room_name/:user_name`)


const messageBTN = document.getElementById('message-btn')

messageBTN.addEventListener('click', (e) => {
    const msgInput = document.getElementById('message-input')
    const getName = document.getElementById('username')
    let name = getName.innerText
    console.log(name)
    ws.send(`${name}: ${msgInput.value}`)
})




ws.onmessage = (evt) => {
    console.log("got", evt.data)
    const msgArea = document.getElementById('message-items')
    const li = document.createElement('li')
    li.innerText = evt.data
    msgArea.appendChild(li)
}

