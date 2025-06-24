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
    currencySymbol: string;
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

const getTransportationCost = (transportation: Transportation[], from:string, to:string, prefOption:string): number => {

  for (const transport of transportation) {
    if (transport.from === from && transport.to === to) {
      for (const option of transport.options) {
        if (option.type === prefOption) {
          return parseInt(option.cost.replace(/[^0-9.-]+/g, ""));
        }
      }
    }
  }
  return 0;

}  

const TripPdfFormat = ({tripDetails, metadata, pckList, costData, currencySymbol}:PDFprops) => {
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
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {Object.entries(tripDetails.trip.trip).map(([day, dayInfo]) => (
          <View
          key={day}
          style={{
            backgroundColor: '#fef6f0',
            width: '100%',
            height: 'auto',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            
          }}
          >
            <View
              style={{
              backgroundColor: '#fc8c47',
              width: '55px',
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
                width: '100%',
                transform: 'rotate(-90deg)',
              }}
              >
              DAY {day.replace('day', '').trim()}
              </Text>
            </View>
            <View style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',

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
                  {dayInfo.destination.toUpperCase()}
                </Text>
              </View>
              <View style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '10px',
                gap: '10px',
              }}>
                {dayInfo.places.map((place, index) => (
                  <View key={index} style={{
                    backgroundColor: '#ffecde',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    borderStyle: 'dotted',
                  }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '5px',
                      }}
                    >
                      <Text style={{
                        fontFamily: 'Poppins SemiBold',
                        color: '#222',
                        fontSize: 14,
                      }}>
                        {place.name}
                      </Text>
                      <Text style={{
                          backgroundColor: '#ffd8b5',
                          color: '#333',
                          paddingHorizontal: '10px',
                          paddingVertical: '2px',
                          borderRadius: '5px',
                          fontFamily: 'Poppins Regular',
                        fontSize: 12,
                      }}>
                        {place.cost}
                      </Text>
                    </View>
                      <Text
                        style={{
                          fontFamily: 'Poppins Regular',
                          color: '#555',
                          fontSize: 12,
                        }}
                      >
                        {place.time}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          fontSize: 12,
                          fontFamily: 'Poppins Regular',
                          marginTop: '5px',
                          color: '#555',
                        }}
                      >
                        <View>
                          <Text>From:</Text>
                          <Text>{place.from}</Text>
                        </View>

                        <View>
                          <Text>To:</Text>
                          <Text>{place.from}</Text>
                        </View>
                      </View> 
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          fontSize: 12,
                          fontFamily: 'Poppins Regular',
                          marginTop: '5px',
                          color: '#555',
                        }}
                      >
                        <Text
                          style={{
                          backgroundColor: '#ffd8b5',
                          color: '#333',
                          paddingHorizontal: '10px',
                          paddingVertical: '2px',
                          borderRadius: '5px',
                          fontFamily: 'Poppins Regular',
                          }}
                        >{place.preffered_transport}</Text>
                        <Text
                          style={{
                          backgroundColor: '#ffd8b5',
                          color: '#333',
                          paddingHorizontal: '10px',
                          paddingVertical: '2px',
                          borderRadius: '5px',
                          fontFamily: 'Poppins Regular',
                          }}
                        >{currencySymbol}{getTransportationCost(tripDetails.trip.transportation, place.from, place.to, place.preffered_transport)}</Text>
                      </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
          ))}
        </View>
      </View>

      </Page>
    </Document>


  );
};


const ExportComp = ({tripDetails, metadata, pckList, costData, currencySymbol}:PDFprops) => {
  return (
    <div className='flex flex-col h-full bg-green'>
      <PDFDownloadLink
        document={<TripPdfFormat currencySymbol={currencySymbol} tripDetails={tripDetails} metadata={metadata} pckList={pckList} costData={costData} />}
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
          <TripPdfFormat currencySymbol={currencySymbol} tripDetails={tripDetails} metadata={metadata} pckList={pckList} costData={costData} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default ExportComp;
