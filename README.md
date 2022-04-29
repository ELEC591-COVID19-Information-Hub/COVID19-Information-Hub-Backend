# COMP 590 / ELEC 591 Covid-19 Information HUB Backend

## Build
To run this project:
```shell
npm install
node index.js
```

To deploy this project to heroku:
```shell
heroku create <you-project-name>
heroku addons:create heroku-redis:hobby-dev -a <you-project-name>
heroku config:set MONGODB_URI="<your mongodb uri here>"

git push heroku
```

## Deployment
This project is deployed to heroku at https://elec591-coivd19-info-hub.herokuapp.com/.

