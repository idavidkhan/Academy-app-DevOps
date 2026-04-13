import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { CourseProvider } from "./context/CourseContext";
import { NewsProvider } from "./context/NewsContext";
import { TeacherProvider } from "./context/TeacherContext";
import { AboutProvider } from "./context/AboutContext";
import { VideoProvider } from "./context/VideoContext";
import { ScheduleProvider } from "./context/ScheduleContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AboutProvider>
        <CourseProvider>
          <NewsProvider>
            <TeacherProvider>
              <VideoProvider>
                <ScheduleProvider>
                <App />
                </ScheduleProvider>
              </VideoProvider>
            </TeacherProvider>
          </NewsProvider>
        </CourseProvider>
      </AboutProvider>
    </BrowserRouter>
  </React.StrictMode>
);
