const resultContainer = document.getElementById("result");
const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const searchContainer = document.querySelector(".search-box");

// Api url to fetch meal data
const apiURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

//event listener for search and input (when press enter)
searchBtn.addEventListener("click", searchMeal);
searchInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    searchMeal();
  }
});

//handle meal function
function searchMeal() {
  //get input value
  const userInput = searchInput.value.trim();
  //if user input is empty
  if (userInput === "") {
    resultContainer.innerHTML = `<h2 class="error">Please enter a meal name</h2>`;
    return;
  }

  //fetch meal data using api with user input
  fetch(apiURL + userInput)
    .then((response) => response.json())
    .then((data) => {
      const meal = data.meals[0];
      //hanndle error if meal is not found
      if (meal === null) {
        resultContainer.innerHTML = `<h2 class="error">Meal not found</h2>`;
        return;
      }
      //if meal is found
      const ingredients = getIngredients(meal);
      //generate html to display meal data
      const recipeHtml = `
        <div class="details">
            <h2>${meal.strMeal}</h2>
            <h4>${meal.strArea}</h4>
        </div>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div id="ingre-container">
            <h3>Ingredients:</h3>
            <ul>${ingredients}</ul>
        </div>
        <div id="recipe">
            <button id="hide-recipe">X</button>
            <pre id="instructions">${meal.strInstructions}</pre>
        </div>
        <button id="show-recipe">Show Recipe</button>
        `;
      resultContainer.innerHTML = recipeHtml;

      //hide recipe
      const hideRecipeBtn = document.getElementById("hide-recipe");
      hideRecipeBtn.addEventListener("click", hideRecipe);

      //show recipe
      const showRecipeBtn = document.getElementById("show-recipe");
      showRecipeBtn.addEventListener("click", showRecipe);

      searchContainer.style.opacity = "0";
      searchContainer.style.display = "none";
    })
    //handle error
    .catch((error) => {
      searchContainer.style.opacity = "1";
      searchContainer.style.display = "grid";
      resultContainer.innerHTML = `<h2 class="error">Something went wrong</h2>`;
    });
}

//generate html for list of ingredients
function getIngredients(meal) {
  let ingreHtml = "";
  // there can be maximum 20 ingredients
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingreHtml += `<li>${ingredient} - ${measure}</li>`;
    } else {
      break;
    }
  }
  return ingreHtml;
}

//handle hide recipe
function hideRecipe() {
  const recipe = document.getElementById("recipe");
  recipe.style.display = "none";
}

//handle show recipe
function showRecipe() {
  const recipe = document.getElementById("recipe");
  recipe.style.display = "block";
}
