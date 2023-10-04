/* 
Author Alex Younkers
10/3/2023
This is the log in form component of the login/signup page
*/

"use client"
import React from 'react';
import  { useState } from 'react';
import User from '../User';


export default function LogInForm() {

    const [accData, setAccData] = useState({
        email: '',
        password: '',
    });

    // data from database (fetched password to compare) shown here
    const dbData = {
        dbEmail: '',
        dbPassword: '',
    };

    const checkEmail = (email) => {

        /* regex for email validation cited from w3resource.com form validation page */
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!regex.test(email)) {
            setError("Please use a valid email!");
            return false;
        }

        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        /* 
        Things to do when submission received:
        1. check if all fields are valid
        2. if invalid, display errors and cancel submit
        3. query db for the email, and if it exists then the corresponding password
        4. grab the correct user object from the db
        5. clear all fields, navigate to home page 
        */

        if (!checkEmail(accData.email)) {
            return;
        }


        //TODO Database Query

        // if database query returns null, no email found
        if (!dbData.dbEmail) {
            setError("No account with this email exists!");
            return;
        }
        // if passwords dont match, dont let user through
        if (accData.password !== dbData.dbPassword) {
            setError("Incorrect Password!");
            return;
        }


    }

    const handleInput = (e) => {
        const { name, value } = e.target;

        /* updates an input field, and tracks if all inputs are non-null */
        setAccData((prev) => {
            const newData = { ...prev, [name]: value };
            setReadyToSubmit(newData.email && newData.password);
            return newData;
        });
    }

    const [error, setError] = useState('');

    const [readyToSubmit, setReadyToSubmit] = useState(false);


    return (

        <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow-lg shadow-black max-w-lg w-full mx-auto">
            
            <div className="mb-2.5">
                <label for="email" className='block mb-1.5 text-gray-800 text-left'>Email:</label>
                <input            
                    type="email"
                    id="email"
                    name="email"
                    value={accData.email}
                    onChange={handleInput}
                    className="w-full bg-gray-100 rounded p-2 border border-gray-300 focus:outline-blue-500"
                    required 
                />
            </div>

            <div className="mb-2.5">
                <label for="password" className='block text-gray-800 text-left'>Password:</label>
                <input            
                    type="password"
                    id="password"
                    name="password"
                    value={accData.password}
                    onChange={handleInput}
                    className="w-full bg-gray-100 rounded p-2 border border-gray-300 focus:outline-blue-500"
                    required 
                />
            </div>

            <div className="mb-6 mt-8">
                {error && <div className="text-red-500 mb-4">{error}</div>}
            </div>

            <button 
            disabled={!readyToSubmit}
            className={`block mx-auto mt-18 py-2 px-5 rounded hover:bg-blue-700 hover:text-white
            ${readyToSubmit ? 
                'bg-green-500 text-white' : 
                'bg-gray-200 text-black cursor-not-allowed' 
            }`} type="submit">
            Sign In
            </button>

        </form>


    );


}