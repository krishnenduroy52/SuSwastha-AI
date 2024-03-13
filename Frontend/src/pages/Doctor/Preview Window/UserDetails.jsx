import React from "react";
import Style from "./UserDetails.module.css";
import Info from "./infofields/Info";
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { Link } from "react-router-dom";


const UserDetails = ({ getUserup }) => {
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
      <h1 className={Style.h1}>Patient Details</h1>
      <div className={Style.containerinside}>
        <div className={Style.leftsection}>
          <div className={Style.profileIcon}>
            <FaUserCircle />
          </div>
        </div>
        <div className={Style.rightsection}>
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

      <div className={Style.btnsec}>
      <Link
      to={`/rooms/${getUserup.meetingId}`}>
        <button className={Style.btn}>Join</button></Link>
      </div>
    </div>
  );
};

export default UserDetails;
