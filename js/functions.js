

let foodArr = []; // intialises an array
let foodSearch = 0; //
let indexAccess = 0; // 
let dataTypes = ['Survey%20%28FNDDS%29', 'SR%20Legacy']; // The surveys that will be used by the program (there are multiple but I found these to be the most efficient)
function displayNutrients(nutrients){  // displays a bunch of nutrients provided by the arguement in a table
    if(nutrients.length !== 0){ 
    console.log('works');
    document.getElementById('nutritionTableDiv').innerHTML = `<table id="nutritionTable"><tr>This is for ${document.getElementById("quantityOfFood").value} grams of the product</tr><tr><th>Nutrient</th><th>Amount</th><th>Daily Value</th></tr></table>`
    for(let i = 0; nutrients.length; i++){
        document.getElementById('nutritionTable').innerHTML = document.getElementById('nutritionTable').innerHTML + `<tr><td>${nutrients[i][0].nutrient.name}</td><td>${nutrients[i][0].amount}${nutrients[i][1]}</td><td>${calculatePercentage(nutrients[i][0].amount, i, nutrients[i][2])}</td></tr>`;
    }}else{
        document.getElementById('nutritionTableDiv').innerHTML = '<p>The FDC does not have data on this food.</p>'
    }
}
function calculatePercentage(amount,i, dailyNeeds){
    if( dailyNeeds !== undefined){
    const percentage = `${Math.round(amount / dailyNeeds * 100)}%`;
    return percentage;
    }else{
    return 'This nutrient is not needed by you';
}
}
async function getNutrients(){ // uses the specific id of a food and then calls it and gets its nutritional info
    document.getElementById('loading').style.display = 'none'; // hides the buttons and crap
    document.getElementById('loader').style.display = 'initial'; // says looding!
    const commonNutrients = [['Water', 'g', 3000], ['Energy', 'kcal', 2000], ['Protein', 'g', 50], ['Total lipid (fat)', 'g', 78],["Fatty acids, total saturated", 'g', 20], ['Carbohydrate, by difference', 'g', 275], ['Fiber, total dietary', 'g', 28], ['Cholesterol', 'mg', 300], ['Sugars, total including NLEA', 'g', 50], ["Calcium, Ca", 'mg', 1300], ['Iron, Fe', 'mg', 18], ['Magnesium, Mg', 'mg', 420], ['Phosphorus, P', 'mg', 1250], ['Potassium, K', 'mg', 4700], ['Sodium, Na', 'mg', 2300], ['Zinc, Zn', 'mg', 11], ['Copper, Cu', 'mg', 0.9], ['Vitamin C, total ascorbic acid', 'mg', 90], ['Thiamin', 'mg', 1.2], ['Riboflavin', 'mg', 1.3], ['Niacin', 'mg', 16], ['Vitamin B-6', 'mg', 1.7], ['Vitamin B12', 'µg', 2.4], ['Vitamin D (D2 + D3)', 'µg', 20], ['Vitamin E (alpha-tocopherol)', 'mg', 15], ['Zinc', 'mg'], ['Alcohol, ethyl' , 'g'], ['Caffeine', 'mg']]; // a bunch of common nutrients and their daily consumption needs
    const url = `https://api.nal.usda.gov/fdc/v1/food/${foodArr[document.getElementById('select').value][1]}?format=full&nutrients=25&api_key=v0ZRrqADzg5LIp68kCN6YjiMhRFOUeQQhGA8FCYr`; // makes a request for the food that was selected (by its id)
    const response = await fetch(url); // gets the response
    const data = await response.json(); // transforms it into usable data
    console.log(data); // logs it into the consoole
    const foodNutrients = data.foodNutrients; // gets the nutrients of the food
    let filteredFoodNutrients = []; // an intialized array for the nutrients that were filtered
    let index = 0; // just the index
    function filterFood(){ // a  that filters through a nutrient and keeps it only if it sone of the common ones defined above (most of the nutrients have weird ass names and don't contribute all that much)
        commonNutrients.forEach((nutrient) => { // filters through the food nutrients keep
            
        console.log(foodNutrients[index].nutrient.name)
            if(nutrient[0] == foodNutrients[index].nutrient.name){
                if(nutrient[2] !== undefined){
                filteredFoodNutrients.push([foodNutrients[index], nutrient[1], nutrient[2]]);
                }else{filteredFoodNutrients.push([foodNutrients[index], nutrient[1]]);}
            }
            
        });
        index = index + 1;
    }
   
    foodNutrients.forEach(filterFood); // filters all the nutrients
     console.log(filteredFoodNutrients)
    let filteredNutrients = filteredFoodNutrients.filter((nutrient) => {return nutrient[0].amount > 0});// filters again and only returns nutrients that are actually present in some quantity
      let i = 0;
       filteredNutrients.forEach((nutrient) => {
           filteredNutrients[i][0].amount = (filteredNutrients[i][0].amount * (document.getElementById("quantityOfFood").value / 100)).toFixed(1);
           i++;
       })
       
       document.getElementById('loading').style.display = 'initial';
    document.getElementById('loader').style.display = 'none';
    console.log(filteredNutrients);
    displayNutrients(filteredNutrients); // calls display nutrients on the filteredNutrients array
}


