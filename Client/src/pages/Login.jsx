import React,{useState}from 'react';
import { useRegUserMutation, useLoginMutation } from '../services/authApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'
//import{useRegUserMutation} from '../services/authApi'

const initialState ={
  fullName:"",
  email:"",
  password:"",
}
export default function Login() {
   const navigate = useNavigate();
  const [state,setState] = useState('Sign Up');
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [RegUser] = useRegUserMutation();
  const [login] = useLoginMutation();


  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (state === 'Sign Up') {
        console.log(response)
        response = await RegUser({ name, email, password }).unwrap()
      } else {
        response = await login({ email, password }).unwrap()
      }

      if (response.success) {
        navigate('/');
        toast.success(response.message)
      } else {
        toast.error(response.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }


return (
  <div className=' flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from blue-200 to purple-400'>
    <img onClick = {()=>navigate('/')}src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
    
    <div className ='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
      <h2 className="text-3xl font-semibold text-whote text-center mb-3">{state === 'Sign Up' ? 'Create Account': 'Login to Your account!'}</h2>
      <p className='text-center text-sm mb-6'>
      {state === 'Sign Up' ? 'Create your account': 'Login to Your account!'}
      </p>

      <form onSubmit = {onSubmitHandler}>
        {state === 'Sign Up' && (
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.person_icon} alt="" />
          <input onChange={e=>setName(e.target.value)} value = {name}type='text' placeholder = "Full Name" required/>
        </div>
        )}
        
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.mail_icon} alt="" />
          <input onChange={e=>setEmail(e.target.value)} value = {email} type='email' placeholder = "Email id" required/>
        </div>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.lock_icon} alt="" />
          <input onChange={e=>setPassword(e.target.value)} value = {password} type='password' placeholder = "Password" required/>
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
        <span onClick={()=>setState('Sign Up')}className='text-blue-400 cursor-pointer underline '>Sign Up</span>
      </p>)}
     
    </div>

  </div>
)
}
