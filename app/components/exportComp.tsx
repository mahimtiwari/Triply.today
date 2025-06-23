'use client';

import React from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';



import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image 
} from '@react-pdf/renderer';




interface Place {
  category: string;
  name: string;
  cost: string;
  time: string;
  from: string;
  to: string;
  preffered_transport: string;
  description?:string
}

interface ArrivingOrDeparting {
  from: string;
  to: string;
  preffered_transport: string;
}

interface Day {
  date: string;
  destination: string;
  arriving?: ArrivingOrDeparting;
  departing?: ArrivingOrDeparting;
  places: Place[];
}

interface TripDetails {
  [key: string]: Day; // day1, day2, day3 — variable number of days
}

interface TransportOption {
  type: string;
  cost: string;
}

interface Transportation {
  from: string;
  to: string;
  options: TransportOption[];
}

interface Trip {
  trip: {
    trip: TripDetails;
    transportation: Transportation[];
  };
}

interface Meta {
    destination: string;
    startDate: string;
    endDate: string;
    budget: string;
    peopleType: string;
    adults: string;
    children: string;
}


interface CostDetailsType {
  days: {
      [key: string]: {
        daytotalcost: number;
        subcosts: {
          transportation: number;
          hotel: number;
          food: number;
          sightseeing: number;
      };
    }
  };
  totalcost: number;
  totaltransportation: number;
  totalhotel: number;
  totalfood: number;
  totalsightseeing: number;
  shopping?: number;
  insurance?: number;
  visa?: number;
  other?: number;
}

interface PackingCardProps {
    name: string;
    values: {
        data: { name: string; checked: boolean }[];
        color?: string;
    };
    
}

interface PDFprops {
    tripDetails: Trip,
    metadata: Meta,
    pckList: PackingCardProps[],
    costData: CostDetailsType,
}


// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3U8k_HfFIdzxHVw.ttf',
// });

// Font.register({
//   family: 'Poppins',
//   src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJbecmNE.ttf',
// });

Font.register({
  family: 'Playfair Display',
  src: '/fonts/PlayfairDisplay-VariableFont_wght.ttf',
});
Font.register({
  family: 'Poppins Bold',
  src: '/fonts/Poppins-Bold.ttf',
});

Font.register({
  family: 'Poppins SemiBold',
  src: '/fonts/Poppins-SemiBold.ttf',
});

Font.register({
  family: 'Poppins Regular',
  src: '/fonts/Poppins-Regular.ttf',
});

Font.register({
  family: 'Poppins Thin',
  src: '/fonts/Poppins-Thin.ttf',
});

Font.register({
  family: 'Poppins Medium',
  src: '/fonts/Poppins-Medium.ttf',
});


Font.register({
  family: 'Poppins Light',
  src: '/fonts/Poppins-Light.ttf',
});


const descripStyles = {
  classify:{
    fontFamily: 'Poppins SemiBold',
    color: '#222',
    fontSize: 13,

  },
  val: {
    fontFamily: 'Poppins Regular',
    color: '#333',
    fontSize: 13,
  }
}


const TripPdfFormat = ({tripDetails, metadata, pckList, costData}:PDFprops) => {
  return (
    <Document>
      <Page size="A4" style={{
      paddingVertical: '30px',
    }}>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '18px',
        fontSize: 45,
        paddingHorizontal: '40px',
        paddingBottom: '10px',
        width: '60%',
        borderBottom: '2px solid #ff8a47',
      }}>
        <Text
          style={{
            fontFamily: 'Poppins SemiBold',

          }}
        >
         Trip
         
        </Text>
        <Text
        style={{
            fontFamily: 'Poppins Light',
            color: '#555',
        }}>
          Itinerary
        </Text>
      </View>

      <View style={{
        paddingHorizontal: '40px',
        paddingVertical: '20px',
      }}>
        <View>
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            width: '100%',
            borderBottom: '1px solid #ccc',
            borderStyle: 'dotted'
          }}>
            <Text style={descripStyles.classify}>
              Destination
            </Text>
            <Text style={descripStyles.val}>
              {metadata.destination}
            </Text>
          </View>
          <View style={{
            display:'flex',
            flexDirection: 'row',
            gap: '20px',
            width: '100%',
            marginTop: '10px',
          }}>

          <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            width: '50%',
            borderBottom: '1px solid #ccc',
            borderStyle: 'dotted'
          }}>
            <Text style={descripStyles.classify}>
              Start Date
            </Text>
            <Text style={descripStyles.val}>
              {metadata.startDate}
            </Text>
          </View>

          <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            width: '50%',
            borderBottom: '1px solid #ccc',
            borderStyle: 'dotted'
          }}>
            <Text style={descripStyles.classify}>
              End Date
            </Text>
            <Text style={descripStyles.val}>
              {metadata.endDate}
            </Text>
          </View>
          </View>
        </View>
{/* Day Views */}
        <View style={{
          marginTop: '30px',
        }}>
          
          <View
          style={{
            backgroundColor: '#fef6f0',
            width: '100%',
            minHeight: "150px",
            height: 'auto',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'row',
          }}
          >
            <View
              style={{
              backgroundColor: '#fc8c47',
              width: '50px',
              display: 'flex',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px',

              }}
            >
              <Text
              style={{
                fontFamily: 'Poppins SemiBold',
                color: '#fff',
                fontSize: 16,
                transform: 'rotate(-90deg)',
              }}
              >
              DAY 1
              </Text>
            </View>
            <View style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',

            }}>
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins SemiBold',
                    color: '#444',
                    fontSize: 16,
                    textAlign: 'center',
                    paddingTop: '5px',
                    paddingBottom: '2px',
                    borderBottom: '1px solid #ccc',
                    borderStyle: 'dotted',
                  }}
                >
                  {tripDetails.trip.trip.day1.destination.toUpperCase()}
                </Text>
              </View>
              <View>
                {tripDetails.trip.trip.day1.places.map((place, index) => (
                  <View key={index} style={{

                  }}>
                    <Image
                      src={`/img/${place.category.toLowerCase()}.png`}
                      style={{
                        width: '20px',
                        height: '20px',
                      }}
                    />
                    <Text>{place.name} Category: {place.category}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

        </View>
      </View>

      </Page>
    </Document>


  );
};


const ExportComp = ({tripDetails, metadata, pckList, costData}:PDFprops) => {
  return (
    <div className='flex flex-col h-full bg-green'>
      <PDFDownloadLink
        document={<TripPdfFormat tripDetails={tripDetails} metadata={metadata} pckList={pckList} costData={costData} />}
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
        <PDFViewer style={{ width: '100%', height: '100%' }}>
          <TripPdfFormat tripDetails={tripDetails} metadata={metadata} pckList={pckList} costData={costData} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default ExportComp;
