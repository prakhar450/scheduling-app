# scheduling-app

The scheduling app allows Users to register themselves and create their free slots. Other users can then book these slots and set up a meeting.

## Try it out
https://scheduling-app-prakhar.herokuapp.com/register

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

The project uses NPM and MongoDB.
To install NPM
```bash
brew update
brew install node
```
To install Mongodb, please visit https://www.mongodb.com

### Installing

To set up the project in your local, first clone the repository.

```
git clone https://github.com/prakhar450/scheduling-app.git
```
In a separate terminal window, start an instance of mongod.

To start the app run the following commands in a terminal:
```
npm install
node app.js
```
Now the user has to register themselves and login to the web app.
A new user will get an option to create a new schedule. Schedule can only be created once and will hold all the slots of the user. 
The user will now have the option to add, view and delete their free slots. To book a slot of another user, click on 'Book Slot' and choose
another user and click on book to set up a meeting. The booked slot will be visible in both the user's account and the respective free slot will
be removed from their available slots.

## Deployment

The app has been deployed using Heroku cloud provider and MongoDB atlas for database cluster.
To deploy the app using Heroku CLI, run the below commands after logging into Heroku and setting up the db cluster.
```
heroku create
```
```
git push heroku master
```

