import { useState } from 'react';


import './sign-in-form.styles.scss';

import FormInput from '../form-input/form-input.component';
import Button from "../button/button.component";

import { signInWithGooglePopup,signInAuthUserWithEmailAndPassword } from '../../utils/firebase/firebase.utils';

const defaultFormFields = {
    email : '',
    password: '',
}

const SignInForm = () =>{

    const [formFields,setFormFields] = useState(defaultFormFields);
    const {email, password} = formFields;


    const resetFormFields = () =>{
        setFormFields(defaultFormFields);
    }

    const signInWithGoogle = async ()=>{
        await signInWithGooglePopup();
    }


    const handleSubmit = async (e)=>{
        e.preventDefault();

        try{
            await signInAuthUserWithEmailAndPassword(email,password);
            resetFormFields()
        }catch(error){
            switch(error.code){
                case 'auth/wrong-password':
                    alert("Incorrect Password")
                break;

                case 'auth/user-not-found':
                    alert("User not Found!")
                break;
                
                default:console.log(error)
            }
        }
    }

    const handleChanges = (e) =>{
        const {name,value} = e.target;
        setFormFields({...formFields,[name]:value});
    }


    return(
        <div className="sign-in-container">
            <h2>Already have an account?</h2>
            <span>Sign in with your email and password</span>
            <form onSubmit={handleSubmit}>

                <FormInput label="Email" type="email" required onChange={handleChanges} name="email" value={email}/>

                <FormInput label="Password" type="password" required onChange={handleChanges} name="password" value={password}/>

                <div className="buttons-container">
                    <Button type="submit">Sign In</Button>

                    <Button type="button" buttonType='google' onClick={signInWithGoogle}>Sign In Google</Button>
                </div>

            </form>
        </div>
    )
}

export default SignInForm;