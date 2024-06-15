/* eslint-disable */
import { useEffect, useState } from 'react';
import { api } from 'src/utils/urlApi';
import func from 'src/utils/fetchapi';
import ApexChart from 'react-apexcharts';

export default function BookingActif() {
  const [reservation, setReservation] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const bookingData = await func.getAll(`${api}/reservation`);
        setReservation(bookingData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReservations();
  }, []);
  const countActiveReservations = reservation.filter(
    (booking) => new Date(booking.check_out_date) >= new Date()
  ).length;

  const countNonActiveReservations = reservation.filter(
    (booking) => new Date(booking.check_out_date) < new Date()
  ).length;
  const options = {
    chart: {
      type: 'pie',
      width: '100%',
    },
    labels: ['Reservation non active', 'Reservation active'],
    series: [countNonActiveReservations, countActiveReservations],
  };
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ApexChart options={options} series={options.series} type="pie" width="500" />
      </div>
    </>
  );
}
