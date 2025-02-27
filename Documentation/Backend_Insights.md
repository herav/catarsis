# CATARSIS BACKEND DEVELOPMENT

This document describes technical insights and decision making about the **backend development process**.

By the time I created this document, I had already spent a month working on this project. Right now, I'm working on the users endpoint and I feel the need to write down everything I have learned.

Just to be clear, I started learning backend development with Node.js version 15 back in 2015, but I stopped when I got accepted into college in 2016 as my time was consumed by college homework. Looking back, I wish I had kept learning.

I got back into Node.js in November 2024. I started watching YouTube videos on everything I could use to build this project, such as TypeScript, modern Node.js (version 18 and above), unit testing with Jest, validations with Zod and SQL databases with PostgreSQL, among other topics.

I've spent a lot of time mastering the basics, but I know that big things have small beginnings.

## Unit Testing
I'm using Jest for unit testing. 
I really tried to configure the the jest.config file as a ts file but it was a nightmare so I decided to follow the easy path and configure it as js file. I don't like it, but it works correctly.

I was getting an undesired behavior with the mocks resolved values, there was an interference in two different tests and the whole thing got fix when I discovered that I can use mockResolvedValueOnce for setting the resolved value just once.

**24/February2025**

TDD is about creativity, because it is needed to consider every possible failure scenario.
My guideline to prepare a test case:
1. I use the question **What if...?** when an scenario pops up to my mind and then I write down as test.todo 
2. I use **Should do ... when ...** to rephrase the unit test description once is already coded and tested. 

**25/Febreuary/2025**
Thanks to TDD I was able to realize that it is necessary to start validating and testing the very first layer of the code according a previous design arquitecture. For the user endpoint I basically have 4 main layers: PostgreSQL, executeQuery Function, UserModel, UserController.
During the first iteration of unit testing I only ensured that each layer handled basic exceptions, but it was until I observed the interaction between each layer that I realized that many use cases were not being considered. This mistake caused the need to refactor the code many times.



## Errors Handling
**23/February/2025**
Apparently the message errors are generated directly from the PostgreSQL server, except for the DB_PORT error which I customized.
The right thing would be identify the specific error and then customize the message accordingly.
For now, I'm gonna wait to observe the deploy behavior, so I'm not touching this.


|Cause|Current Message|Corrected Message
|-----|---------------|----------------
|Wrong DB_PORT at .env|CustomError [DataBaseConnectionError]|CustomError [DataBaseConnectionError]: Unable to establish a connection on DB_PORT ${DB_PORT} 
|Wrong DB_HOST at .env|CustomError [DataBaseConnectionError]: getaddrinfo ENOTFOUND localhostX
|Wrong DB_USER at .env|CustomError [DataBaseConnectionError]: la autentificaci�n password fall� para el usuario �postgresX�
|Wrong DB_PASSWORD at .env|CustomError [DataBaseConnectionError]: la autentificaci�n password fall� para el usuario �postgres�
|Wrong DB_DATABASE at .env|CustomError [DataBaseConnectionError]: no existe la base de datos �catarsisX�

## Users Model
I'm using the package PG to handle PostgreSQL. 
A QueryResult is an PG's object that represents the result of a query.
Users data flow:
PostgreSQL => executeQuery returns a QueryResul object => UsersModel takes the relevant information to create a User object => UsersController reponds 

**27/February/2025
The way I implemented the controller and model was wrong because I did not consider many things.
Now I can see the right steps:
1. Consider the data structure retrieved from the database.
2. Validate the data retrieved from the DB.
3. Create/Parse the data structure you need. From QueryResult Object to User Object. 
4. Establish the contract between layers. The Controller must handle Users objects, the model must handle QueryResult objects.

#### USERS CRUD
**Get Users()** the controller receives an array of Users or null from the model 
**Get User()** the controller receives an Users object or null from the model 
**Create User()** the controller receives an User object created or null from the model 
**Update User()** the controller receives an User object updated or null from the model
**Delete User()** the controller receives an true or false from the model

At this point I'm only managing this data from Users:
1. Id
2. Name
3. Email
4. Password

Eventually the data will grow