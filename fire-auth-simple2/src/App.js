import React, { useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import './App.css';

firebase.initializeApp(firebaseConfig);//firebase.config.js thke call kora hyece

const App = () => {

  const [user,setUser] = useState({
    isSignedIn: false,
    name: '',
    photo: '',
    email: '',
    password: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
     
    .then(result => {
      const {displayName, photoURL,email} = result.user;
      const signedInUser = {
        isSignedIn: true,
        name:displayName,
        photo: photoURL,
        email: email
      }
      setUser(signedInUser);
      console.log(displayName, photoURL, email);
      const token = result.credential.accessToken;
    })

    .catch(err =>{ 
      console.log(err)
      const errorMessage = err.message;
      console.log(errorMessage)
      const errorCode = err.code;
    })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res =>{
        const signedOutUser ={
         isSignedIn: false,
         name: '',
         photo: '',
         email: ''
       }
      setUser(signedOutUser)
    })

    .catch(err =>{
       console.log(err);
    })
  }

  const handleBlur = (e) => {
    //event ta jkhn thke trigger hyece seta hcce event.r j element thke trigger hcce seta hcce se element hcce target
    let isFieldValid = true;
    if(e.target.name === 'email'){
       isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);//isEmailValid true or false return krbe..
    }

    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 6;
      const isPasswordHasNumber =  /\d{1}/.test(e.target.value); 
      isFieldValid = isPasswordValid && isPasswordHasNumber;
    }
     //jhtu amra dhre nici by default form ta valid.tai name ta o show kore onBlur krle
    if(isFieldValid) {
      const newUserInfo = {...user}//user r info copy kora..second bracket cz obj duitai
      newUserInfo[e.target.name] = e.target.value;//password / email r updated value assign kore dewa obj ee
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (e) => {
    if(user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        // Signed in 
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });

    }
    e.preventDefault();
  }

  return (
    
    <div className='form'>
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button>
        : <button onClick={handleSignIn}>Sign In</button>
      } 

      {
        user.isSignedIn && <div> 
          <p>Welcome!! {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
          </div>
      }

     <form action={handleSubmit}>
     <h1>Our Own Authentication</h1>
     <h2>Name:{user.name}</h2>
     <h2>Email:{user.email}</h2>
     <h3>Password:{user.password}</h3>
     <input type="text" name='name' onBlur={handleBlur}  placeholder="Your Name"/>
     <br/>
     <input type="text" name='email' onBlur={handleBlur} placeholder="Your Email Address" required/>
     <br/>
     <input type="password" name='password' onBlur={handleBlur} id="" placeholder="Password" required/>
     <br/>
     <input type="submit" value="Submit"/>
     </form>
    </div>
  );
};

export default App;
//input submit use korle se puro form r shob info niye tarpor form ta k submit korbe...kntu buttob submit ta korbe na form r sthe button submit r kno jogsajosh nai
//ekhn handleblur function e amra j field ta k update kortesi seta useState e giye notun kore object property te update korte hbe...tai amra object ta k copy korlam
//trpor value update korlam 'name' hisebe.name ta email o ht e pare abr pass o hte pare..depend korbe amra kn field ta 
//change kore blur krteci