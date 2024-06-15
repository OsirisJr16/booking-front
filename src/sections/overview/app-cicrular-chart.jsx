/* eslint-disable */
import { useEffect, useState } from 'react';
import { api } from 'src/utils/urlApi';
import func from 'src/utils/fetchapi';
import ApexChart from 'react-apexcharts';

export default function PaymentCircularChart() {
  const [payments, setPayments] = useState([]);
  const [reservation, setReservation] = useState([]);
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
    const fecthReservation = async () => {
      try {
        const bookingData = await func.getAll(`${api}/reservation`);
        setReservation(bookingData);
      } catch (err) {
        console.error(err);
      }
    };
    fecthReservation();
  }, []);
  const paidCount = payments.length;
  const unpaidCount = reservation.length - paidCount;

  const options = {
    chart: {
      type: 'pie',
      width: '100%',
    },
    labels: ['Payé', 'Non Payé'],
    series: [paidCount, unpaidCount],
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ApexChart options={options} series={options.series} type="pie" width="500" />
      </div>
    </>
  );
}
