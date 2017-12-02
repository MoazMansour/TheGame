# CSC 410 Semester Project

## Members

Willie Cohen  
Mounica Kota  
Moaz Mansour  
Sayudh Roy  
Aeshaan Wahlang  

## Running the project

You must first have nodejs, NPM, and MySQL installed on your system  

### Database Setup

This step is only necessary for the first run.  If you are using MySQL workbench, copy, paste, and run the query in `/SQL\ Files/create_tables.sql` followed by `/SQL\ Files/create_triggers.sql`.  Otherwise, you can use the command line as follows:

```
$ cd <project directory>
$ cd SQL\ Files
$ mysql -u root -p
// You will be promoted to enter a password, this is the password you created to use the MySQL server on you local machine
$ source create_tables.sql
$ source create_triggers.sql
$ source insert_objects.sql
```

### Starting the server

```
$ cd <project directory>  
$ npm install  
$ <node or nodejs> server.js   
$ goto localhost:8081
```
### Default Account

Username: strangers 
Password: password  

You are ready to go!
