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

## Bugs
