import React,{useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {toast} from 'react-toastify'
import { assets } from '../assets/assets'
import{useRegUserMutation} from '../services/authApi'

const initialState ={
  fullName:"",
  email:"",
  password:"",
}

export default function Login() {
    const navigate = useNavigate();
    const[formValue,setFormValue] = useState(initialState);
    const {email,password,name} = formValue;
    const [state,setState] = useState('Sign Up');
    const [RegUser,{data:regdata,isSuccess:isregSuccess,error:regError,isError:isregError}] = useRegUserMutation()
 
  
  const handleChange = (e)=>{
    setFormValue({...formValue,initialState:e.target.value})
  }

const handleLogin = async ()=>{
    if(email && password & fullname){
      await RegUser ({fullName,email,password})
      if(isregSuccess){
      getUserData()
      toast.success("user login success")
      navigate("/")}
    }else{
      toast.error("please fill all input field")
    }
  }
  useEffect(()=>{
    isregSuccess
  },[isregSuccess]);


    return (
      <div className=' flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from blue-200 to purple-400'>
        <img onClick = {()=>navigate('/')}src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
        
        <div className ='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
          <h2 className="text-3xl font-semibold text-whote text-center mb-3">{state === 'Sign Up' ? 'Create Account': 'Login to Your account!'}</h2>
          <p className='text-center text-sm mb-6'>
          {state === 'Sign Up' ? 'Create your account': 'Login to Your account!'}
          </p>
  
          <form onSubmit = {handleLogin}>
            {state === 'Sign Up' && (
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input onChange={handleChange} value = {initialState.formValue}type='name' placeholder = "Full Name" required/>
            </div>
            )}
            
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.mail_icon} alt="" />
              <input onChange={handleChange} value = {initialState.formValue} type='email' placeholder = "Email id" required/>
            </div>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.lock_icon} alt="" />
              <input onChange={handleChange} value = {initialState.formValue} type='password' placeholder = "Password" required/>
            </div>
            <p  onClick = {()=>navigate('/reset-password')}className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>
            <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
          </form>
          {state== 'Sign Up' ? (
             <p className='text-gray-400 text-center text-xs mt-4'>
             Already have an account?{' '}
             <span onClick={()=>setState('Login')} className='text-blue-400 cursor-pointer underline '>Login here</span>
           </p>)
           :( <p className='text-gray-400 text-center text-xs mt-4'>
            Don't have an account?{' '}
            <span onClick={()=>handleLogin('Sign Up')}className='text-blue-400 cursor-pointer underline '>Sign Up</span>
          </p>)}
         
        </div>
  
      </div>
    )
  }
