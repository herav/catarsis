'use client'
import "./SignUpForm.css"
import React from "react";
import { useState } from "react";

export function SignUpForm(){

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: ''
    });

    const updateFormState = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((previousState) => ({
            ...previousState,
            [name]: value
        }));
    };

    const submit = async(e: React.FormEvent)=>{
        e.preventDefault();
        const res = await fetch("http://localhost:4000/users",{
            method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(formState)
        });
        const data = await res.json();
        console.log(data);
    };

    return (
        <form className="form-container" action="" onSubmit={submit}>
            <div className="form-group">
                <label htmlFor="name">User Name</label>
                <input type="text" id="name" name="name" placeholder="User Name" value={formState.name} onChange={updateFormState} required/>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="email" value={formState.email} onChange={updateFormState} required/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={formState.password} onChange={updateFormState} required/>
            </div>
            <button className="form-btn" type="submit">Sign Up</button>
        </form>    
    )
};
