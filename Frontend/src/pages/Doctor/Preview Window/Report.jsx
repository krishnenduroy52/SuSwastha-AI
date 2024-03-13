import React, { useEffect } from 'react'
import Style from "./Report.module.css";
import Image from "./../../../assets/Images/doctorai_logo.svg"
import Info from "./infofields/Info.jsx"
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { LiaBirthdayCakeSolid } from "react-icons/lia";

const Report = ({getUserup}) => {

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", year: "numeric" };
    let formattedDate = date.toLocaleDateString("en-US", options);
    formattedDate = formattedDate.slice(0, -5) + "," + formattedDate.slice(-5);

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
  

  return (
    <div className={Style.container}>
      <div className={Style.watermaker}></div>
      <div className={Style.imgSec}>
        <img src={Image} alt="logo" className={Style.img} />
      </div>

      <div className={Style.hrline}></div>
      <h6 className={Style.h6}>This Report is Genarated By Suswastha Ai</h6>

      <div className={Style.BasicDetails}>

        <h3>Basic Details</h3>

        <div className={Style.detailSec}>
          <div className={Style.rightSec}>
            <FaUserCircle className={Style.profileimg}/>
          </div>
          <div className={Style.LefttSec}>
            <Info
              img={<FaRegUserCircle />}
              field="Name"
              data={getUserup.client.username}
            />
            <Info
              img={<GiSandsOfTime />}
              field="Age"
              data={getUserup.client.age}
              suffix="years"
            />
            <Info
              img={
                getUserup.client.gender === "Male" ? (
                  <BsGenderMale />
                ) : (
                  <BsGenderFemale />
                )
              }
              field="Gender"
              data={getUserup.client.gender}
            />
            <Info
              img={<LiaBirthdayCakeSolid />}
              field="DOB"
              data={formatDate(getUserup.client.dob)}
            />
          </div>
        </div>
      </div>

      <h6 className={Style.h61}>Report Details</h6>

      <h2 className={Style.about}> <b>Disease Detected By the AI:</b> {getUserup.about}</h2>

      <h6 className={Style.h61}>Meeting Details</h6>
      <h2 className={Style.about}> <b>Appointed Doctor:</b> Dr. Indrajit Pal <br/>
      <b>Appointment Time:</b> {getUserup.timeOfAppointment}
      <br/>
      <b>Appointment Date:</b> {formatDate(getUserup.dateOfAppointment)}
       </h2>
      

    </div>
  );
}

export default Report