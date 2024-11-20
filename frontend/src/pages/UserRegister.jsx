import React, { useState } from 'react';
import styles from "../styles/UserRegisterStyles.module.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export const UserRegister = () => {
     const navigate = useNavigate();
     const [createAccount, setCreateAccount] = useState(false);

     const [formData, setFormData] = useState({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
     });


     const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value })
     }


     const handleLoginClick = () => {
          navigate('/userlogin');
     };

     const handleClose = () => {
          navigate('/');

     }


     const handleSubmit = async (e) => {
          e.preventDefault();
          if (formData.password !== formData.confirmPassword) {
               toast.error("Password and Confirm Password does not matched.")
               return;
          }

          setCreateAccount(true);
          try {
               const { confirmPassword, ...dataToSend } = formData; // Exclude confirmPassword to send in backend.
               const response = await axios.post("http://localhost:5000/api/v1/userregister", dataToSend, { withCredentials: true });
               toast.success(response.data.message);
               navigate("/");

          } catch (error) {
               if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
               } else {
                    toast.error("An error occurred");
               }
          } finally {
               setCreateAccount(false);
          }

     }
     return (
          <div className={styles.loginContainer}>
               <form onSubmit={handleSubmit}>
                    <h1>Register</h1>
                    <input
                         type='text'
                         name='name'
                         id='name'
                         placeholder='Username'
                         value={formData.userName}
                         onChange={handleChange}
                         required
                    />
                    <input
                         type='email'
                         name='email'
                         id='email'
                         placeholder='Email'
                         value={formData.userEmail}
                         onChange={handleChange}
                         required
                    />
                    <input
                         type='password'
                         name='password'
                         id='password'
                         placeholder='Password'
                         value={formData.password}
                         onChange={handleChange}
                         required
                    />
                    <input
                         type='password'
                         name='confirmPassword'
                         id='confirmPassword'
                         placeholder='Confirm Password'
                         value={formData.confirmPassword}
                         onChange={handleChange}
                         required
                    />
                    <button className={styles.signUp} type='submit'>{createAccount ? "Registering..." : "Sign Up"}</button>
                    <p>Already have an account, <button className={styles.logInBtn} onClick={handleLoginClick}>Log In</button></p>
                    <p className={styles.close} onClick={handleClose}>Close</p>
               </form>
          </div>
     )
}

