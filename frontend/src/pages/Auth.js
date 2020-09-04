import React, { Component, useState} from "react";
import './Auth.css';

function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const submitHandler =(event) =>{
        event.preventDefault();
        if(email.trim().length === 0 || password.length ===0){
            return;
        }
        console.log('inside submit handler');
        const requestBody = {
            query:`
                mutation {
                    createUser(eventInput: {email: "${email}",password: "${password}"}){
                        _id
                        email
                    }
                }
            `
        };
        fetch('http://localhost:8000/graphql',{
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201){
                throw new Error('failed');
            }
            return res.json();
        })
        .then(resData =>{
            console.log(resData)
        }).catch(err => {
           console.log('error')
        })
    }
    return (
        <form className="auth-form" onSubmit={submitHandler}>
            <div className="form-control">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <div className="form-action">
                <button type="button">Switch to signup</button>
                <button type="submit">Submit</button>
            </div>
        </form>
    )
}


export default AuthPage;