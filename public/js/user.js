//? Variavel para facilitar a mudança da porta para a api
let port = 2023;

//! Consumir os Dados da Api

let contentUser = document.getElementById("contentUser");

async function response(req, resp) {
	try {
		const resultUser = await fetch(`http://localhost:${port}/api/user/read`, { method: "GET" });
		const dataUser = await resultUser.json();

		showDataU(dataUser);
	} catch (error) {
		return error;
	}
}

response();

//! Função para adicionar os dados da  Api
function showDataU(users) {
	for (let user of users) {
		contentUser.innerHTML += `<hr>
        <b class='header'> Nome: </b> ${user.firstName}<br>
        <b class='header'> Apelido: </b>${user.lastName}<br>
        <b class='header'> Id: </b>${user._id}<br>
        <button class="btn-delete" name=${user._id} type='button'>Delete</button>
		<button class="btn-edit" name=${user._id} type='button'>Edit</button>
    `;
	}
}

let userForm = document.forms[0];
let userFirstName = userForm[0];
let userLastName = userForm[1];
let btnUser = userForm[2];

//!Função para adicionar novos dados
btnUser.addEventListener("click", () => {
	async function userPost(req, resp) {
		try {
			const responseFromUser = await fetch(`http://localhost:${port}/api/user/create`, {
				method: "POST",
				headers: {
					Accept: "application/json, text/plain",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName: `${userFirstName.value}`,
					lastName: `${userLastName.value}`,
				}),
			});

			const responseData = await responseFromUser.json();
			showDataU([responseData]);
		} catch (error) {
			return error;
		}
	}
	userPost();
    userFirstName.value = "";
    userLastName.value="";
});

contentUser.addEventListener("click", (event) => {
	if (event.target.classList.value == "btn-delete") {
		async function deleteUser(req, resp) {
			try {
				await fetch(`http://localhost:${port}/api/user/delete/${event.target.name}`, { method: "DELETE" });
				console.log("Deleted User");
			} catch (error) {
				console.log(error);
			}
		}

        async function clearDelete(){
            
            await deleteUser();
            await response();
			await responsePu();
        }
        clearDelete()
        contentUser.innerHTML = "";
		contentPurchase.innerHTML = "";

	} else if (event.target.classList.value == "btn-edit") {
		async function updateUser(req, resp) {
			try {
				await fetch(`http://localhost:${port}/api/user/update/${event.target.name}`, {
					method: "PUT",
					headers: {
						Accept: "application/json, text/plain",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						firstName: `${userFirstName.value}`,
						lastName: `${userLastName.value}`,
					}),
				});
			} catch (error) {
				console.log(error);
			}
		}
        
        async function clearUpdate(){
            await updateUser();
            await response();
			await responsePu();
        }
        clearUpdate();
        contentUser.innerHTML = "";
		contentPurchase.innerHTML = "";
        userFirstName.value = "";
        userLastName.value = "";
	}
});