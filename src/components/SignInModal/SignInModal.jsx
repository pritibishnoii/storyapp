import React, { useState } from "react";
import ModalContainer from "../ModalContainer/ModalContainer";
import styles from "./signInModal.module.css";
import passwordIcon from "../../assets/passwordIcon.png";
import { ToastContainer, toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 

const SignInModal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsProcessing(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      window.localStorage.setItem("token", responseData.token);
      window.localStorage.setItem("userId", responseData.userId);
      window.localStorage.setItem("username", responseData.username);
      setSuccess(true);
      toast.success("Login Successful!"); 

      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (error) {
      setError(error.message);
      toast.error(error.message); 
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ModalContainer>
          <h1 className={styles.formHeader}>Login</h1>
          <form className={styles.formContainer}>
            <div>
              <label>Username</label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Enter username"
              />
            </div>
            <div className={styles.passwordContainer}>
              <label>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className={styles.passwordInput}
              />
              <img
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordIcon}
                src={passwordIcon}
                alt="password icon"
              />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <div>
              <button onClick={handleSubmit}>Login</button>
            </div>
            {isProcessing && (
              <div className={styles.formHeader}>Processing...</div>
            )}
          </form>
      <ToastContainer
       position="top-left"
       theme="dark"/> 
    </ModalContainer>
  );
};

export default SignInModal;
