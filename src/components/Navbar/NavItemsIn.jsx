import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./navbar.module.css";
import avatar from "../../assets/avatar.png";
import hamburger from "../../assets/hamburger.png";
import cross from "../../assets/cross.png";
import { ToastContainer, toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 

const NavItemsIn = (props) => {
  const [showMenu, setShowMenu] = useState(false);
  const [searchParams] = useSearchParams();
  const isBookmarksActive = searchParams.get("viewbookmarks");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    toast.success("Logged out successfully!"); 
    window.location.href = "/";
  };

  return (
    <>
      <Link to="/?viewbookmarks=true">
        <button
          style={{
            border: isBookmarksActive
              ? "3px solid #085cff"
              : "3px solid transparent",
          }}
          className={styles.bookmarkBtn}
        >
          Bookmarks
        </button>
      </Link>
      <Link to="/?addstory=true">
        <button className={styles.addStoryBtn}>Add Story</button>
      </Link>
      <img className={styles.avatar} src={avatar} alt="avatar" />
      <img
        className={`${styles.toggleIcon} ${
          showMenu ? styles.cross : styles.hamburger
        }`}
        onClick={() => setShowMenu(!showMenu)}
        src={showMenu ? cross : hamburger}
        alt={showMenu ? "cross" : "hamburger"}
      />
      {showMenu && (
        <div className={styles.menuSection}>
          <p>{localStorage.getItem("username")}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      <ToastContainer
       position="top-left"
       theme="dark"/> 
    </>
  );
};

export default NavItemsIn;
