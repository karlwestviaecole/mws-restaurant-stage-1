/* ==========================================================================
   Context
   ========================================================================== */

let context = {
    restaurants: null,
    neighborhoods: null,
    cuisines: null,
    newMap: null,
    markers: []
};


/* ==========================================================================
   Init
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    initMap();
    fetchNeighborhoods();
    fetchCuisines();
});


/* ==========================================================================
   initMap
   ========================================================================== */

const initMap = function () {
    context.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
    });
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1Ijoia2FybC13ZXN0IiwiYSI6ImNqbmJvbGE1czFyNHkzcnJmaHYxb2RpNGoifQ.t9UADrHxaq7tpIT0IXtEqQ',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(context.newMap);

    updateRestaurants();
};


/* ==========================================================================
   updateRestaurants
   ========================================================================== */

const updateRestaurants = function () {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
        if (error) {
            return console.error(error);
        }
        resetRestaurants(restaurants);
        fillRestaurantsHTML();
    });
};


/* ==========================================================================
   resetRestaurants
   ========================================================================== */

const resetRestaurants = function (restaurants) {
    context.restaurants = [];
    context.markers = [];
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';
    context.restaurants = restaurants;
};


/* ==========================================================================
   fetchNeighborhoods
   ========================================================================== */

const fetchNeighborhoods = function () {
    DBHelper.fetchNeighborhoods((error, neighborhoods) => {
        if (error) {
            return console.error(error);
        }
        context.neighborhoods = neighborhoods;
        fillNeighborhoodsHTML();
    });
};


/* ==========================================================================
   fillNeighborhoodsHTML
   ========================================================================== */

const fillNeighborhoodsHTML = function () {
    const select = document.getElementById('neighborhoods-select');
    context.neighborhoods.forEach(neighborhood => {
        const option = document.createElement('option');
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        select.append(option);
    });
};


/* ==========================================================================
   fetchCuisines
   ========================================================================== */

const fetchCuisines = function () {
    DBHelper.fetchCuisines((error, cuisines) => {
        if (error) {
            return console.error(error);
        }
        context.cuisines = cuisines;
        fillCuisinesHTML();
    });
};


/* ==========================================================================
   fillCuisinesHTML
   ========================================================================== */

const fillCuisinesHTML = function () {
    const select = document.getElementById('cuisines-select');

    context.cuisines.forEach(cuisine => {
        const option = document.createElement('option');
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.append(option);
    });
};


/* ==========================================================================
   fillRestaurantsHTML
   ========================================================================== */

const fillRestaurantsHTML = function () {
    const ul = document.getElementById('restaurants-list');
    let tabIndex = maxTabIndex();
    context.restaurants.forEach(restaurant => {
        ul.append(createRestaurantHTML(restaurant, tabIndex++));
    });
    addMarkersToMap();
};


/* ==========================================================================
   createRestaurantHTML
   ========================================================================== */

const createRestaurantHTML = function (restaurant, tabIndex) {
    const li = document.createElement('li');
    li.className = 'restaurant-card';

    const article = document.createElement('article');
    article.setAttribute('aria-label', 'Restaurant');
    li.append(article);

    const image = document.createElement('img');
    image.className = 'restaurant-card__image';
    image.alt = 'Restaurant ' + restaurant.name;
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    article.append(image);

    const name = document.createElement('h3');
    name.innerHTML = restaurant.name;
    name.className = 'restaurant-card__name';
    article.append(name);

    const neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    neighborhood.className = 'restaurant-card__paragraph';
    neighborhood.setAttribute('aria-label', 'Neighborhood');
    article.append(neighborhood);

    const address = document.createElement('p');
    address.innerHTML = restaurant.address;
    address.className = 'restaurant-card__paragraph';
    address.setAttribute('aria-label', 'Address');
    article.append(address);

    const more = document.createElement('a');
    more.innerHTML = 'View Details';
    more.href = DBHelper.urlForRestaurant(restaurant);
    more.className = 'restaurant-card__more-link';
    more.tabIndex = tabIndex;
    article.append(more)

    return li;
};


/* ==========================================================================
   addMarkersToMap
   ========================================================================== */

const addMarkersToMap = function () {
    context.restaurants.forEach(restaurant => {
        const marker = DBHelper.mapMarkerForRestaurant(restaurant, context.newMap);
        marker.on("click", onClick);
        function onClick() {
            window.location.href = marker.options.url;
        }
        context.markers.push(marker);
    });
};


/* ==========================================================================
   maxTabIndex
   ========================================================================== */

const maxTabIndex = function () {
    let max = 0;
    const elementsWithTabIndex = document.querySelectorAll('[tabindex]');
    elementsWithTabIndex.forEach(element => {
        let tabIndexValue = parseInt(element.getAttribute('tabindex'));
        if (tabIndexValue > max) max = tabIndexValue;
    });
    return max;
};