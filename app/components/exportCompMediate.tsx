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
                        <View style={{
                          maxWidth: '40%',
                        }}>
                          <Text>From:</Text>
                          <Text>{place.from}</Text>
                        </View>

                        <View style={{
                          maxWidth: '40%',
                        }}>
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
         Packing
         
        </Text>
        <Text
        style={{
            fontFamily: 'Poppins Light',
            color: '#555',
        }}>
          List
        </Text>
      </View>

      <View style={{

        width: '100%',
        paddingHorizontal: '40px',
        paddingVertical: '20px',

      }}>
        <View
        style={{
          justifyContent: 'space-between',
          border: '1px solid #ccc',
          borderRadius: '5px',        
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: '15px',
        }}
        >
        {pckList.map((item, index) => (
          <View 
          key={index} 
          style={{
            width: '50%',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 14,
                fontFamily: 'Poppins SemiBold',
              }}
            >{item.name}</Text>
          <View 
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '10px',

              gap: '10px',
            }}
          >
            {item.values.data.map((indItem, indIndex) => (
              <View
              key={indIndex}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '5px',
              }}
              >
                <View style={{
                  height: '14px',
                  width: '14px',
                  borderRadius: '4px',
                  border: '1px solid #666',
                }}></View>
                <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins Regular',
                }}
                >{indItem.name}</Text>

              </View>
            ))}
          </View>
          </View>
        ))}
        </View>
      </View>

      </Page>
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
         Cost
         
        </Text>
        <Text
        style={{
            fontFamily: 'Poppins Light',
            color: '#555',
        }}>
          Analysis
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: '40px',
          paddingVertical: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        {Object.entries(costData.days).map(([day, costInfo]) => (
          <View
            key={day}
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins SemiBold',
                fontSize: 16,
                color: '#333',
                marginBottom: '2px',
              }}
            >Day {day.replace("day", "").trim()}</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  fontFamily: 'Poppins Regular',
                  fontSize: 12,
                }}
              >
                <Text>Transportation:</Text>
                <Text>{currencySymbol}{costInfo.subcosts.transportation}</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  fontFamily: 'Poppins Regular',
                  fontSize: 12,
                }}
              >
                <Text>Hotel:</Text>
                <Text>{currencySymbol}{costInfo.subcosts.hotel}</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  fontFamily: 'Poppins Regular',
                  fontSize: 12,
                }}
              >
                <Text>Food:</Text>
                <Text>{currencySymbol}{costInfo.subcosts.food}</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  fontFamily: 'Poppins Regular',
                  fontSize: 12,
                }}
              >
                <Text>Sightseeing:</Text>
                <Text>{currencySymbol}{costInfo.subcosts.sightseeing}</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  fontFamily: 'Poppins Medium',
                  fontSize: 12,
                }}
              >
                <Text>Day Total:</Text>
                <Text>{currencySymbol}{costInfo.subcosts.transportation}</Text>
              </View>
            </View>
          </View>
        ))}
        <View
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            
            <Text
              style={{
                fontFamily: 'Poppins SemiBold',
                fontSize: 16,
                color: '#333',
                marginBottom: '2px',
              }}
            >Misc</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  fontFamily: 'Poppins Regular',
                  fontSize: 12,
                }}
              >
                <Text>Shopping:</Text>
                <Text>{currencySymbol}{costData.shopping || 0}</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  fontFamily: 'Poppins Regular',
                  fontSize: 12,
                }}
              >
                <Text>Insurance:</Text>
                <Text>{currencySymbol}{costData.insurance || 0}</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  fontFamily: 'Poppins Regular',
                  fontSize: 12,
                }}
              >
                <Text>Visa:</Text>
                <Text>{currencySymbol}{costData.visa || 0}</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  fontFamily: 'Poppins Regular',
                  fontSize: 12,
                }}
              >
                <Text>Other:</Text>
                <Text>{currencySymbol}{costData.other || 0}</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  fontFamily: 'Poppins Medium',
                  fontSize: 12,
                }}
              >
                <Text>Misc Total:</Text>
                <Text>{currencySymbol}{(costData.shopping || 0) + (costData.insurance || 0) + (costData.visa || 0) + (costData.other || 0)}</Text>
              </View>
            </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            fontFamily: 'Poppins Medium',
            fontSize: 16,
            marginTop: '10px',
            paddingVertical: '10px',
            paddingHorizontal: '10px',
            borderTop: '1px solid #ccc',
            borderBottom: '1px solid #ccc',
          }}
        >
          <Text>Grand Total:</Text>
          <Text>{currencySymbol}{costData.totalcost}</Text>
        </View>

      </View>


      </Page>
    </Document>


  );
};


const ExportCompMediate = ({tripDetails, metadata, pckList, costData, currencySymbol}:PDFprops) => {
  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 gap-6">

  <PDFDownloadLink
    document={<TripPdfFormat currencySymbol={currencySymbol} tripDetails={tripDetails} metadata={metadata} pckList={pckList} costData={costData} />}
    fileName={`${metadata.destination} Trip Plan.pdf`}
  >
    <button className="flex items-center justify-center cursor-pointer bg-white rounded-full h-14 px-6 border border-gray-300 hover:bg-gray-100 transition-colors duration-200">
      <span className="material-icons text-2xl text-gray-700">picture_as_pdf</span>
      <span className="ml-3 text-gray-700 text-base font-medium">Export as PDF</span>
    </button>
  </PDFDownloadLink>

  {/* <div className="flex flex-col items-center w-full max-w-4xl mt-4 gap-2">
    <span className="text-gray-500 text-sm">or view it online:</span>
    <div className="w-full h-[600px] border border-gray-300 rounded-lg overflow-hidden">
      <PDFViewer style={{ width: '100%', height: '100%' }}>
        <TripPdfFormat
          currencySymbol={currencySymbol}
          tripDetails={tripDetails}
          metadata={metadata}
          pckList={pckList}
          costData={costData}
        />
      </PDFViewer>
    </div>
  </div> */}

</div>

  );
};

export default ExportCompMediate;
