import React, { useEffect, useState } from "react";
import moment from "moment";
import queryString from "query-string";
import { Container, Grid, Paper } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import "../index.css";
import PhonelinkLockIcon from '@material-ui/icons/PhonelinkLock';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

 const useStyles = makeStyles({
  table: {},
  chart: {},
 
  
}); 




const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};
function DashboardPanel() {
    const classes = useStyles();
  const [queryData, setqueryData] = useState({
    start: moment().startOf("week").format("llll"),
    end: moment().endOf("week").format("llll"),
    limit:5
});
  const [dashboardData, setDashboardData] = useState(null);
  const [WeeklyTransaction, setWeeklyTransaction] = useState(null)
  let query = queryString.stringify(queryData);
  let weeklyIncome = [];
   if(dashboardData){
     for(let i =1;i<=7;i++){
       let index =dashboardData.data.items.findIndex((item)=> item._id==i);
       if(index===-1)weeklyIncome.push(0);
       else weeklyIncome.push(dashboardData.data.items[index]["grandtotal"])
     }
   }
   console.log(weeklyIncome)
   console.log(dashboardData);
  const data = {
  labels: ["Sun", "Mon", "Tue", "Wed", "Thr", "fri","sat"],
  datasets: [
    {
      label: "# of Votes",
      
      data:weeklyIncome,
      fill: false,
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgba(255, 99, 132, 0.2)",
    },
  ],
};
  
  
  
  useEffect(() => {
    let startOfWeek = moment().startOf("week").format();
    let endOfWeek = moment().endOf("week").format();
    async function getdashboardData() {
      let result = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}transaction/dashboard?${query}`
      );
      let data = await result.json();
     
      setDashboardData(data);
    }
    getdashboardData();
  }, []);
  
  useEffect(() => {
      async function getWeeklyTransaction(){
        let result=await axios(
              `${process.env.REACT_APP_BACKEND_API_URL}transaction?${query}`
          );
          setWeeklyTransaction(result.data.data.transactions)
      }
      getWeeklyTransaction();
  }, [])

  return (
    <div className="dashBoardPannel">
     <Container>
          <h2 className="DashBoardPanel-header">Dashboard</h2>
      <Grid container>
        <Grid items xs={12} lg={4}>
          <Paper className="m-red-card">
            <div className="m-red-card-content">
                <div className="m-red-card-data">
                  {dashboardData && dashboardData.data.count}
                    </div>
                <span className="m-red-card-content-t">Transaction</span>
            
            </div>
            <div className="m-red-card-image" ><PhonelinkLockIcon className="card-icon" /></div>
          </Paper>
        </Grid>

        <Grid items xs={12} lg={4}>
          <Paper className="m-purple-card">
               <div className="m-purple-card-content">
                <div className="m-purple-card-data">
                   {Math.round(dashboardData && dashboardData.data.total, 2)} </div> 
                     <span className="m-purple-card-content-t">Income</span>
                     </div>
                     <div className="m-purple-card-image" ><LocalAtmIcon className="card-icon" /></div>
               
          </Paper>
        </Grid>

        <Grid items xs={12} lg={4}>
          <Paper className="m-marron-card">
              <div className="m-marron-card-content">
                <div className="m-marron-card-data">
            {dashboardData&& dashboardData.data.qty}</div>
            <span className="m-marron-card-content-t">Products</span>
                     </div>
                     <div className="m-marron-card-image" ><AccountBalanceWalletIcon className="card-icon" /></div>
          </Paper>
        </Grid>
        <Grid container className="dashBoard-content">
          <Grid item lg={6} sm={12} >
            <Paper className="dashBoard-first-content">
				<h2 className="dashBoard-first-content-header">Weekly Chart</h2>
              <Line classname={classes.chart} data={data} options={options} />
            </Paper>
          </Grid>
          <Grid  item lg={6} sm={12} className="dashBoardSecond-content">
            <Paper className="dashBoard-second-content">
				<h2 className="dashBoard-second-content-header">Recent Transiction</h2>
                 <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Reciept no.</TableCell>
            <TableCell align="left">Date</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="center">Total</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
		
          {WeeklyTransaction&&WeeklyTransaction.map((row) => (
            <TableRow key={row._id}>
              <TableCell component="th" scope="row">
                {row._id}
              </TableCell>
             
              <TableCell align="right">{moment(row._createdAt).format('LLL')}</TableCell>
              <TableCell align="center">{row.items.length}</TableCell>
              <TableCell align="center">{row.grandtotal.toFixed(2)}</TableCell>
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
            </Paper>

          </Grid>
        </Grid>
      </Grid>
     </Container>
    </div>
  );
}

export default DashboardPanel;