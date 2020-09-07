import React, { Component, useState, useContext} from "react";
import './Auth.css';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import Backdrop from '../components/Backdrop/Backdrop';

function AuthPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIslogin] = useState(true);
    const context = useContext(AuthContext);


    const loginHandler =() =>{
        setIslogin(!isLogin);
    }
    const submitHandler =(event) =>{
        event.preventDefault();
        setIsLoading(true)
        if(email.trim().length === 0 || password.length ===0){
            return;
        }
        console.log('inside submit handler');
        let requestBody = {
            query:`
                query {
                    login(email: "${email}", password: "${password}"){
                        userId
                        token
                        tokenExpiration
                    }

                }
            `
        }
        
        if(!isLogin){
            requestBody = {
                query:`
                    mutation {
                        createUser(eventInput: {email: "${email}",password: "${password}"}){
                            _id
                            email
                        }
                    }
                `
            };
        }
 
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
            console.log(resData);
            if(resData.data.login.token){
                context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration)
            }
            setIsLoading(false);
        }).catch(err => {
           console.log('error');
           setIsLoading(false);
        })
    }
    return (<>
        {isLoading ?<Backdrop><Spinner /></Backdrop>: 
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
                <button type="button" onClick={(e)=>loginHandler()}>Switch to {isLogin? 'Signup': 'Login'}</button>
                <button type="submit">Submit</button>
            </div>
        </form>}
        </>
    )
}


export default AuthPage;