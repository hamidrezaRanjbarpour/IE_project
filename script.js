

var results;
var starships = new Array();

var flag = false;
var nextPage;
let errorDetected = false;

/* This function fetches content of starships according to given page number.
   Starship details then will be stored in starships array for further use. */
function fetchStarships(pageNum){
    
        clearContent();

        console.log(pageNum);
        if(pageNum == 1)
            reqUrl = 'https://swapi.dev/api/starships/';
        else
            reqUrl = 'https://swapi.dev/api/starships/?page=' + pageNum;

        fetch(reqUrl)
            .then(response => {
                if(!response.ok){
                    console.log(response);

                    errorDetected = true;
                    let elem = document.createElement('h4');
                    elem.id = 'error';
                    elem.innerHTML = 'Server returned 404 Error because no content is available!';
                    document.getElementsByClassName('list')[0].appendChild(elem);
                    
                    throw new Error('Error Detected.');

                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                results = data;
                nextPage = data.next;
                
                starships = data.results;

                showStarShips(starships.slice(0, 11));
                    
                });
                
       
}




/* this function renders items passed to it as input */
function showStarShips(items){
    
    let parent = document.getElementsByClassName('starships')[0];
    for (let item of items) {
        let element = document.createElement('li');
        console.log(item.name);
        element.innerHTML = item.name;

        parent.appendChild(element);
    }
    console.log(items);

    handleOnClick();
}

/* Get all starship names and register onclick handler on them */
function handleOnClick(){
    let array = document.querySelectorAll('ul.starships li');
    
    for (let item of array) {
      
        item.addEventListener('click', showShipDetails.bind(this, item.innerHTML));
       
    }
}

/* This function retrieves a starship's details and creates DOM elements to render it on screen. */
function showShipDetails(name){
    
    let item_detail = document.getElementsByClassName('item-detail')[0];
    item_detail.innerHTML = '';

    let starship = starships.filter(i => i.name == name);
    console.log('current starship: ', starship);
    
    let header_elem = document.createElement('h2');
    header_elem.innerHTML = starship[0].name;
    
    let unorderedList = document.createElement('ul');

    /* model property */
    let model = document.createElement('li');
    model.innerHTML = starship[0].model;
    unorderedList.appendChild(model);

    /* manufacturer property */
    let manufacturer = document.createElement('li');
    manufacturer.innerHTML = starship[0].manufacturer;
    unorderedList.appendChild(manufacturer);

    /* crew property */
    let crew = document.createElement('li');
    crew.innerHTML = starship[0].crew;
    unorderedList.appendChild(crew);

    /* passengers property */
    let passengers = document.createElement('li');
    passengers.innerHTML = starship[0].passengers;
    unorderedList.appendChild(passengers);

    /* append <h2> and <ul> to parent DOM */
    item_detail.appendChild(header_elem);
    item_detail.appendChild(unorderedList);

    /* if starship has `films` property retrieve them by calling followin function */
    if(starship[0].hasOwnProperty('films'))
        showFilmDetails(starship[0]);

    

}
/* this function creates `li` element and appends it to parent DOM foreach film inside starship.films array */
function showFilmDetails(starship){

    
    for (let film of starship.films) {
        console.log(film);

        fetch(film).then(response => response.json())
            .then(data => {
                console.log(data);

                let elem = document.createElement('li');
                elem.innerHTML = data.title;
                document.querySelector('div.item-detail ul').appendChild(elem);
            });
    }
}


/* This function has an important task. It selects and activates each page that user clicks on and more importantly it then fetches related data 
   by calling fetchStarships(pageNumber) function */
let pageNum;
function pagination(){
    /* at the first time page 1 is active. then contents of first ten starships should be fetched initially. */
    fetchStarships(1);

    let pages = document.querySelectorAll('div.pagination a');
    console.log(pages);

    for (let page of pages) {
        // console.log(page);
        let isNextOrPrev = false;
        page.addEventListener('click', function(e){
            e.preventDefault();
            
            if(page.id === 'next'){
                pageNum += 1;
                isNextOrPrev = true;
                fetchStarships(pageNum);
            }
            else if(page.id === 'prev' && pageNum > 1){
                pageNum -= 1;
                isNextOrPrev = true;
                fetchStarships(pageNum);
            }
            else{
                pageNum = Number(page.innerHTML);

                if(pageNum >= 1 && pageNum <= 5)
                    fetchStarships(pageNum);
            }
            
            /* Highlight clicked page as  `active`, else remove previously actived pages. */
            for (let p of pages) {
                if(p.innerHTML == pageNum){
                    p.className += 'active';
                    // break
                }
                else
                    p.classList.remove('active');
            }

            
        }.bind(this));
    }
}

pagination();

/* this function clears list of starships and available details of clicked starship */
function clearContent(){
    document.querySelector('div ul.starships').innerHTML = '';
    document.getElementsByClassName('item-detail')[0].innerHTML = '';

    /* If we encounter error in fetch process, then it should be cleared out from DOM after fetching correct data */
    if(errorDetected){
        document.getElementById('error').remove();
        errorDetected = false;
    }
}
