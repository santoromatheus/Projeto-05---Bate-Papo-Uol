/* Ao entrar no site, este deve carregar as mensagens do servidor e exibi-las conforme layout fornecido */
/* Repetindo a operação a cada 3 segundos */
let myUser = "";
let userToReceive = "Todos";
let typeOfMessage = "message";
let auxTypeOfMessage = "Público";
var input = document.getElementById("messageInput");

input.addEventListener("keyup", function(event) {
    if(event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("messageSendingButto").click();
    }
});


function turnOn () {
    requestMessages();

    actualizeUsers();

    launchIntervalFunctions();
}

function actualizeUsers() {
    const promisse = axios.get(`https://mock-api.driven.com.br/api/v4/uol/participants`);

    promisse.then(runThroughtUsers);
    promisse.catch(requestUsersError);
}

function runThroughtUsers(usersList) {
    showTodosUser(); /* Colocar a opção "Todos" */
    for( let i = 0; i < usersList.data.length; i++) {
        showActiveUsers(usersList.data[i]);
    } 
}

function requestUsersError(error) {
    console.log("Teve algum problema ao solicitar usuarios");
    console.log(error);
}

function showTodosUser() {
    const elementListUsers = document.querySelector(".listContacts");
    elementListUsers.innerHTML = `
    <div data-identifier="participant" class="contact" onclick="selectContact(this)">
        <div>
            <ion-icon name="people" class="iconContact"></ion-icon>
            <p class="user"> Todos</p>
        </div>
            <ion-icon name="checkmark" class="check hidden"></ion-icon>
    </div>`;
}

function showActiveUsers(userActive){
    const elementListUsers = document.querySelector(".listContacts");
    elementListUsers.innerHTML += `
    <div data-identifier="participant" class="contact" onclick="selectContact(this)">
        <div>
            <ion-icon name="person-circle" class="iconContact"></ion-icon>
            <p class="user">${userActive.name}</p>
        </div>
        <ion-icon name="checkmark" class="check hidden"></ion-icon>
    </div>`;
}

function requestMessages() {
    const promisse = axios.get(`https://mock-api.driven.com.br/api/v4/uol/messages`);

    promisse.then(showFirstAnswer);
    promisse.catch(requestMessagesError);
}

function launchIntervalFunctions() {
    setInterval(actualizeMessages, 3000);
    setInterval(iAmOn, 5000);
    setInterval(actualizeUsers, 10000);
}

function showFirstAnswer(answer) {
    /* Show first message */
    identifyTypeOfMessage(answer.data[0]);
    /* Insert the margin-up that the first message has */
    addFirstMessage();
    /* Access every message that the server sent */
    runThroughtAnswer(answer);
}

function addFirstMessage () {
    const element = document.querySelector(".message");
    element.classList.add("first");
}

