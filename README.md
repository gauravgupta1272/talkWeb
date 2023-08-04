# talkWeb 

talkWeb is a Messaging Web Application that will connect you, your friends, and your family.   
It allows users to send and receive messages in *Real-Time* which is implemented using **Web-Sockets**
and also fetches the older messages from the **MongoDB** atlas NoSQL-based database.
When a new message comes in chat then there is autoScrolling in the chat Page.
It has an Online Indicator that shows who all are Online on talkWeb.
Not only text, but users can also send *Images, Videos, PDFs*, and other types of Files.
It has an Authentication System which uses **bcryptjs** for hashing, **JWT Token**, and **cookie** to generate and store the *authToken*.  
<sub> (Screenshots attached below)  </sub>     
## Technologies used
**Frontend**   
- [ReactJS](https://react.dev/) as the frontend framework  
- [Tailwind](https://tailwindcss.com/) CSS for styling 

**Backend**  
- [NodeJS](https://nodejs.org/) as the backend server
- [ExpresJS](https://expressjs.com/) as the backend framework
- [MongoDB](https://www.mongodb.com/) as the Database

 **Major Dependencies**  
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) used for hashing and authenticating user
- [cookie-parser](https://www.npmjs.com/package/cookie-parser) used for cookies storage to store authToken 
- [jsonwebtoken](https://jwt.io/) used for generating and verifying the token
- [mongoose](https://mongoosejs.com/) as Object Data Modeling Library
- [ws](https://www.npmjs.com/package/ws) as the WebSocket Library

  ## Screenshot

  ![talkweb](https://github.com/gauravgupta1272/talkWeb/assets/94973913/4ab3c7cf-8ff9-4e0e-b2ae-ac30d068e2e3)


  ![talkWebss](https://github.com/gauravgupta1272/talkWeb/assets/94973913/ddf72d31-abcb-4d78-9259-c542334a9bcb)


