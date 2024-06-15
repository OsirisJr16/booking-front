/* eslint-disable */
import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import AppWidgetSummary from '../app-widget-summary';

import func from 'src/utils/fetchapi';
import { api } from 'src/utils/urlApi';
import BookingCountsByMonthChart from '../app-booking-chart';
import PaymentCircularChart from '../app-cicrular-chart';
import BookingActif from '../app-booking-actif-chart';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function AppView() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [freeRooms, setFreeRooms] = useState([]);
  const [sumPayments, setSumPayments] = useState(0);
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
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const room = await func.getAll(`${api}/room`);
        setRooms(room);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoom();
  }, []);
  useEffect(() => {
    const freeRoomsList = rooms.filter((room) => room.is_available);
    setFreeRooms(freeRoomsList);
  }, [rooms]);
  useEffect(() => {
    const paymentsTotal = payments.map((payment) => parseInt(payment.total_price));
    setSumPayments(paymentsTotal.reduce((acc, cur) => acc + cur, 0));
    console.log(paymentsTotal.reduce((acc, cur) => acc + cur, 0))
  }, [payments]);
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('fr-FR', options);
  const roomTypeCounts = bookings.reduce((counts, reservation) => {
    const roomType = reservation.room.room_type.name;
    counts[roomType] = (counts[roomType] || 0) + 1;
    return counts;
  }, {});
  const roomTypeCountsArray = Object.entries(roomTypeCounts).map(([name, count]) => ({
    name,
    count,
  }));
  roomTypeCountsArray.sort((a, b) => b.count - a.count);
  const top3RoomTypes = roomTypeCountsArray.slice(0, 3);
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Bonjour👋
      </Typography>
      <Typography variant="h5" sx={{ mb: 5 }}>
        {formattedDate}
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Chiffres d'affaires(Ariary)"
            total={parseInt(sumPayments)}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/growth.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Reservations"
            total={bookings.length}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/booking.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Chambres"
            total={rooms.length}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/bed.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Chambres Libres"
            total={freeRooms.length}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/bed.png" />}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <Card>
            <CardHeader title="Stats reservation" />
            <Box sx={{ p: 3, pb: 1 }}>
              <BookingCountsByMonthChart />
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <Card>
            <CardHeader title="Stats Paiement" />
            <Box sx={{ p: 3, pb: 1 }}>
              <PaymentCircularChart />
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <Card>
            <CardHeader title="Stats reservations active et non actives" />
            <Box sx={{ p: 3, pb: 1 }}>
              <BookingActif />
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <Card>
            <CardHeader title="Types de chambre les plus réservés" />
            <List>
              {top3RoomTypes.map((roomType, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${roomType.name}: ${roomType.count} Reservations`} />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
