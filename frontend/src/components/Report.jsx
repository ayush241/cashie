import React, { useState, useEffect, useContext, Fragment } from 'react';
import moment from 'moment';
import queryString from 'query-string';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from '@material-ui/core/Button';
import { CartContext } from "../App";



function Report() {
    const cartDetails = useContext(CartContext);

    const [weeklyTransactions, setWeeklyTransactions] = useState([]);
    const [queryData, setQueryData] = useState({
		start: moment().startOf("week"),
		end: moment().endOf("week"),
		limit: 20,
	});

    let query = queryString.stringify(queryData);

    const handleQueryChange = (e) => {
        if (e.target.name === "start" || e.target.name === "end") {
            let date = moment(e.target.value, "YYYY-MM-DD");
            setQueryData({ ...queryData, [e.target.name]: date });
        } else {
            setQueryData({ ...queryData, [e.target.name]: e.target.value });
        }
    };

    useEffect(() => {
		async function getWeeklyTransaction() {
			let result = await fetch(
				`${process.env.REACT_APP_BACKEND_API_URL}transaction?${query}`,
			);
			let data = await result.json();
			setWeeklyTransactions(data.data.transactions);
		}
		getWeeklyTransaction();
	}, [query]);

    return (
        <Fragment>
            <div className="dashboard-container text-start">
                <h4 className="header">Report</h4>
                <Grid container justifyContent="flex-end" className="my-3">
                    <form onChange={handleQueryChange} className="user-form">
                        <section>
                            <p className="setting-content">Start</p>
                            <TextField type="date" name="start" value={queryData.start && queryData.start.format("YYYY-MM-DD")} className="setting-input user-input me-4" InputProps={{ disableUnderline: true }} variant="filled" />
                        </section>
                        <section>
                            <p className="setting-content">End</p>
                            <TextField type="date" name="end" value={queryData.end && queryData.end.format("YYYY-MM-DD")} className="setting-input user-input me-4" InputProps={{ disableUnderline: true }} variant="filled" />
                        </section>
                        <section>
                            <p className="setting-content">Sort By</p>
                            <FormControl variant="filled" className="setting-input user-input">
                                <Select native placeholder="Role" disableUnderline inputProps={{ name: "sort" }}>
                                    <option value="Newest">Newest</option>
                                    <option value="Oldest">Oldest</option>
                                </Select>
                            </FormControl>
                        </section>
                    </form>
                </Grid>
               
                            <Table className="text-start mt-3 table " aria-label="simple table">
								<TableHead className="tableHead">
									<TableRow className="tableHead">
										<TableCell>Reciept no</TableCell>
										<TableCell align="center">Date</TableCell>
										<TableCell align="right">Quantity</TableCell>
										<TableCell align="right">Total</TableCell>
										<TableCell></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{ weeklyTransactions && weeklyTransactions.map((row) => (
										<TableRow  className="tableRow" key={row._id}>
											<TableCell component="th" scope="row">
												{row._id}
											</TableCell>
											<TableCell align="center">
												{moment(row._createdAt).format("LLL")}
											</TableCell>
											<TableCell align="right">{row.items.length}</TableCell>
											<TableCell align="right">{row.grandtotal}</TableCell>
                                            <TableCell align="right"><Button onClick={ () => cartDetails.handleOpen(row) }><VisibilityIcon /></Button></TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
                       
            </div>
        </Fragment>
    )
}

export default Report;
