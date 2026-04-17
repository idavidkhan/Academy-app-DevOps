import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useScheduleContext } from "../context/ScheduleContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronDown } from "lucide-react";
import { BASE_URL } from '../config';

const RegistrationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { schedules } = useScheduleContext();
  const [courseList, setCourseList] = useState([]);

  const API_URL = BASE_URL;

  const selectedCourse = location.state?.course;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("Fetching courses from:", `${API_URL}/api/courses`);
        const res = await axios.get(`${API_URL}/api/courses`);
        const scheduledCourses = res.data.filter((course) =>
          schedules.some((schedule) => schedule.course_id === course.id)
        );
        console.log("Filtered scheduled courses:", scheduledCourses);
        setCourseList(scheduledCourses);
      } catch (err) {
        console.error(
          "Failed to load courses:",
          err.response?.data || err.message
        );
        toast.error(
          `Failed to load courses: ${err.response?.data?.error || err.message}`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
    };
    fetchCourses();

  }, [schedules]);

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    cnic: "",
    skills: "",
    last_degree: "",
    selectedCourseId: selectedCourse?.id || "",
    courseTitle: selectedCourse?.title || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{11}$/, "Phone number must be exactly 11 digits")
      .required("Phone number is required"),
    cnic: Yup.string()
      .matches(
        /^\d{5}-\d{7}-\d{1}$/,
        "Invalid CNIC format (e.g., 12345-1234567-1)"
      )
      .required("CNIC is required"),
    skills: Yup.string().required("Skills are required"),
    last_degree: Yup.string().required("Last Degree is required"),
    selectedCourseId: Yup.string().required("Please select a course"),
    courseTitle: Yup.string().required("Course title is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Reset states before submission to prevent stale data


    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        cnic: values.cnic,
        skills: values.skills,
        last_degree: values.last_degree,
        course_id: values.selectedCourseId,
        course_title: values.courseTitle,
      };

      console.log("Sending registration data:", payload);

      const res = await axios.post(`${API_URL}/api/registrations`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Registration response:", res.data);

      if (res.data.application_id) {


        toast.success("Your registration submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: false,
        });

        resetForm();

        setTimeout(() => {
          navigate("/verify-registration", {
            state: {
              application_id: res.data.application_id,
              email: values.email,
            },
          });
        }, 4000);
      } else {
        throw new Error("Application ID not received from server");
      }
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message,
        { status: error.response?.status }
      );
      if (error.response?.status === 409) {
        toast.error(
          "Both email and CNIC must be unique for this course. Please use a different email and CNIC.",
          {
            position: "top-right",
            autoClose: 3000,
            pauseOnHover: false,
          }
        );
      } else {
        toast.error(
          `Registration failed: ${error.response?.data?.error || error.message}`,
          {
            position: "top-right",
            autoClose: 3000,
            pauseOnHover: false,
          }
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-2xl mx-auto glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-fadeIn">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Register for <span className="text-teal-600">Course</span>
          </h2>
          <p className="text-slate-600">Enter your details below to start your professional journey.</p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue, errors, touched }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wider">Select Course</label>
                  <div className="relative">
                    <Field
                      as="select"
                      name="selectedCourseId"
                      className={`input appearance-none ${touched.selectedCourseId && errors.selectedCourseId ? 'border-red-400 focus:ring-red-500/10' : ''}`}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selected = courseList.find(
                          (c) => c.id.toString() === selectedId
                        );
                        setFieldValue("selectedCourseId", selectedId);
                        setFieldValue("courseTitle", selected?.title || "");
                      }}
                    >
                      <option value="">-- Choose a course --</option>
                      {courseList.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </Field>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
                  </div>
                  <ErrorMessage
                    name="selectedCourseId"
                    component="div"
                    className="text-red-500 text-xs mt-1.5 font-medium ml-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    className={`input ${touched.name && errors.name ? 'border-red-400 focus:ring-red-500/10' : ''}`}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs mt-1.5 font-medium ml-1"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className={`input ${touched.email && errors.email ? 'border-red-400 focus:ring-red-500/10' : ''}`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1.5 font-medium ml-1"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                  <Field
                    type="text"
                    name="phone"
                    placeholder="03xxxxxxxxx"
                    className={`input ${touched.phone && errors.phone ? 'border-red-400 focus:ring-red-500/10' : ''}`}
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-xs mt-1.5 font-medium ml-1"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wider">CNIC</label>
                  <Field
                    type="text"
                    name="cnic"
                    placeholder="12345-1234567-1"
                    className={`input ${touched.cnic && errors.cnic ? 'border-red-400 focus:ring-red-500/10' : ''}`}
                  />
                  <ErrorMessage
                    name="cnic"
                    component="div"
                    className="text-red-500 text-xs mt-1.5 font-medium ml-1"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wider">Last Degree</label>
                  <Field
                    type="text"
                    name="last_degree"
                    placeholder="e.g. BS Computer Science"
                    className={`input ${touched.last_degree && errors.last_degree ? 'border-red-400 focus:ring-red-500/10' : ''}`}
                  />
                  <ErrorMessage
                    name="last_degree"
                    component="div"
                    className="text-red-500 text-xs mt-1.5 font-medium ml-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-bold text-slate-700 uppercase tracking-wider">Key Skills</label>
                  <Field
                    as="textarea"
                    rows="3"
                    name="skills"
                    placeholder="Tell us about your technical skills..."
                    className={`input resize-none ${touched.skills && errors.skills ? 'border-red-400 focus:ring-red-500/10' : ''}`}
                  />
                  <ErrorMessage
                    name="skills"
                    component="div"
                    className="text-red-500 text-xs mt-1.5 font-medium ml-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-lg shadow-xl shadow-teal-600/20"
              >
                {isSubmitting ? "Processing Application..." : "Submit Registration"}
              </button>


            </Form>
          )}
        </Formik>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default RegistrationForm;