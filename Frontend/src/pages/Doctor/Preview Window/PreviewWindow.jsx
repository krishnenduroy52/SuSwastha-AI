import React, { useRef, useState } from 'react'
import Style from "./PreviewWindow.module.css"
import UserDetails from './UserDetails'
import { BsCloudDownload } from "react-icons/bs";
import Report from './Report';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PreviewWindow = ({getUserup}) => {

    const pdfRef = useRef();
    const handleDownloadPDF = () => {
        const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
        console.log("printing.........");
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight, imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      const pdfName = `${getUserup.client.username}_Report.pdf`
      pdf.save(pdfName);
    });
        
      };
    
  return (
    <div className={getUserup?Style.containerwithpreview:Style.containernopreview}>
        {
            getUserup?
            <div className={Style.preview}>
                <UserDetails getUserup={getUserup}/>
                <div className={Style.downloadsection}>
                    <h1>Download Ai Genarated Report</h1>
                    <button onClick={handleDownloadPDF}><BsCloudDownload className={Style.downloadlogo}/>Download</button>
                </div>
                <div className={Style.reportsec}>
                <h1>Report Preview</h1>
                <div className={Style.ex} ref={pdfRef}>
                    <Report getUserup={getUserup} />
                    <button onClick={handleDownloadPDF}></button>
                    </div>
                </div>
                
            </div>
            :
            <div className={Style.nopreview}>

                <h2>No Preview Available</h2>
                <h5>Please Open an Appointment to See The Details</h5>

            </div>
        }
    </div>
  )
}

export default PreviewWindow