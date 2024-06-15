/* eslint-disable */
import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import Iconify from 'src/components/iconify';
import func from 'src/utils/fetchapi';
import { api } from 'src/utils/urlApi';

export default function RoomsTypes() {
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const roomsTypesData = await func.getAll(`${api}/room-types`);
        setRoomTypes(roomsTypesData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoomTypes();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Types de chambres
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Nouveau
        </Button>
      </Stack>
      <Grid  container spacing={3}>
        {roomTypes.map((roomType) => (
          <Card style={{cursor : 'pointer'}} key={roomType.id} sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 140 }}
              image="/assets/illustrations/bedroom.svg"
              title="bedroom"
            ></CardMedia>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {roomType.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prix : {roomType.price} Ariary
              </Typography>
              <Typography> 
                Capcité : {roomType.capacity}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}
