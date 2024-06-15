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
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';


import { api } from 'src/utils/urlApi';

import Iconify from 'src/components/iconify';
import func from 'src/utils/fetchapi';
import Label from 'src/components/label';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState();
  const [booking, setBooking] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    checkInDate: '',
    checkOutDate: '',
  });
  const [dateError, setDateError] = useState({
    checkInError: '',
    checkOutError: '',
    phoneNumberError:""
  });
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [page, setPage] = useState(1);
  const [query , setQuery] = useState(''); 
  const [filteredRooms , setFilteredRooms] = useState([]) ;
  const itemsPerPage = 6;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name ==='phoneNumber'){
      const phoneRegex =  /^(03)\d{8}$/ ; 
      if(!phoneRegex.test(value)){
        setDateError((prevState) => ({
          ...prevState,
          phoneNumberError: 'Numero invalide',
        }));
        setSubmitDisabled(true);
      }
      else {
        setDateError((prevState) => ({ ...prevState, phoneNumberError: '' }));
        setSubmitDisabled(false);
      }
    }
    if (name === 'checkInDate') {
      if (new Date(value) < new Date()) {
        setDateError((prevState) => ({
          ...prevState,
          checkInError: 'Date invalide',
        }));
        setSubmitDisabled(true);
      } else {
        setDateError((prevState) => ({ ...prevState, checkInError: '' }));
        setSubmitDisabled(false);
      }
    } else if (name === 'checkOutDate') {
      if (new Date(value) <= new Date(booking.checkInDate)) {
        setDateError((prevState) => ({
          ...prevState,
          checkOutError: 'date invalide',
        }));
        setSubmitDisabled(true);
      } else {
        setDateError((prevState) => ({ ...prevState, checkOutError: '' }));
        setSubmitDisabled(false);
      }
    }
    setBooking((prevData) => ({ ...prevData, [name]: value }));
  };

  const showDialog = (room) => {
    setShow(!show);
    setSelectedRoom(room);
  };
  const closeDialog = () => {
    setShow(false); 
    setBooking({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      checkInDate: '',
      checkOutDate: '',
    });
  };
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleSearchChange = (e)=> { 
    setQuery(e.target.value)
  }
  const handleSumbit = async (roomId) => {
    try {
      const data = {
        first_name: booking.firstName,
        last_name: booking.lastName,
        email: booking.email,
        phone_number: booking.phoneNumber,
        room_id: roomId,
        check_in_date: booking.checkInDate,
        check_out_date: booking.checkOutDate,
        is_paid: false,
      };
      console.log(data);
      const response = await func.post(`${api}/reservation`, data);
      setBooking({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        checkInDate: '',
        checkOutDate: '',
      });
      closeDialog();
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await func.getAll(`${api}/room`);
        setRooms(roomsData);
        setFilteredRooms(roomsData)
      } catch (err) {
        console.error(err);
      }
    };
    fetchRooms();
  }, []);
  useEffect(()=> {
    const filtered = rooms.filter(room =>
      room.room_type.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRooms(filtered);
  },[rooms , query])
  return (
    <>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Chambres
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
            Nouveau
          </Button>
        </Stack>
        <Grid container>
          <OutlinedInput
            value={query}
            onChange={handleSearchChange}
            placeholder='checher par types'
            startAdornment ={
              <InputAdornment position='start'>
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled', width: 20, height: 20 }}
                />
              </InputAdornment>
            }
          /> 
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Capacté</TableCell>
                  <TableCell>Prix(Nuité)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRooms.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.id}</TableCell>
                    <TableCell>{room.room_type.name}</TableCell>
                    <TableCell>{room.room_type.capacity}</TableCell>
                    <TableCell>{room.room_type.price} Ariary</TableCell>
                    <TableCell>
                      {room.is_available ? (
                        <Label onClick={() => showDialog(room)} color="success">
                          Reserver
                        </Label>
                      ) : (
                        <Label color="error">Occupé</Label>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={handleOpenMenu}>
                        <Iconify icon="eva:more-vertical-fill" />
                      </IconButton>
                    </TableCell>
                    <Popover
                      open={!!open}
                      anchorEl={open}
                      onClose={handleCloseMenu}
                      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      PaperProps={{
                        sx: { width: 140 },
                      }}
                    >
                      <MenuItem onClick={handleCloseMenu}>
                        <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                        Edit
                      </MenuItem>

                      <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
                        <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                        Delete
                      </MenuItem>
                    </Popover>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={Math.ceil(filteredRooms.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
          />
        </Grid>
      </Container>
      {show && (
        <Dialog open={show} onClose={closeDialog}>
          <DialogTitle>Reservation</DialogTitle>
          <DialogContent dividers sx={{ '& > :not(style)': { marginBottom: '16px' } }}>
            <DialogContentText>Veuillez remplier les informations</DialogContentText>
            <form>
              <TextField
                autoFocus
                required
                name="firstName"
                label="Nom"
                type="text"
                fullWidth
                variant="standard"
                value={booking.firstName}
                onChange={handleInputChange}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                autoFocus
                required
                name="lastName"
                label="Prenom"
                type="text"
                fullWidth
                variant="standard"
                value={booking.lastName}
                onChange={handleInputChange}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                autoFocus
                required
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="standard"
                value={booking.email}
                onChange={handleInputChange}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                autoFocus
                required
                name="phoneNumber"
                label="Telephone"
                type="text"
                fullWidth
                variant="standard"
                value={booking.phoneNumber}
                onChange={handleInputChange}
                error={!!dateError.phoneNumberError}
                helperText={dateError.phoneNumberError}
                sx={{ marginBottom: '16px' ,borderColor: dateError.checkInError ? 'red' : '' }}
              />
              <TextField
                autoFocus
                required
                name="checkInDate"
                label="Check in"
                type="date"
                fullWidth
                variant="standard"
                value={booking.checkInDate}
                onChange={handleInputChange}
                sx={{ marginBottom: '16px', borderColor: dateError.checkInError ? 'red' : '' }}
                error={!!dateError.checkInError}
                helperText={dateError.checkInError}
              />
              <TextField
                autoFocus
                required
                name="checkOutDate"
                label="Check out"
                type="date"
                fullWidth
                variant="standard"
                value={booking.checkOutDate}
                onChange={handleInputChange}
                sx={{ marginBottom: '16px', borderColor: dateError.checkOutError ? 'red' : '' }}
                error={!!dateError.checkOutError}
                helperText={dateError.checkOutError}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={closeDialog}>
              Annuler
            </Button>
            <Button
              disabled={submitDisabled}
              type="submit"
              color="primary"
              onClick={() => handleSumbit(selectedRoom.id)}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
