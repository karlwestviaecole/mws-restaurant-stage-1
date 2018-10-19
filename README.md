# Restaurant Reveiw App

## About

This project was developed as a submission for the Front-End Web Developer Nanodegree Program at [Udacity](https://udacity.com). This project is not maintained.

## Dependencies

* [normalize.css](https://github.com/necolas/normalize.css)
* [Leaflet](https://github.com/Leaflet/Leaflet)
* [Serve](https://github.com/zeit/serve)

## Run the app

Install the serve npm globally:
```
npm install -g serve
```

Start serve from the root folder of this project:
```
serve
```

With your browser, navigate to:
```
http://localhost:5000/
```

The app uses a service worker to cache all it's assets. So when you've navigated to the app, you can stop the server and still use the app.


## How the app works

The start page shows a map with markers for some restaurants in New York. You can click on a marker to navigate to the details page for that restaurant.

Below the map is a grid with some information cards for each restaurant. Use the dropdown controls to filter the cards in the grid. Each card has a link that will take you the the details page for that restaurant.

On the details page, you'll see that restaurant on a map. There is information about the restaurant and a list of reviews.

## Contributing

Since this repository basically is a submission to an online course, pull requests will likely not be merged into the project.