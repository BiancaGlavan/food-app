const category = document.querySelector('#category');
const area = document.querySelector('#area');
const areaBtn = document.querySelector('#area-btn');
const categoryBtn = document.querySelector('#category-btn');
const filtersContainer = document.querySelector('.filters-container');
const mask = document.querySelector('.mask');
const searchOpen = document.querySelector('.search-open');
const searchInput = document.querySelector('.search-input'); 
const searchResultContainer = document.querySelector('.search-result-container');
const searchRecipesContainer = document.querySelector('.search-recipes-container');

const recipesContainer = document.querySelector('.recipes-container');
const resultCount = document.querySelector('.result-count');

const singleRecipeContainer = document.querySelector('.single-recipe-container');
const navigateBack = document.querySelector('.navigate-back');
// URLs

const urlByCategory = 'https://www.themealdb.com/api/json/v1/1/filter.php?c='; // + param  name. ex: Seafood
const urlByArea = 'https://www.themealdb.com/api/json/v1/1/filter.php?a='; // + param  name. ex: Canadian
const urlSingleMeal = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i='; // + param id
const urlSearchMeal = 'https://www.themealdb.com/api/json/v1/1/search.php?s='; // + param name. meal name. ex: Arrabiata






/**
 * Create filter tabs
 * click on category or area
 * clear result-container
 * add a loader inside result-container
 * fetch data acording to selected option
 * on fetch success remove the loader
 * prepare html block as a string to append it on the main content section (result)
 * update innerHTML of result-container with prepared block
 * 
 * 
 * 
 */

