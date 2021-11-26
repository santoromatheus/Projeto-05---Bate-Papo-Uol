/* Ao entrar no site, este deve carregar as mensagens do servidor e exibi-las conforme layout fornecido */
/* Repetindo a operação a cada 3 segundos */
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

function runThroughtAnswer(answer) {
    
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

function scrollToFinalMessage(answer) {
    const messages = document.querySelectorAll('.message');
    /* console.log(messages); */
    const lastMessage = messages[messages.length-1];
    /* console.log(lastMessage); */
    lastMessage.scrollIntoView(false);
}

function checkUserValidity() {
    const userInput = document.getElementById(`myUserInput`);
    myUser = { name: userInput.value };
    userRequisition();
}

function userRequisition() {
    /* console.log(myUser); */
    const requisicao = axios.post(`https://mock-api.driven.com.br/api/v4/uol/participants`, myUser);
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
}

function sendMessageToChat() {
    console.log("entrei no sendMEssage");
    const myMessageToGo = document.getElementById(`messageInput`);
    console.log(`Mesagem pra enviar: ${myMessageToGo.value}`);
    const messageToSend = 
    {
        from: myUser.name, 
        to: userToReceive, 
        text: myMessageToGo.value, 
        type: typeOfMessage
    };
    console.log(`Mesagem pra enviar: ${messageToSend.from}, ${messageToSend.to}, ${messageToSend.text} e ${messageToSend.type}`);
    const request = axios.post(`https://mock-api.driven.com.br/api/v4/uol/messages`, messageToSend);
    request.then(actualize);
    request.catch(actualizeUsers);
}

function actualizeUsers() {
    const messageToSend =
    {   
        from: "Bate Papo Uol", 
        to: myUser.name, 
        text: `${userToReceive} já saiu do chat`, 
        type: "private_message"
    };
    const request = axios.post(`https://mock-api.driven.com.br/api/v4/uol/messages`, messageToSend);
    request.then(actualize);
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
        checkImg.classList.toggle("hidden");
    }
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

