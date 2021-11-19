let contentProduct = document.getElementById("contentProduct");

//TODO: Acabar as Funções de Produtos

async function responseP(req, resp) {
	try {
		const resultProduct = await fetch(`http://localhost:${port}/api/product/read`,{ method: "GET" });
		const dataProduct = await resultProduct.json();
		showDataP(dataProduct);
	} catch (error) {
		return error;
	}
}

responseP();

function showDataP(products) {
	for (let product of products) {
		contentProduct.innerHTML += `<hr>
        <b class='header'> Nome do Produto: </b> ${product.name}<br>
        <b class='header'> Descrição: </b>${product.description}<br>
        <b class='header'> Id: </b>${product._id}<br>
		<button class="btn-delete" name=${product._id} type='button'>Delete</button>
		<button class="btn-edit" name=${product._id} type='button'>Edit</button>        
    `;
	}
}

let productForm = document.forms[1];
let productName = productForm[0];
let productDesciption = productForm[1];
let btnProduct = productForm[2];

btnProduct.addEventListener("click",()=>{

	async function productPost(req,resp){
		try{
			const responseFromProduct = await fetch(`http://localhost:${port}/api/product/create`,
			{
				method: "POST",
				headers: {
					Accept: "application/json, text/plain",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: `${productName.value}`,
					description: `${productDesciption.value}`,
				}),
			});
			const responseDataProduct = await responseFromProduct.json();
			showDataP([responseDataProduct]);
		}
		catch(error){
			return error;
		}	
	}
	productPost();
	productName.value="";
	productDesciption.value="";
});

contentProduct.addEventListener("click",(event)=>{

	if(event.target.classList.value == "btn-delete"){

		async function deleteProduct(req,resp){

			try{
				await fetch(`http://localhost:${port}/api/product/delete/${event.target.name}`, { method: "DELETE" });
				console.log("Deleted User");
			}
			catch(error){
				console.log(error);
			}
		}
		async function clearDeletePr(){
			await deleteProduct();
			await responseP();
		}
		clearDeletePr();
		contentProduct.innerHTML = "";
	}
	else if(event.target.classList.value == "btn-edit"){

		async function updateProduct(req, resp) {
			try {
				await fetch(`http://localhost:${port}/api/product/update/${event.target.name}`,
				{
					method: "PUT",
					headers: {
						Accept: "application/json, text/plain",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: `${productName.value}`,
						description: `${productDesciption.value}`,
					}),
				});
			} catch (error) {
				console.log(error);
			}
		}
        
        async function clearUpdatePr(){
            await updateProduct();
            await responseP();
			await responsePu();
        }
        clearUpdatePr();
        contentProduct.innerHTML = "";
		contentPurchase.innerHTML = "";
        productName.value = "";
        productDesciption.value = "";
	}
});