$(function() {

	$("#chat").each(function() {

		var $form = $(this).find('form');
		var $input = $form.find('input');
		var $submit = $form.find('button');

		var $messages = $(this).find('#messages');
		var $messagesList = $messages.find('ul');

		var authId = $(this).data('user-id');

		function add(message) {

			var $li = $(`<li class="shadow">
				<label>${message.user.name}</label>
				<p>${message.text}</p>
				<small>${moment(message.created_at).format('LTS')}</small>
			</li>`);

			if (message.user.id == authId) {
				$li.addClass('self');
			}

			$messagesList.append($li);
			$messages.scrollTop($messages.prop('scrollHeight'));
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
				$input.val('');
				$submit.prop('disabled', false);
			})
			.catch((error) => {
				console.error(error);
				alert('Não foi possível enviar a mensagem!');
				$submit.prop('disabled', false);
			});
		}

		get();
		
		$form.on('submit', function(e) {

			e.preventDefault();
	
			$submit.prop('disabled', true);
	
			send($input.val());
	
			return false;

		});

		var ws = window.Echo.channel('chat');
		ws.listen('.MessageCreated', add);

	});

});