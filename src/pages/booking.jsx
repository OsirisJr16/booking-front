/* eslint-disable */
import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { api } from 'src/utils/urlApi';

import Iconify from 'src/components/iconify';
import func from 'src/utils/fetchapi';
import Label from 'src/components/label';
import TextField from '@mui/material/TextField';

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState();
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsData = await func.getAll(`${api}/reservation`);
        setBookings(bookingsData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, []);
  const calculateNumberOfDays = (checkInDate, checkOutDate) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay));
    return diffDays;
  };
  const closeDialog = () => {
    setShow(false);
  };
  const showDialog = (booking) => {
    setShow(!show);
    setSelectedBooking(booking);
  };

  const handleSubmit = async (reservationId) => {
    try {
      const data = {
        total_price:
          selectedBooking.room.room_type.price *
          calculateNumberOfDays(selectedBooking.check_in_date, selectedBooking.check_out_date),
        nights: calculateNumberOfDays(
          selectedBooking.check_in_date,
          selectedBooking.check_out_date
        ),
        reservation_id: reservationId,
      };
      const response = await func.post(`${api}/payment`, data);
      closeDialog();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Reservations
        </Typography>
        <Grid container>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Prenom</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Tel</TableCell>
                  <TableCell>Chambres</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Check in</TableCell>
                  <TableCell>Check out</TableCell>
                  <TableCell>Jours</TableCell>
                  <TableCell>Total a payer</TableCell>
                  <TableCell>Payé</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.first_name}</TableCell>
                    <TableCell>{booking.last_name}</TableCell>
                    <TableCell>{booking.email}</TableCell>
                    <TableCell>{booking.phone_number}</TableCell>
                    <TableCell>{booking.room_id}</TableCell>
                    <TableCell>{booking.room.room_type.name}</TableCell>
                    <TableCell>{booking.check_in_date}</TableCell>
                    <TableCell>{booking.check_out_date}</TableCell>
                    <TableCell>
                      {calculateNumberOfDays(booking.check_in_date, booking.check_out_date)} jours
                    </TableCell>
                    <TableCell>
                      {booking.room.room_type.price *
                        calculateNumberOfDays(booking.check_in_date, booking.check_out_date)}{' '}
                      Ariary
                    </TableCell>
                    <TableCell>
                      {!booking.is_paid ? (
                        <Label onClick={() => showDialog(booking)} color="error">
                          Regler
                        </Label>
                      ) : (
                        <Label color="success">Payé</Label>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Container>
      {show && (
        <Dialog open={show} onClose={closeDialog}>
          <DialogTitle>Confirmation Payment</DialogTitle>
          <DialogContent dividers sx={{ '& > :not(style)': { marginBottom: '16px' } }}>
            <DialogContentText>
              Nom et prénoms du client : {selectedBooking.first_name} {selectedBooking.last_name}
            </DialogContentText>
            <form>
              <TextField
                disabled
                label="Nombre de jours"
                value={calculateNumberOfDays(
                  selectedBooking.check_in_date,
                  selectedBooking.check_out_date
                )}
                fullWidth
                variant="standard"
                sx={{ marginBottom: '16px' }}
              />
              <TextField 
                disabled 
                label="Type de chambre"
                value={selectedBooking.room.room_type.name}
                fullWidth 
                variant='standard'
                sx={{marginBottom:'16px'}}
              />
              <TextField
                disabled
                label="Prix Nuité (en Ariary)"
                value={selectedBooking.room.room_type.price}
                fullWidth
                variant='standard'
                sx={{marginBottom:'16px'}}
              />
              <TextField
                disabled
                label="Total a payer (en Ariary)"
                value={
                  selectedBooking.room.room_type.price *
                  calculateNumberOfDays(
                    selectedBooking.check_in_date,
                    selectedBooking.check_out_date
                  )
                }
                fullWidth
                variant="standard"
                sx={{ marginBottom: '16px' }}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={closeDialog}>
              Annuler
            </Button>
            <Button onClick={() => handleSubmit(selectedBooking.id)} color="primary">
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
