import React from 'react'
import Style from "./info.module.css"


const Info = (props) => {
  return (
    <div className={Style.Textcontainer}>
    <div className={Style.img}>{props.img}</div> 
    <div className={Style.heading}>{props.field} : </div>     
    
    <div className={Style.data}> {props.data} {props.suffix}</div>     
    
    </div>
  )
}

export default Info