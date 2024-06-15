/* eslint-disable */
import { useEffect, useState } from 'react';
import { api } from 'src/utils/urlApi';
import { useChart } from 'src/components/chart';
import func from 'src/utils/fetchapi';

export default function useBookingCountsByMonth() {
  const [bookingCountsByMonth, setBookingCountsByMonth] = useState({});
  const chartOptions = useChart();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsData = await func.getAll(`${api}/reservation`);
        const countsByMonth = {};

        bookingsData.forEach((booking) => {
          const checkInDate = new Date(booking.check_in_date);
          const month = checkInDate.getMonth() + 1;
          countsByMonth[month] = (countsByMonth[month] || 0) + 1;
        });

        setBookingCountsByMonth(countsByMonth);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);


  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];


  const seriesData = Object.keys(bookingCountsByMonth).map((month) => ({
    name: `Mois de ${monthNames[month - 1]}`, 
    data: [bookingCountsByMonth[month]],
  }));

  const updatedChartOptions = {
    ...chartOptions,
    xaxis: {
      categories: ['Total Reservations par mois'],
    },
    series: seriesData,
  };

  return updatedChartOptions;
}
