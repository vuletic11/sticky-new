# sticky-new
 
Sticky Notes Web Application

Abstract

Application should give users an ability to create and edit their own notes by introducing Login/Register function. Before creating any note, user must at least have one list created. After that user can create notes that belong to a certain list. This way lists are used as notes collections. Both notes and lists can be created, modified and deleted by the user. Important to mention is, when deleting a list, all the notes contained in the deleted list are also deleted. 
 Access to the application would be granted just to registered users. The Log In/Sign Up function, allows every user can have their own profile and unique workspace.


Frameworks and Technologies

For this project - Web Application,used technology is MEAN stack. MEAN stack is a JavaScript-based framework
for developing web applications. MEAN is named after MongoDB, Express, Angular, and Node, the four key
technologies that make up the layers of the stack.
Main advantages of using MEAN stack is flexibility which is expressed in using single programming language for both,
client and server side. Also it is a free and open-source JavaScript software.

The MongoDB represents the database I will use to store information about users, notes and lists.

Angular and Express.js are used as front-end and back-end frameworks, while Node is used as the execution engine.

For user authentication, we are using JWT token(JSON WebToken). JWT provides secure transfer of information over the web, between two sides, server and client. The information is sent as JSON object, digitally signed so it can be trusted and verified. For maintaining the session we are using access and refresh tokens.
