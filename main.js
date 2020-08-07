const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  resultHeading = document.getElementById("result-heading"),
  mealsEl = document.getElementById("meals"),
  single_mealEl = document.getElementById("single-meal");


function getTerm(e){
  e.preventDefault();
  const term = search.value;
  if(term.trim() === ''){
    alert('Please enter a search term')
  } else {
    fetchMealByTerm(term)
  }
  search.value = '';
}

async function fetchMealByTerm(term){
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
  const data = await res.json();
  const meals = data.meals;
  if(!meals){
    resultHeading.innerHTML = `<h2>There is no results for '${term}'. Try again.</h2>`;
    return false;
  } else {
    resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
    addMealsToDom(meals);
  }
} 

function addMealsToDom(meals){
  single_mealEl.innerHTML = '';
  mealsEl.innerHTML = meals.map(meal => `
    <div class="meal">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}"></img>
      <div class="meal-info" data-mealId="${meal.idMeal}">
        <h3>${meal.strMeal}</h3>
      </div>
    </div>`
  ).join("");
}

function getMealId(e){
  const mealInfo = e.path.find(item => {
    if(item.classList){
      return item.classList.contains('meal-info')
    } else {
      return false;
    }
  })
  if(mealInfo){
    const mealId = mealInfo.getAttribute('data-mealId');
    fetchMealById(mealId)
  } else {
    return false;
  }
}

async function fetchMealById(mealId){
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const data = await res.json();
  const meal = data.meals[0];
  addMealToDOM(meal);
} 

async function fetchRandomMeal(){
  meals.innerHTML = '';
  resultHeading.innerHTML = ''; 
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
  const data = await res.json();
  const meal = data.meals[0];
  addMealToDOM(meal);
}

function addMealToDOM(meal){
  const ingredients = [];
  for(let i=1; i<=20; i++){
    if(meal[`strIngredient${i}`]){
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      ingredients.push(`${ingredient} - ${measure}`)
    } else {
      break;
    }
  }
  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h3>${meal.strMeal}</h3>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}"></img>
      <div class="single-meal-info">
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}  
      </div>
      <h3>Instructions</h3>
      <p>${meal.strInstructions}</p>
      <h3>Ingredients</h3>
      <ul>${ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
    </div>
  `
}

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchRandomMeal);
submit.addEventListener('submit', getTerm);
random.addEventListener('click', fetchRandomMeal);
mealsEl.addEventListener('click', getMealId);
