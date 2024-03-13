import React, { useState } from 'react';
import Appointments from './appointmentlist/AppointmentList.jsx';
import Style from "./doctorDashboard.module.css"
import PreviewWindow from './Preview Window/PreviewWindow.jsx';

const DoctorDashboard = () => {
  const [getUserup, setgetUserup] = useState(null)
  return (
    <div className={Style.container}>
    <div className={Style.leftsection}>
        <h1>Your's Appointments</h1>
        <Appointments setgetUserup={setgetUserup}/>
    </div>
    <div className={Style.rightsection}>
        <h1>Preview Screen</h1>
        <PreviewWindow getUserup={getUserup}/>
    </div>

    </div>
  )
}

export default DoctorDashboard