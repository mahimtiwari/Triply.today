'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';



const TripPdfFormat = () => {
  return (
    <Document>
      <Page size="A4">
        <Text>Hi this is a trip planawdawdawdawdef</Text>
        <Text>Hi this is a trip plawdwfreasfrawdnef</Text>
      </Page>
    </Document>


  );
};

export default TripPdfFormat;
