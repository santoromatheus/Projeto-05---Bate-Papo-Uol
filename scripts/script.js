/* Ao entrar no site, este deve carregar as mensagens do servidor e exibi-las conforme layout fornecido */
/* Repetindo a operação a cada 3 segundos */
let countTotalMessages = 0;
let myUser = "";
let userToReceive = "Todos";
let typeOfMessage = "message";

function turnOn () {
    const promisse = axios.get(`https://mock-api.driven.com.br/api/v4/uol/messages`);

    promisse.then(showFirstAnswer);
    promisse.catch(turnOnError);

    setInterval(actualize, 3000);
    setInterval(iAmOn, 5000);
}

function showFirstAnswer(answer) {
    /* Show first message */
    identifyTypeOfMessage(answer.data[0]);
    /* Insert the margin-up that the first message has */
    addFirstMessage();
    countTotalMessages++;
    /* Access every message that the server sent */
    runThroughtAnswer(answer);
}

function addFirstMessage () {
    const element = document.querySelector(".message");
    element.classList.add("first");
}

function  runThroughtAnswer(answer) {
    let checkNewMessage = countTotalMessages;
    for( ; countTotalMessages < answer.data.length; countTotalMessages++) {
        identifyTypeOfMessage(answer.data[countTotalMessages]);
    }
    scrollToFinalMessage(answer, checkNewMessage);
}

function identifyTypeOfMessage(messageRegister) {
    if (messageRegister.type === "message") {
        showMessageTypeMessage(messageRegister);
    } else if (messageRegister.type === "status") {
        showMessageTypeStatus(messageRegister);
    } else if (messageRegister.type === "private_message") {
        showMessageTypePrivate(messageRegister);
    }
}

function showMessageTypeMessage(messageRegister) {
    const elementMain = document.querySelector("main");
    elementMain.innerHTML += `
    <div data-identifier="message" class="message">
        <p class="time">
            (${messageRegister.time})
        </p>
        <p>
            <strong class="senderOrRecipient">${messageRegister.from} </strong> para <strong class="senderOrRecipient">${messageRegister.to}</strong> ${messageRegister.text}
        </p>
    </div>`;
}

function showMessageTypeStatus(messageRegister) {
    const elementMain = document.querySelector("main");
    elementMain.innerHTML += `
    <div data-identifier="message" class="message signInOrSignOut">
        <p class="time">
            (${messageRegister.time})
        </p>
        <p>
            <strong class="senderOrRecipient"> ${messageRegister.from} </strong> ${messageRegister.text}
        </p>
    </div>`
}

function showMessageTypePrivate(messageRegister) {
    const elementMain = document.querySelector("main");
    if (messageRegister.to === myUser.name) {  
        elementMain.innerHTML += `
            <div data-identifier="message" class="message private">
                <p class="time">
                    (${messageRegister.time})
                </p>
                <p>
                    <strong class="senderOrRecipient">${messageRegister.from}</strong> reservadamente para <strong class="senderOrRecipient">${messageRegister.to}:</strong> ${messageRegister.text}
                </p>
            </div>`
    }
}

function actualize () {
    const newPromisse = axios.get(`https://mock-api.driven.com.br/api/v4/uol/messages`);

    newPromisse.then(runThroughtAnswer);
    newPromisse.catch(actualizeError);
}

function scrollToFinalMessage(answer, checkNewMessage) {
    if(checkNewMessage < answer.data.length) {
        const messages = document.querySelectorAll('.message');
        console.log(messages);
        const lastMessage = messages[messages.length-1];
        console.log(lastMessage);
        lastMessage.scrollIntoView(false);       
    }
}

function checkUserValidity() {
    const userInput = document.getElementById(`myUserInput`);
    myUser = { name: userInput.value };
    userRequisition();
}

function userRequisition() {
    const requisicao = axios.post(`https://mock-api.driven.com.br/api/v4/uol/messages`, myUser);
    requisicao.then(treatSuccess);
    requisicao.catch(treatError);
}

function treatError(error) {
    const userDeniedMessage = document.querySelector(".errorRequest");
    if (userDeniedMessage.classList.contains("hidden") === true) {
        userDeniedMessage.classList.toggle("hidden");
    }
}

function treatSuccess(answer) {
    const userAccepted = document.querySelector(".initialScreen");
    userAccepted.classList.toggle("hidden");
    turnOn();
}

function turnOnError(error) {
    console.log("error during the turnOn function request");
    console.log("Status code: " + error.response.status);
	console.log("Mensagem de erro: " + error.response.data);
}

function actualizeError(error) {
    console.log("error during the actualize function request");
    console.log("Status code: " + error.response.status);
	console.log("Mensagem de erro: " + error.response.data);
}

function iAmOn() {
    const requisicao = axios.post(`https://mock-api.driven.com.br/api/v4/uol/messages`, myUser);
    requisicao.then(stillOn);
    requisicao.catch(nowOff);
}

function stillOn() {
    console.log("I am still online");
}

function nowOff(error) {
    console.log("Error durinf iAmOn function request. I am Off now");
    console.log("Status code: " + error.response.status);
	console.log("Mensagem de erro: " + error.response.data);
    goToInitialScreen();
}

function sendMessageToChat() {
    const myMessageToGo = document.getElementById(`messageInput`);
    const messageToSend = 
    {
        from: myUser.name, 
        to: userToReceive, 
        text: myMessageToGo.value, 
        type: typeOfMessage
    };
    const request = axios.post(`https://mock-api.driven.com.br/api/v4/uol/messages`, messageToSend);
}

function goToInitialScreen() {
    window.location.reload()
}