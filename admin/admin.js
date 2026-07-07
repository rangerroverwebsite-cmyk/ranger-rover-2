import { auth } from "../js/firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";


const loginBtn = document.getElementById("loginBtn");

const email = document.getElementById("email");

const password = document.getElementById("password");

const error = document.getElementById("error");


loginBtn.addEventListener("click", async () => {

    error.textContent = "";

    try{

        await signInWithEmailAndPassword(

            auth,

            email.value,

            password.value

        );

        window.location.href="dashboard.html";

    }

    catch(err){

        error.textContent="Invalid Email or Password.";

        console.log(err);

    }

});