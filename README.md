# CSC 410 Semester Project

## Members

Willie Cohen  
Mounica Kota  
Moaz Mansour  
Sayudh Roy  
Aeshaan Wahlang  

## Running the project

You must first have nodejs and NPM installed on your system

```
$ cd <project directory>  
$ npm install  
$ <node or nodejs> server.js   
$ goto localhost:8081
```
You must also have MySQL server installed on your system

```
$ cd <project directory>/SQL\ Files
$ mysql -u root -p
// You will be promoted to enter a password, this is the password you created to use the MySQL server on you local machine
$ source create_tables.sql
$ source create_triggers.sql
```
You are ready to go!
