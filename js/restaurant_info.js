/* ==========================================================================
   Context
   ========================================================================== */

let context = {
    restaurant: null,
    newMap: null
};


/* ==========================================================================
   Init
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    initMap();
});


/* ==========================================================================
   initMap
   ========================================================================== */

const initMap = function () {
    fetchRestaurantFromURL((error, restaurant) => {
        if (error) {
            return console.error(error);
        }
        context.newMap = L.map('map', {
            center: [restaurant.latlng.lat, restaurant.latlng.lng],
            zoom: 16,
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
        fillBreadcrumb();
        DBHelper.mapMarkerForRestaurant(restaurant, context.newMap);
    });
};


/* ==========================================================================
   fetchRestaurantFromURL
   ========================================================================== */

const fetchRestaurantFromURL = function (callback) {
    if (context.restaurant) {
        callback(null, context.restaurant)
        return;
    }
    const id = getParameterByName('id');
    if (!id) {
        error = 'No restaurant id in URL'
        callback(error, null);
    } else {
        DBHelper.fetchRestaurantById(id, (error, restaurant) => {
            if (!restaurant) {
                return console.error(error);
            }
            context.restaurant = restaurant;
            fillRestaurantHTML();
            callback(null, restaurant)
        });
    }
};


/* ==========================================================================
   fillRestaurantHTML
   ========================================================================== */

const fillRestaurantHTML = function () {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = context.restaurant.name;

    const address = document.getElementById('restaurant-address');
    address.innerHTML = context.restaurant.address;

    const image = document.getElementById('restaurant-img');
    image.src = DBHelper.imageUrlForRestaurant(context.restaurant);
    image.alt = 'Restaurant ' + context.restaurant.name;

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = context.restaurant.cuisine_type;

    if (context.restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }
    fillReviewsHTML();
};


/* ==========================================================================
   fillRestaurantHoursHTML
   ========================================================================== */

const fillRestaurantHoursHTML = function () {
    const hours = document.getElementById('restaurant-hours');
    for (let key in context.restaurant.operating_hours) {
        const row = document.createElement('tr');

        const day = document.createElement('td');
        day.innerHTML = key;
        row.appendChild(day);

        const time = document.createElement('td');
        time.innerHTML = context.restaurant.operating_hours[key];
        row.appendChild(time);

        hours.appendChild(row);
    }
};


/* ==========================================================================
   fillReviewsHTML
   ========================================================================== */

const fillReviewsHTML = function () {
    const container = document.getElementById('reviews-container');

    if (!context.restaurant.reviews) {
        const noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    }

    const ul = document.getElementById('reviews-list');
    context.restaurant.reviews.forEach(review => {
        ul.appendChild(createReviewHTML(review));
    });
    container.appendChild(ul);
};


/* ==========================================================================
   createReviewHTML
   ========================================================================== */

const createReviewHTML = function (review) {
    const li = document.createElement('li');
    li.className = 'reviews__item';

    const article = document.createElement('article');
    article.setAttribute('aria-label', 'Review');
    li.append(article);

    const header = document.createElement('div');
    header.className = 'reviews__item-header';
    article.appendChild(header);

    const name = document.createElement('p');
    name.className = 'reviews__item-name';
    name.setAttribute('aria-label', 'Author');
    name.innerHTML = review.name;
    header.appendChild(name);

    const date = document.createElement('p');
    date.className = 'reviews__item-date';
    date.setAttribute('aria-label', 'Date');
    date.innerHTML = review.date;
    header.appendChild(date);

    const body = document.createElement('div');
    body.className = 'reviews__item-body';
    article.appendChild(body);

    const rating = document.createElement('p');
    rating.className = 'reviews__item-rating';
    rating.setAttribute('aria-label', 'Rating');
    rating.innerHTML = `Rating: ${review.rating}`;
    body.appendChild(rating);

    const comments = document.createElement('p');
    comments.className = 'reviews__item-comments';
    comments.setAttribute('aria-label', 'Comments');
    comments.innerHTML = review.comments;
    body.appendChild(comments);

    return li;
};


/* ==========================================================================
   fillBreadcrumb
   ========================================================================== */

const fillBreadcrumb = function () {
    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');
    li.innerHTML = context.restaurant.name;
    breadcrumb.appendChild(li);
};


/* ==========================================================================
   getParameterByName
   ========================================================================== */

const getParameterByName = function (name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};