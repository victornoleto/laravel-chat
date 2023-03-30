import moment from 'moment';

var chatElement = document.getElementById('chat');
var messagesElement = document.getElementById('messages');
var messagesListElement = messagesElement.querySelector('ul');
var formElement = document.querySelector('#input form');
var inputElement = formElement.querySelector('input');
var submitElement = formElement.querySelector('button');

var authId = chatElement.getAttribute('data-user-id');

function add(message) {

	var child = document.createElement('li');

	child.innerHTML = `
		<label>${message.user.name}</label>
		<p>${message.text}</p>
		<small>${moment(message.created_at).format('LTS')}</small>`;

	if (message.user.id == authId) {
		child.classList.add('self');
	}

	child.classList.add('shadow')
	
	messagesListElement.append(child);
	messagesElement.scroll(0, messagesListElement.scrollHeight);
}

async function get() {

	const response = await fetch('/messages');
	
	const data = await response.json();

	data.reverse().forEach(add);
}

async function send(text) {

	const data = {
		text
	};

	fetch("message", {
		method: "POST",
		headers: {
			"X-Requested-With": "XMLHttpRequest"
		},
		body: JSON.stringify(data),
	})
	//.then((response) => response.json())
	.then((data) => {
		inputElement.value = '';
		submitElement.removeAttribute('disabled');
	})
	.catch((error) => {
		console.error(error);
		alert('Não foi possível enviar a mensagem!');
		submitElement.removeAttribute('disabled');
	});
}

get();

formElement.addEventListener('submit', function(e) {
	
	e.preventDefault();

	submitElement.setAttribute('disabled', 'disabled');

	send(inputElement.value);

	return false;

});

var ws = window.Echo.channel('chat');

ws.listen('.MessageCreated', add);