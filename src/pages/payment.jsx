/* eslint-disable */

import React, { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Pagination from '@mui/material/Pagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { api } from 'src/utils/urlApi';
import func from 'src/utils/fetchapi';
import Label from 'src/components/label';
import { saveAs } from 'file-saver';
import { Document, Page, Text, View, StyleSheet ,pdf} from '@react-pdf/renderer';
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    backgroundColor: '#f0f0f0', 
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff', 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
});

const PaymentPDFViewer = ({ payment }) => {
  return (
    <Document>
      <Page size='A6' style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionText}>Nom : {payment.reservation.first_name}</Text>
          <Text style={styles.sectionText}>Prenom : {payment.reservation.last_name}</Text>
          <Text style={styles.sectionText}>Email : {payment.reservation.email}</Text>
          <Text style={styles.sectionText}>
            Du {payment.reservation.check_in_date} au {payment.reservation.check_out_date}
          </Text>
          <Text style={styles.sectionText}>
            Total : {parseInt(payment.total_price)} Ariary
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default function PaymentPDF() {
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const paymentData = await func.getAll(`${api}/payment`);
        setPayments(paymentData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayment();
  }, []);
  const downloadPDF = async (payment) => {
    const fileName = `Payment_${payment.id}.pdf`;
    const blob = await pdf(<PaymentPDFViewer payment={payment} />).toBlob();
    saveAs(blob, fileName);
  };
  return (
    <>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Paiements
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}></Stack>
        <Grid container>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Prenoms</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Jours</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.reservation.first_name}</TableCell>
                    <TableCell>{payment.reservation.last_name}</TableCell>
                    <TableCell>{payment.reservation.email}</TableCell>
                    <TableCell>{payment.nights}</TableCell>
                    <TableCell>{parseInt(payment.total_price)} Ariary</TableCell>
                    <TableCell>
                      <Label onClick={() => downloadPDF(payment)}>Telecharger</Label>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Container>
    </>
  );
}
