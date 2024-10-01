import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import FilterSection from "../components/FilterSection/FilterSection";
import CategorySection from "../components/CategorySection/CategorySection";
import RegisterModal from "../components/RegisterModal/RegisterModal";
import SignInModal from "../components/SignInModal/SignInModal";
import AddStory from "../components/AddStory/AddStory";
import MobileAddStory from "../components/MobileAddStory/MobileAddStory";
import StoryViewer from "../components/StoryViewer/StoryViewer";
import Slide from "../components/Slide/Slide";
import filters from "../constants/data";
import YourStories from "../components/YourStories/YourStories";
import Bookmarks from "../components/Bookmarks/Bookmarks";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const displayParamMappings = {
    register: queryParams.get("register"),
    signin: queryParams.get("signin"),
    addstory: queryParams.get("addstory"),
    editstory: queryParams.get("editstory"),
    viewstory: queryParams.get("viewstory"),
    viewbookmarks: queryParams.get("viewbookmarks"),
    yourstories: queryParams.get("yourstories"),
    slide: queryParams.get("slide"),
  };

  const [authValidated, setAuthValidated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null); 
  const [story, setStory] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const validateToken = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/validate`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        setAuthValidated(response.status === 200);
      } catch (error) {
        console.error("Token validation error:", error);
      }
    };

    validateToken();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [displayParamMappings.signin]);

  const handleSelectFilters = (filter) => {
    if (filter === "All") {
      setActiveFilter(null); // Show all stories
    } else {
      setActiveFilter(filter);
    }
  };

  const handleStoryViewer = (story) => {
    setStory(story);
    navigate("/?viewstory=true");
  };

  const renderCategorySections = () => {
    if (displayParamMappings.viewbookmarks) {
      return <Bookmarks handleStoryViewer={handleStoryViewer} />;
    } else if (displayParamMappings.yourstories) {
      return (
        <YourStories
          activeFilter={activeFilter} // Pass the active filter
          handleStoryViewer={handleStoryViewer}
        />
      );
    } else {
      return (
        <>
          <FilterSection
            activeFilter={activeFilter}
            handleSelectFilters={handleSelectFilters}
          />
          {!isMobile && (
            <YourStories
              activeFilter={activeFilter} // Pass the active filter
              handleStoryViewer={handleStoryViewer}
            />
          )}
          
          {activeFilter 
            ? <CategorySection
                key={activeFilter}
                category={activeFilter}
                handleStoryViewer={handleStoryViewer}
              />
            : filters.map((filter) => (
                <CategorySection
                  key={filter.name}
                  category={filter.name}
                  handleStoryViewer={handleStoryViewer}
                />
              ))
          }
        </>
      );
    }
  };

  return (
    <>
      <Navbar authValidated={authValidated} />
      {renderCategorySections()}

      {displayParamMappings.register && <RegisterModal />}
      {displayParamMappings.signin && <SignInModal />}
      {displayParamMappings.addstory &&
        (isMobile ? <MobileAddStory /> : <AddStory />)}
      {displayParamMappings.editstory &&
        (isMobile ? <MobileAddStory /> : <AddStory />)}
      {displayParamMappings.viewstory && (
        <StoryViewer slides={story} isMobile={isMobile} />
      )}
      {displayParamMappings.slide && <Slide />}
    </>
  );
};

export default HomePage;