const App = {

    categoryFilters: [],
    areaFilters: [],
    clearResultContainer: () => {

        resultCount.innerHTML = '';
        recipesContainer.innerHTML = 'Loading...';
    },
    navigateBack: () => {

        navigateBack.classList.add('hide');
        singleRecipeContainer.classList.add('hide');
        resultCount.classList.remove('hide');
        recipesContainer.classList.remove('hide');
    },
    toggleMobileFilters: () => {
        if(filtersContainer.classList.contains('is-open')) {
            filtersContainer.classList.remove('is-open');
            mask.classList.remove('is-visible');
        } else {
            filtersContainer.classList.add('is-open');
            mask.classList.add('is-visible');
        }

    },

    onInputEnter: (event) => {
        if(event.key === 'Enter') {
            searchRecipesContainer.innerHTML = 'Loading...';
            App.getSearchResults(); 

        }
    },

    openSearch: () => {
        searchOpen.classList.remove('hide');
    },

    closeSearch: () => {
        searchOpen.classList.add('hide');
        searchResultContainer.classList.add('hide');
        searchRecipesContainer.innerHTML = 'Loading...';
    },
    getSearchResults: () => {
        searchInput.value;
        console.log('searchinput: ', searchInput.value);
        searchResultContainer.classList.remove('hide');
        App.fetchSearchResults(searchInput.value);
        // GET value from search-input
        //Remove hide class from search result container
        //fetch search results from api
        //print the array of recipes inside search result container
    },

    selectFilterTab: (tab) => {

        if (tab === 'area') {
            area.classList.remove('hide');
            category.classList.add('hide');
            areaBtn.classList.add('selected');
            categoryBtn.classList.remove('selected');
            App.printFilterAreas(App.areaFilters);
        } else {
            area.classList.add('hide');
            category.classList.remove('hide');
            areaBtn.classList.remove('selected');
            categoryBtn.classList.add('selected');
            App.printFilterCategories(App.categoryFilters);
        }
    
    },
    selectCategory: (ev, categoryName) => {

        category.querySelectorAll('.filter-item').forEach((el, idx) => {
            el.classList.remove('selected');
        });
        ev.target.classList.add('selected');
        App.navigateBack();
        App.fetchCategory(categoryName);
    },
    
    selectArea: (ev, areaName) => {
    
        area.querySelectorAll('.filter-item').forEach((el, idx) => {
            el.classList.remove('selected');
        });
        ev.target.classList.add('selected');
        App.navigateBack();
        App.fetchArea(areaName);
    },

    selectRecipe: (mealId) => {
        console.log('meal Id: ', mealId);
        recipesContainer.classList.add('hide');
        resultCount.classList.add('hide');
        singleRecipeContainer.classList.remove('hide');
        singleRecipeContainer.innerHTML = 'Loading...';
        navigateBack.classList.remove('hide');

        
        App.closeSearch();
        
        App.fetchRecipe(mealId);
    },

    printMeals: (meals) => {

        let mealsRes = '';
        meals.forEach((meal, idx) => {
            let newMeal = `
                <div class="recipe-card" data-id-meal="${meal.idMeal}" onclick="App.selectRecipe(${meal.idMeal})">
                    <img src="${meal.strMealThumb}" alt="">
                    <h3 class="recipe-title">${meal.strMeal}</h3>
                </div>
            `;

            mealsRes = mealsRes + newMeal;
        });

        recipesContainer.innerHTML = mealsRes;
        resultCount.innerHTML = meals.length + ' items';


    },

    printFilterCategories: (categs) => {
        let categRes = '';
        categs.forEach((cat, idx) => {
            let newCat = `<div class="filter-item" onclick="App.selectCategory(event, '${cat.strCategory}')">${cat.strCategory}</div>`;
            categRes = categRes + newCat;
        });
        category.innerHTML = categRes;
    },

    printFilterAreas: (areas) => {
        let areaRes = '';
        areas.forEach((ar, idx) => {
            let newAr = `<div class="filter-item" onclick="App.selectArea(event, '${ar.strArea}')">${ar.strArea}</div>`;
            areaRes = areaRes + newAr;
        });
        area.innerHTML = areaRes;
    },

    printSingleRecipe: (meal) => {

        let instructions = '';
        let instructionsData = meal.strInstructions.split(/\r?\n/).filter((el) => el);
        instructionsData.forEach((ins, idx) => {
            let newInstruction = `<p class="instruction">${ins}</p>`;
            instructions = instructions + newInstruction;
        });
        
        let ingredients = '';

        for (let i = 1; i <= 20; i++) {
            const ingredientFinal =  meal['strMeasure'+i] + ' ' + meal['strIngredient'+i];
            if(ingredientFinal.trim() !== '' && meal['strIngredient'+i]) {
                let newIngredient = `<li class="ingredient">${ingredientFinal}</li>`;
                ingredients = ingredients + newIngredient;
            }
            
        }

        

        let singleRecipeContent = `
            <h3 class="recipe-title">${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="">
            <h4>Ingredients</h4>
            <ul class="ingredients">
                ${ingredients}
            </ul>
            <h4>Instructions</h4>
            <div class="instructions">
                ${instructions}
            </div>
        `;
        singleRecipeContainer.innerHTML = singleRecipeContent;
        window.scrollTo(0, 0);
    },

    printSearchResults: (meals) => {

        let mealsRes = `<div class="search-results-count">${meals.length} items</div>`;
        meals.forEach((meal, idx) => {
            let newMeal = `
                <div class="search-recipe-card" data-id-meal="${meal.idMeal}" onclick="App.selectRecipe(${meal.idMeal})">
                    <img src="${meal.strMealThumb}" alt="">
                    <h3 class="recipe-title">${meal.strMeal}</h3>
                </div>
            `;

            mealsRes = mealsRes + newMeal;
        });
        searchRecipesContainer.innerHTML = mealsRes;

        //recipesContainer.innerHTML = mealsRes;
        //resultCount.innerHTML = meals.length + ' items';

    },

    fetchCategory: (categoryName) => {
        App.clearResultContainer();

        fetch(urlByCategory + categoryName).then((response) => response.json())
            .then((data) => {
                console.log('fetch area: ', data);
                App.printMeals(data.meals);
            });
    },
    fetchArea: (areaName) => {

        App.clearResultContainer();

        fetch(urlByArea + areaName).then((response) => response.json())
            .then((data) => {
                console.log('fetch area: ', data);
                App.printMeals(data.meals);
            });
    },
    fetchRecipe: (recipeId) => {

        fetch(urlSingleMeal + recipeId).then((response) => response.json())
            .then((data) => {
                console.log('fetch recipe: ', data.meals[0]);
                App.printSingleRecipe(data.meals[0]);
            });
    },
    fetchAllCategories: () => {

        fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list').then((response) => response.json())
            .then((data) => {
                console.log('fetch categ: ', data.meals);
                App.categoryFilters = data.meals;
                App.printFilterCategories(data.meals);
            });
    },

    fetchAllAreas: () => {

        fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list').then((response) => response.json())
            .then((data) => {
                App.printFilterAreas(data.meals);
                App.areaFilters = data.meals;
            });
    },

    fetchSearchResults:(inputValue) => {

        fetch(urlSearchMeal + inputValue).then((response) => response.json())
            .then((data) => {
                console.log('fetch search meal: ', data);
                App.printSearchResults(data.meals);
            });

    },

    init: () => {
        App.fetchArea('Italian');
        App.fetchAllCategories();
        App.fetchAllAreas();
    }
};

App.init();