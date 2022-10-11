import { Recipe } from "./types";

const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");

(searchButton as HTMLButtonElement)?.addEventListener("click",()=>{
  render();
});

//pega uma string e dividi em array mediante ao campo de paramentro
function splitSearch(search: string){
  const parseSearch = search.replace(/\s/g, "").split(",");
  return parseSearch.filter((search)=>search);
}

//função para pegar os dados, criando o tipo genérico de receita
async function getData(): Promise<Recipe[]>{
    const request = await fetch("https://receitas-server.vercel.app/api");
    const data = await request.json();
    return data;
}

//função de filtro para mais de um item
async function filterByIngredients(ingredient: string){

  //pega os dados da API
  const data = await getData();
  const filterData  = data.filter(recipe => {

    //verifica se tem mais de um item na pesquisa
    const isMultiple= splitSearch(ingredient).length >1;

    if(!ingredient) return data;

    //caso tenhamos apenas 1 ingrediente
    if(!isMultiple) {
      const ingredientIncludes =  recipe.Ingredients.filter(recipeIngredient=>{
        return recipeIngredient.toLowerCase().includes(ingredient.toLowerCase());
      });

      return ingredientIncludes.length ? recipe : false;
    }
    
    //caso tenha mais de um ingrediente, cria um array para salvar o retorno da pesquisa
    if(isMultiple){
    let acumulador: string[] = [];
    const searchValues = splitSearch(ingredient);

    for (let i = 0; i < searchValues.length; i++) {
      for (let y = 0; y < recipe.Ingredients.length; y++) {
        if(recipe.Ingredients[y].includes(searchValues[i])){
          if(acumulador.includes(searchValues[i])){
            return false;
          } 
          acumulador.push(searchValues[i]);
        }    
      }    
    }

    if(acumulador.length === searchValues.length) return true;
  }
  });
 return filterData;
}

async function render(){
  //const listElement = document.querySelector("#container-grid-receitas");
  const data = await getData();
  const listElement = document.getElementById("container-grid-receitas");
  console.log("eu existo");
  
  try{
    if(listElement){
    listElement.innerHTML = '';
    listElement.innerHTML = `<h1>|Carregando...</h1>`;

    const items = await filterByIngredients((searchInput as HTMLInputElement).value);
    listElement.innerHTML = '';
      
  
      items.forEach((item) =>{
        listElement.innerHTML += `
        <a href="#abrirModal">
          <div class="card-receitas">
             <img src="${item.urlImage}" alt="" class="card-receitas-poster" id="card-receitas-poster--${item}">
                  <div class="card-receitas-info-container">
                   <div class="card-receitas-info-container-header">
                      <h4 class="card-receitas-info-title" id="card-receitas-title-${item}"> ${item.Name} - &nbsp;
                      <span class="card-receitas-info-notes" id="card-receitas-nota-${item}">${item.Author} </span></h4>
                   </div>
                   </div>
                  </div>
                  </a>
                  <div id="abrirModal" class="modal">
                  
                  <div>
                  <a href="#fechar" title="Fechar" class="fechar">x</a>
                  <h2 id="card-receitas-title-${item}">${item.Name} </h2>
                 <h3 id="card-receitas-nota-${item}">${item.Author} </h3>
                 <b><p>Ingredientes:</p></b>
                  <p id="card-receitas-title-${item}">${item.Ingredients}</p>    
                  </div>
                </div>
        `;
      })
    }
  }catch{
    if(listElement){
    listElement.innerHTML = `<h1>Não foi possivel carregar...</h1>`;
    }
  }

}
render();