function runThroughtAnswer(answer) {
    const elementMain = document.querySelector("main");
    elementMain.innerHTML = "";
    for( let i = 0; i < answer.data.length; i++) {
        identifyTypeOfMessage(answer.data[i]);
    }
    scrollToFinalMessage(answer);
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
    if (messageRegister.to === myUser.name || messageRegister.from === myUser.name) {  
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

function actualizeMessages () {
    const newPromisse = axios.get(`https://mock-api.driven.com.br/api/v4/uol/messages`);
    newPromisse.then(runThroughtAnswer);
    newPromisse.catch(actualizeMessagesError);
}

function scrollToFinalMessage(answer) {
    const messages = document.querySelectorAll('.message');
    const lastMessage = messages[messages.length-1];
    
    lastMessage.scrollIntoView(false);
}

function checkUserValidity() {
    const userInput = document.getElementById(`myUserInput`);
    myUser = { name: userInput.value };
    userRequisition();
}

function userRequisition() {
    const requisicao = axios.post(`https://mock-api.driven.com.br/api/v4/uol/participants`, myUser);
    requisicao.then(treatSuccess);
    requisicao.catch(treatError);
    loadingScreen();
}

function loadingScreen() {
    document.querySelector(".inputName").classList.toggle("hidden");
    document.querySelector(".entryButton").classList.toggle("hidden");
    document.querySelector(".loading").classList.toggle("hidden");
    document.querySelector(".entrying").classList.toggle("hidden");
}

function treatError(error) {
    loadingScreen();
    const userDeniedMessage = document.querySelector(".errorRequest");
    if (userDeniedMessage.classList.contains("hidden") === true) {
        userDeniedMessage.classList.toggle("hidden");
    }
}

function treatSuccess(answer) {
    loadingScreen();
    const userAccepted = document.querySelector(".initialScreen");
    userAccepted.classList.toggle("hidden");
    turnOn();
}

function requestMessagesError(error) {
    console.log("error during the requestMessagesError function request");
    console.log("Status code: " + error.response.status);
	console.log("Mensagem de erro: " + error.response.data);
}

function actualizeMessagesError(error) {
    console.log("error during the actualizeMessages function request");
    console.log("Status code: " + error.response.status);
	console.log("Mensagem de erro: " + error.response.data);
}

function iAmOn() {
    const requisicao = axios.post(`https://mock-api.driven.com.br/api/v4/uol/status`, myUser);
    requisicao.then(stillOn);
    requisicao.catch(nowOff);
}

function stillOn(answer) {
    console.log("I am still online");
}

function nowOff(error) {
    console.log("I am Off now");
    console.log(error);
    goToInitialScreen();
}

function sendMessageToChat() {
    const myMessageToGo = document.getElementById(`messageInput`);
    
    chekTodosMessageType();
    
    const messageToSend = 
    {
        from: myUser.name, 
        to: userToReceive, 
        text: myMessageToGo.value, 
        type: typeOfMessage
    };
    sendMessageToServer(messageToSend);
    myMessageToGo.value = "";
}

function chekTodosMessageType() {
    if(userToReceive === "Todos") {
        typeOfMessage = "message";
        auxTypeOfMessage = "Público";
        document.querySelector(".recipientAndVisibility").innerHTML = `Enviando para ${userToReceive} (${auxTypeOfMessage})`;
    }
}

function sendMessageToServer(messageToSend) {
    const request = axios.post(`https://mock-api.driven.com.br/api/v4/uol/messages`, messageToSend);
    request.then(actualizeMessages);
    request.catch(errorGoActualizeUsers);
}

function errorGoActualizeUsers() {
    const messageToSend =
    {   
        from: "Bate Papo Uol", 
        to: myUser.name, 
        text: `${userToReceive} já saiu do chat`, 
        type: "private_message"
    };
    informUserIsNoMoreHere(messageToSend);
}

function informUserIsNoMoreHere(messageToSend) {
    const request = axios.post(`https://mock-api.driven.com.br/api/v4/uol/messages`, messageToSend);
    request.then(actualizeMessages);
    request.catch(informErrorInSendindMessage);
}

function informErrorInSendindMessage(error) {
    console.log("Teve algum problema ao enviar a mensagem");
    console.log("Status code: " + error.response.status);
	console.log("Mensagem de erro: " + error.response.data);
}

function goToInitialScreen() {
    window.location.reload()
}

function openMenu() {
    const fundo = document.querySelector(".fundoEscuro");
    fundo.classList.toggle("hidden");
    const menu = document.querySelector(".menu");
    menu.classList.toggle("hidden");
}

function selectContact(element) {
    const contacts = document.querySelector(".listContacts");
    const checks = contacts.querySelectorAll(".check");
    
    vanishWithChecks(checks);

    checkSelected(element);
    
}

function vanishWithChecks(checks) {
    for(let i = 0; i < checks.length; i++){
        if(checks[i].classList.contains("hidden") === false) {
            checks[i].classList.add("hidden");
        }
    }
}

function checkSelected(element) {
    const checkImg = element.querySelector(".check");
    if(checkImg.classList.contains("hidden")) {
        defineUserOrType(element);
        checkImg.classList.toggle("hidden");
    }
}

function defineUserOrType(element){
    if(element.classList.contains("contact")){
        userToReceive = element.querySelector(".user").innerHTML;
    } else if (element.querySelector(".typeOfMessageToSend").innerHTML === "Público"){
        typeOfMessage = "message";
        auxTypeOfMessage = "Público";
    } else if (element.querySelector(".typeOfMessageToSend").innerHTML === "Reservadamente"){
        typeOfMessage = "private_message";
        auxTypeOfMessage = "reservadamente";
    }
    document.querySelector(".recipientAndVisibility").innerHTML = `Enviando para ${userToReceive} (${auxTypeOfMessage})`;
}

function selectOption(element) {
    const options = document.querySelector(".listOptions");
    const checks = options.querySelectorAll(".check");
    
    vanishWithChecks(checks);

    checkSelected(element);
}

function closeMenu() {
    const fundo = document.querySelector(".fundoEscuro");
    fundo.classList.toggle("hidden");
    const menu = document.querySelector(".menu");
    menu.classList.toggle("hidden");
}

