let contentPurchase = document.getElementById("contentPurchase");

//TODO: Adicionar as funções de purchase

async function responsePu(req, resp) {
	try {
		const resultPurchase = await fetch(`http://localhost:${port}/api/purchase/read`, { method: "GET" });
		const dataPurchase = await resultPurchase.json();

		showDataPu(dataPurchase);
	} catch (error) {
		return error;
	}
}

responsePu();

function showDataPu(purchases) {
	for (let purchase of purchases) {
		contentPurchase.innerHTML += `<hr>
                    <b class='header'> Nome do Cliente: </b> ${purchase.clientName}<br>
                    <b class='header'> Producto Comprado: </b>${purchase.productName}<br>
                    <b class='header'> Id da Compra: </b>${purchase._id}<br>
					<button class="btn-delete" name=${purchase._id} type='button'>Delete</button>
					<button class="btn-edit" name=${purchase._id} type='button'>Edit</button>             
                `;
	}
}

let purchaseForm = document.forms[2];
let purchaseClientId = purchaseForm[0];
let purchaseProductId = purchaseForm[1];
let btnPurchase = purchaseForm[2];

btnPurchase.addEventListener("click",()=>{

	async function purchasePost(req,resp){
		try{
			const responseFromPurchase = await fetch(`http://localhost:${port}/api/purchase/create`,
			{
				method: "POST",
				headers: {
					Accept: "application/json, text/plain",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					client_id: `${purchaseClientId.value}`,
					product_id: `${purchaseProductId.value}`,
				}),
			});
			const responseDataPurchase = await responseFromPurchase.json();
			showDataPu([responseDataPurchase]);
		}
		catch(error){
			return error;
		}	
	}
	purchasePost();
	purchaseClientId.value="";
	purchaseProductId.value="";
});

contentPurchase.addEventListener("click",(event)=>{

	if(event.target.classList.value == "btn-delete"){

		async function deletePurchase(req,resp){

			try{
				await fetch(`http://localhost:${port}/api/purchase/delete/${event.target.name}`, { method: "DELETE" });
				console.log("Deleted Purchase");
			}
			catch(error){
				console.log(error);
			}
		}
		async function clearDeletePu(){
			await deletePurchase();
			await responsePu();
		}

		clearDeletePu();
		contentPurchase.innerHTML = "";
	}
	else if(event.target.classList.value == "btn-edit"){

		async function updatePurchase(req, resp) {
			try {
				await fetch(`http://localhost:${port}/api/purchase/update/${event.target.name}`,
				{
					method: "PUT",
					headers: {
						Accept: "application/json, text/plain",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						client_id: `${purchaseClientId.value}`,
						product_id: `${purchaseProductId.value}`,
					}),
				});
			} catch (error) {
				console.log(error);
			}
		}
        
        async function clearUpdatePu(){
            await updatePurchase();
            await responsePu();
        }
        clearUpdatePu();
        contentPurchase.innerHTML = "";
        purchaseClientId.value = "";
        purchaseProductId.value = "";
	}
});