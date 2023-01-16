# sticky-new
 
Sticky Notes Web Application

Abstract

As the title says, I decided my project use case will be building a Sticky Notes Web Application. The main idea
revolves around giving users an ability to create and edit their own notes by introducing Login/Register function.
This way, every user can have their own profile and unique workspace. Access to the application would be granted
just to registered users. Since project is still in early development phase not all the possibilities are known and,
therefore, can’t be listed. Known functionalities are login and register, as well as creation, editing and deletion
of sticky notes. The possible functionality the users might have is sharing their notes with other registered users.
This would enable collaboration between users and possibly better organization. 


Frameworks and Technologies

For this project - Web Application, I decided to use the MEAN stack. MEAN stack is a JavaScript-based framework
for developing web applications. MEAN is named after MongoDB, Express, Angular, and Node, the four key
technologies that make up the layers of the stack.
Main advantages of using MEAN stack is flexibility which is expressed in using single programming language for both,
client and server side. Also it is a free and open-source JavaScript software. There are also some disadvantages, like
no specific JavaScript coding guidelines for usage in MEAN stack, so building this app might become challenging.
Other disadvantage, that is not so relevant for this project, regards the fact that MEAN stack is not meant for
large scale applications.
The MongoDB represents the database I will use to store information about users and notes. Angular and Express.js
are used as front-end and back-end frameworks, while Node is used as the execution engine.
The first functionality that is built is Login/Register. For user authentication, I used JWT token(JSON Web
Token). JWT provides secure transfer of information over the web, between two sides, server and client. The
information is sent as JSON object, digitally signed so it can be trusted and verified.
