// document.body.style.backgroundColor = "#FA0000";

// fetch('http://www.example.com/movies.json').then(response => {
//         if(!response.ok){
//             console.log('Network response wasnt ok.');
//         }
//         else
//             console.log('Was successful');
//     });

let results;
fetch('https://swapi.dev/api/starships/')
    .then(response => response.json())
        .then(data => {
            // console.log(data);
            // console.log(typeof(data.results));   
            results = data.results;
            console.log('results', results);
            showStarShips(data.results.slice(0, 11));

            // pagination();
        });

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

function showShipDetails(name){
    // console.log(results);
    let item_detail = document.getElementsByClassName('item-detail')[0];
    item_detail.innerHTML = '';

    let starship = results.filter(i => i.name == name);
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

    /* append <h2> and <ul> to root DOM */
    item_detail.appendChild(header_elem);
    item_detail.appendChild(unorderedList);

    
    if(starship[0].hasOwnProperty('films'))
        showFilmDetails(starship[0]);

    

}

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


/* Handle pagination */
document.getElementsByClassName('pagination')[0].addEventListener('click', function(event){
    
    console.log(event.target);
});


function pagination(){
    let pages = document.querySelectorAll('div.pagination a');
    console.log(pages);
    for (let page of pages) {
        // console.log(page);
        page.addEventListener('click', function(event){
            this.className += 'active';
            console.log(page);
        }.bind(this));
    }
}

pagination();





// starships = results.slice(0, 11);
// console.log(starships);