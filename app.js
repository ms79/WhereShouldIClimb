/* 
TODO:

1. Add embedded google maps feature with pins showing climbs
2. Links to google map routes


*/

const proxy = 'https://cors-anywhere.herokuapp.com/'

var api_key_google = config.google_key;
var api_key_mp = config.mp_key;
var api_key_ds = config.ds_key;

const min_climb_temp = 50;
const max_climb_temp = 80;

var routes;
var data;

var long = -118.3997;
var lat = 37.3614;

function createElem(elem){
    return document.createElement(elem);
}

function addToElem(elem, child){
    return elem.appendChild(child);
}

function setReport(data){
    const loc = document.getElementById("loc")
    loc.textContent = "Your current location is " + data.timezone;
    const weather = document.getElementById("weather")
    weather.textContent = "and the weather is "+data.currently.summary+" with a temperature of "+data.currently.apparentTemperature+"°F";
    const cond = document.getElementById("conditions");
    if(data.currently.temperature > 80){
        cond.textContent = "A bit too hot to climb!";
    }
    else if(data.currently.temperature < 40){
        cond.textContent = "A bit too cold for climbing!";
    }
    else if(data.currently.precipIntensity != 0){
        cond.textContent = "Conditions are not ideal!";
    }
    else{
        cond.textContent = "Perfect conditions for climbing!";
    }

    
}

function createLeftDiv(routes){

    let leftDiv = createElem('div');
    let imgUrl = createElem('a');
    let img = createElem('img');

    leftDiv.className = "leftDiv";
    img.className = "routeImg";
    img.src = routes[i].imgSmall;
    imgUrl.href = routes[i].url;

    addToElem(imgUrl,img);
    addToElem(leftDiv,imgUrl);

    return leftDiv;
}

function createRightDiv(routes){

    let rightDiv = createElem('div');
    let textUrl = createElem('a');
    
    rightDiv.className = "rightDiv";
    textUrl.href = routes[i].url;
    textUrl.textContent = routes[i].name + ', ' + routes[i].rating;


    addToElem(rightDiv,textUrl);

    let ul = createElem('ul');
    let type = createElem('li');
    let pitches = createElem('li')
    let loc = createElem('li');
    
    type.textContent = routes[i].type;
    pitches.textContent = 'Number of pitches: ' + routes[i].pitches;
    loc.textContent = routes[i].location.join(", ");


    addToElem(ul, type);
    addToElem(ul, loc);
    addToElem(ul,pitches);
    addToElem(rightDiv, ul);

    return rightDiv;
}
function fillInfo(routes){

    //create wrapper element
    let div = createElem('div');
    div.className = "routeBox";

    //create left and right side divs

    let leftDiv = createLeftDiv(routes);
    let rightDiv = createRightDiv(routes);
    //important that rightDiv gets added after leftDiv, otherwise elements are in wrong order
    addToElem(div, leftDiv);
    addToElem(div, rightDiv);

   return div;
}

function loadRoutes(routes, maxDist=30, numRoutes=10){
    document.getElementById("display_message").textContent = "Here are some routes near you!";
    const routeSection = document.getElementById("routes");

    while(routeSection.firstChild){
        routeSection.removeChild(routeSection.firstChild);
    }

    if(numRoutes > 10){
        numRoutes = 10;
    }
    for(i=0; i<numRoutes;i++){

        let div = fillInfo(routes);
        routeSection.appendChild(div); 
    }
}

function filterRoutes(routes, form=""){
    const arr = [];
    for(i=0; i<routes.length;i++){
        if(routes[i].type.includes(form)){
            arr.push(routes[i]);
        }
    }
    loadRoutes(arr, 30, arr.length);
    return arr;
}

function loadSportRoutes(){
    filterRoutes(routes, "Sport");    
}
function loadBoulderRoutes(){
    filterRoutes(routes, "Boulder");    
}
function loadTradRoutes(){
    filterRoutes(routes, "Trad");    
}
function loadAllRoutes(){
    loadRoutes(routes);    
}


window.addEventListener('load', () => {

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            
            
            const ds_url = proxy+'https://api.darksky.net/forecast/'+api_key_ds+'/'+lat+','+long;
            fetch(ds_url)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    console.log(data);
                    setReport(data);

                });


            const mp_url = 'https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=37.3614&lon=-118.3997&maxDistance=50&key=200589584-e4fd61426dcd70c23a0de88884c411aa';

            fetch(mp_url)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    routes = data.routes;
                });

        });

    }else{
        alert("No location found, please enable geotagging");

    }
});
function initMap() {
    var options = {
        zoom:10,
        center: {lat, long}
    }

    var map = new google.maps.Map(document.getElementById("map"), options);
}
