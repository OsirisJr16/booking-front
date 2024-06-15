import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'tableau de bord',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'reservations',
    path: '/reservations',
    icon: icon('ic_user'),
  },
  {
    title: 'chambres',
    path: '/chambres',
    icon: icon('ic_bedroom'),
  },
  {
    title:'Payments' ,
    path:'/payment' , 
    icon:icon('ic_payment')
  },
  {
    title:'type de chambres',
    path:'/type-chambres ' , 
    icon:icon('ic_bedroom')
  },
];

export default navConfig;
