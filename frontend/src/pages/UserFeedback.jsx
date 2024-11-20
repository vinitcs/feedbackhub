import React, { useState } from 'react';
import styles from "../styles/UserFeedbackStyles.module.css"
import { useNavigate } from 'react-router-dom';

export const UserFeedback = () => {
     const navigate = useNavigate();

     const [formData, setFormData] = useState({
          userName: "",
          userEmail: "",
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


     const handleSubmit = (e) => {
          e.preventDefault();

          // console.log(formData);

     }
     return (
          <div className={styles.loginContainer}>
               <form onSubmit={handleSubmit}>
                    <h1>Feedback</h1>
                    <section className={styles.optionBtns}>
                         <button autoFocus={true}>Add Feedback</button>
                         <button>Edit Feedback</button>
                    </section>


                    <label htmlFor="feedback">Your Feedback</label>
                    <textarea
                         name="feedback"
                         id="feedback"
                         placeholder="Write your feedback here..."
                         // value={formData.feedback} 
                         // onChange={handleChange} 
                         required
                         rows="10" 
                         className={styles.textarea} 
                    ></textarea>



                    <button className={styles.submitBtn} type='submit'>Submit</button>
               </form>
          </div>
     )
}

