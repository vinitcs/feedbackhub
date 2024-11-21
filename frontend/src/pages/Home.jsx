import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/HomeStyles.module.css";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Bounce, toast } from "react-toastify";
import { logout } from '../redux/features/userSlice';

export const Home = () => {
     const navigate = useNavigate();
     const dispatch = useDispatch();
     const isLoggedIn = useSelector((state) => state.userAuth.isLoggedIn);
     const userData = useSelector((state) => state.userAuth.user);


     const [toastId, setToastId] = useState(null);

     const [feedbackData, setFeedbackData] = useState({
          feedback: "",
     });

     useEffect(() => {
          const fetchData = async () => {
               try {

                    if (isLoggedIn) {
                         await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/loggeduser`, { withCredentials: true }).then((response) => {
                              setFeedbackData({ feedback: response.data.data.user.feedback })
                         })
                    }
               } catch (error) {
                    if (error.response && error.response.data && error.response.data.message) {
                         toast.error(error.response.data.message || "An error occurred");
                    } else {
                         toast.error("An error occurred");
                    }
               }
          }
          fetchData()
     }, [isLoggedIn]);


     const handleLoginClick = () => {
          navigate('/userlogin');
     };

     const handleLogoutClick = async () => {
          try {
               const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/userlogout`, {}, { withCredentials: true })
               dispatch(logout());
               toast.success(response.data.message);
               navigate('/');

          } catch (error) {
               toast.error("Logout failed");
          }
     }


     const handleDeleteConfirmation = (id) => {
          const idToast = toast.info(
               <div>
                    <p style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>Are you sure to delete your account?</p>
                    <button style={{
                         border: "none",
                         padding: "0.2rem 1rem",
                         fontSize: "1.2rem",
                         borderRadius: "0.6rem",
                         cursor: "pointer",
                         marginRight: "1rem"

                    }}
                         onClick={() => {
                              toast.dismiss(idToast);
                              confirmDelete(id)
                         }
                         }
                    >Yes</button>
                    <button style={{
                         border: "none",
                         padding: "0.2rem 1rem",
                         fontSize: "1.2rem",
                         borderRadius: "0.6rem",
                         cursor: "pointer",

                    }}
                         onClick={() => toast.dismiss(idToast)}>No</button>
               </div >,
               {
                    position: "top-center",
                    autoClose: "5000",
                    closeOnClick: false,
                    draggable: false,
                    closeButton: false,
                    transition: Bounce,
                    style: { width: "150%" }
                    // className: styles.confirmationToast
               }
          );
          setToastId(idToast);
     }


     const confirmDelete = (id) => {
          toast.dismiss();
          deleteUserAccount(id);
     };


     const deleteUserAccount = async (id) => {
          try {
               const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/userdelete/${id}`, { withCredentials: true });
               toast.success(response.data.message);
               dispatch(logout());
               navigate('/');
          } catch (error) {
               if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message || "An error occurred");
               } else {
                    toast.error("An error occurred");
               }
          }
     }

     const handleFeedbackChange = (e) => {
          setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
     }


     const handleAddFeedback = async (e) => {
          e.preventDefault();

          if (feedbackData.feedback === null) {
               toast.error("Feedback is already there. Click on 'Edit Feedback' to update.")
               return
          }

          try {
               const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/addfeedbackbyuser`, feedbackData, { withCredentials: true });
               toast.success(response.data.message);

          } catch (error) {
               if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message || "An error occurred");
               } else {
                    toast.error("An error occurred");
               }
          }
     }



     const handleEditFeedback = async (e) => {
          e.preventDefault();

          if (feedbackData.feedback === null) {
               toast.error("Feedback is empty. First add the feedback.")
               return
          }
          try {
               const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/editfeedbackbyuser`, feedbackData, { withCredentials: true });

               toast.success(response.data.message);

          } catch (error) {
               if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message || "An error occurred");
               } else {
                    toast.error("An error occurred");
               }
          }
     }


     return (
          <section className={styles.container}>
               <h1>
                    Welcome to <span>Blender's</span> company feedback.
               </h1>

               {isLoggedIn === false ? (
                    <>
                         <p>Login in to give us your valuable feedback.</p>
                         <button className={styles.loginBtn} onClick={handleLoginClick}>Login</button>
                    </>
               ) : (

                    <div className={styles.actionBtn}>
                         <button className={styles.logoutBtn} onClick={handleLogoutClick}>logout</button>
                         <button className={styles.accountDeleteBtn} onClick={() => handleDeleteConfirmation(userData.userId)}>Delete Account</button>
                    </div>

               )}

               {isLoggedIn && (
                    <div className={styles.feedbackContainer}>
                         <form>
                              <label htmlFor="feedback">Your Feedback</label>
                              <textarea
                                   name="feedback"
                                   id="feedback"
                                   placeholder="Write your feedback here..."
                                   value={feedbackData.feedback}
                                   onChange={handleFeedbackChange}
                                   required
                                   rows="10"
                                   className={styles.textarea}
                              ></textarea>
                              <section className={styles.optionBtns}>
                                   <button className={styles.addFeedbackBtn} onClick={handleAddFeedback}>Add Feedback</button>
                                   <button className={styles.editFeedbackBtn} onClick={handleEditFeedback}>Edit Feedback</button>
                              </section>
                         </form>
                    </div>
               )}
          </section>
     );
};
