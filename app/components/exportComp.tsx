'use client';

import React from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import TripPdfFormat from './pdfFormat';

const ExportComp = () => {

  
  return (
    <div className='flex flex-col h-full bg-green'>
      <PDFDownloadLink
        document={<TripPdfFormat />}
        fileName="Trip_Plan_Europe_Discovery.pdf"
        className="bg-blue-500 cursor-pointer w-fit text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
      >
        {({ loading }) =>+
          loading ? 'Preparing PDF...' : 'Export Trip as PDF'
        }
      </PDFDownloadLink>
      <button></button>
      <div style={{ margin: '20px 0', width: '100%', height: '100%' }}>
        <span className="text-gray-600">or view it online:</span>
        <PDFViewer style={{ width: '100%', height: '100%' }}
        >
          <TripPdfFormat />
        </PDFViewer>
      </div>
    </div>
  );
};

export default ExportComp;
