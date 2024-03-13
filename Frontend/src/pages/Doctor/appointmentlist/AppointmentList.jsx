import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { appointmentDetails, getDoctorDetailsRoute, getUserDataRoute } from "../../../Utils/APIRoutes.js";
import Cards from "./Cards.jsx";
import styles from './AppointmentList.module.css';




const AppointmentList = ({setgetUserup}) => {
  
  const [schedule, setSchedule] = useState([]);
  const navigate = useNavigate();

  const fetchAppointmentDetails = async (appointmentId) => {
    try {
            const response = await axios.get(
            appointmentDetails(appointmentId)
        );
        // console.log("Head is here:- "+JSON.stringify(response.data.appointment,null,4))       
        const appointment = response.data.appointment;
        const clientId = appointment.clientId;
        const clientDetails = await axios.get(
            getUserDataRoute(clientId)
        );
        const client = clientDetails.data;
        console.log("clients data:- "+JSON.stringify(client,null,4))
        // console.log(client)
        setSchedule((prev) => {
            let isAlreadyScheduled = false;
            prev.forEach((item) =>
                item._id == appointment._id ? (isAlreadyScheduled = true) : null
            );
            if (!isAlreadyScheduled) {
                return [...prev, { ...appointment, client: client.user }];
            }
            return prev;
        });        
    } catch (error) { }
};

  const fetchDoctorData = async (userId) => {
    try {
        const response = await axios.get(
            getDoctorDetailsRoute(userId)
        );        
        // console.log(response.data);
        response.data.schedule.map((s) => fetchAppointmentDetails(s));
        // toast.success("Successfully fetched user data.");
    } catch (error) {
        toast.error("Error retrieving user data"); // Display toast error
        console.error("Error retrieving user data:", error);
    }
  };

  useEffect(() => {
    const isDoc = localStorage.getItem("doctor_ai_isDoc");
    // console.log("isDoc: " + isDoc);
    if (isDoc != "1") {
        navigate("/profile");
        return;
    }
    const userId = localStorage.getItem("doctor_ai_userID");
    if (userId) {
        fetchDoctorData(userId);
    } else {
        navigate("/doctor/login"); // Redirect to the login page if user is not logged in
    }
}, [navigate]);

useEffect(() => {
  // console.log("Testing data: "+JSON.stringify(schedule,null,4))
}, [schedule])

  return (
    <>
    <div className={styles.leftHalf}>
    <div className={styles.upper}></div>
    <div className={styles.cardContainer}>
    {      
      schedule.length !== 0 ?schedule.map((user, index,arr) => (      
       <Cards key={index} user={user} setgetUserup={setgetUserup}/>
    ))
    :
    <></>}
    </div>
    <div className={styles.lower}></div>
    </div>
    </>
  );
};

export default AppointmentList;