async function getAPI(url) { // makes an API get request and processes the results
   if(document.getElementById("food_input").value !== ""){ // checks if the user actually entered a food
    document.getElementById('loading').style.display = 'none'; // sets the buttons invisible 
    document.getElementById('loader').style.display = 'initial'; // makes loading appear on screen
   const response = await fetch(url); // calls the url
   let data = await response.json(); // converts the results to something usable
   console.log(data); // just console.log what i get (to check)
   let foodsList = data.foods.filter((food)=>{if(food.foodNutrients !== []){return food}}); // filters for foods that actually contain nutrients (sometimes the surveyors get lazy and don't actually record the nutrients inside (do your job ppl!!))
   console.log(foodsList);// just console.log what i get (to check)
   console.log(foodsList[0]); // just console the first result (to check)
   
   
   for (let i = 0; i < foodsList.length; i++) {
    foodArr.push([foodsList[i].description, foodsList[i].fdcId]);
   } // pushes the results into another array that only contain the description of the food and it's id. (I don't need the other crap)
   foodSearch = foodSearch + 1; // adds 1 to the number of times getAPI is called (I need to make foodArr contain the foods from both requests)
   if(foodSearch == 2){ // once it verifies that all the results are obtained I proceed to then replacing the old html contents for the new contents
console.log(foodSearch);
   document.getElementById('loading').innerHTML = '<label for="food">Enter the food ex.(banana, atlantic salmon, asparagus)</label> <div id="autocomplete" style="width:300px;"><input required name="food" type="text" id="food_input"></div><div id="buttonDiv" style="width:300px;"><button id="btn">Specify what you want to get.</button></div>'; // makes the divs
   document.getElementById("autocomplete").innerHTML = '<select name="select" id="select"></select>' + '<input type="number" placeholder="Enter the amount in grams!" id="quantityOfFood">'; // puts a select inside the div
   document.getElementById("buttonDiv").innerHTML = '<button id="nutrientButton" >Click to get nutrient information.</button>'; // le boutton
   document.getElementById("nutrientButton").onclick = getNutrients; // makes the onclick of the button the getNutrients function
   for(let i = 0; foodArr.length > i; i++){ 
     document.getElementById("select").innerHTML = document.getElementById("select").innerHTML + `<option value="${indexAccess}">${foodArr[i][0]}</option>`;
     indexAccess++;
   }
   // a for loop that enters the results of the requests and displays them as options in a select
   // index access is so that we know the index of each food in the foodArr array
   }
   }else {
    alert('Enter the product you want to specify'); //tells the user to enter a product and not just press the button (les utilisateurs ne sont pas les plus brillant du gens)
}
}


async function foodProcessor() { // calls all the functions, I called it food processor just for fun
         await getAPI(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${document.getElementById("food_input").value}&dataType=${dataTypes[0]}&pageSize=200&pageNumber=1&sortBy=dataType.keyword&sortOrder=asc&api_key=v0ZRrqADzg5LIp68kCN6YjiMhRFOUeQQhGA8FCYr`); // calls getAPI on the first survey
         await getAPI(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${document.getElementById("food_input").value}&dataType=${dataTypes[1]}&pageSize=200&pageNumber=1&sortBy=dataType.keyword&sortOrder=asc&api_key=v0ZRrqADzg5LIp68kCN6YjiMhRFOUeQQhGA8FCYr`); // calls getAPI on the second survey
    document.getElementById('loading').style.display = 'initial'; // reveals the buttons and crap
        document.getElementById('loader').style.display = 'none'; // sets the loading message to nothing
}
export {getAPI, foodProcessor, getNutrients}; // I export it and then import it somewhere else. Don't quite remember why but I'm not gonna touch it just in case

