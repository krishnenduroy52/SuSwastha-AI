import React, { useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoMdOpen } from "react-icons/io";
import { MdOutlineAccessTime } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import styles from './Cards.module.css';


const Cards = ({user,setgetUserup}) => {  

const clientData = user.client; 

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "long", year: "numeric" };
  let formattedDate = date.toLocaleDateString("en-US", options);
  formattedDate = formattedDate.slice(0, -5) + "," + formattedDate.slice(-5);;

  const day = date.getDate();
  let suffix = "th";

  if (day === 1 || day === 21 || day === 31) {
      suffix = "st";
  } else if (day === 2 || day === 22) {
      suffix = "nd";
  } else if (day === 3 || day === 23) {
      suffix = "rd";
  }
 
  return `${day}${suffix} ${formattedDate}`;
};

useEffect(() => {  

  console.log("Details: "+JSON.stringify(user,null,4));

}, [])

  return (
    <>
    <div className={styles.cards}>
        <div className={styles.profileIcon}><FaUserCircle /></div>
        <div>
          <div className={styles.profileName}>{clientData.username}</div>
          <div className={styles.profileDetails}>{clientData.age} Years, {clientData.gender} </div>
          <div className={styles.profileTimings}>
            <div className={styles.date}> <SlCalender style={{paddingRight:'5px'}} /> <p>{formatDate(user.dateOfAppointment)}</p> </div>  
            <div className={styles.date}> <MdOutlineAccessTime style={{fontSize:'17px',marginRight:'3px'}} /> <p>{user.timeOfAppointment}</p> </div>  
          </div>
        </div>
          
        <div className={styles.openButton} onClick={()=>setgetUserup(user)}> <p> Open</p> <IoMdOpen style={{fontSize: '20px',margin:'1px'}}/></div>
    </div>
    </>
    
  );
};

export default Cards;