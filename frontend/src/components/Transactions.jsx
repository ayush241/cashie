import {
	Container,
	Paper,
	Grid,
	Tabs,
	Tab,
	Typography,
	Box,
	AppBar,
	Modal,
} from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import axios from "./config/axiosConfig.js";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import { CartContext, SettingContext } from "../App";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import ReciptModal from "./ReceiptModal";

function a11yProps(index) {
	return {
		id: `scrollable-auto-tab-${index}`,
		"aria-controls": `scrollable-auto-tabpanel-${index}`,
	};
}

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}
const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		padding: "10px",
		width: "100%",
		backgroundColor: theme.palette.background.paper,
	},
	cardWrapper: {
		display: "flex",
		justifyContent: "space-evenly",
		flexWrap: "wrap",
	},
	productCard: {
	    maxWidth: "16.666667%",
	 	marginTop: "15px",
	    boxSizing: "borderbox",
	    flexBasis: "16.666667%", 
        padding:" 4px",
		margin:"4px",
        height:"200px",
		   color:"#4d4d4d",
    
	},
	productsWrapper: {
		height: "85vh",
		overflowY: "auto",
		padding: "10px",
		width:"65%"
	},
	tableOne: {
		height: "60vh",
		overflowY: "auto",
	},
	recieptModal: {
		position: "fixed",
		width: "40%",
		heigh: "60vh",
		backgroundColor: "white",
	},
}));

function Transactions() {
	const cartDetails = useContext(CartContext);
	const settings = useContext(SettingContext);
	const classes = useStyles();
	const [value, setValue] = useState(0);
	const [allProducts, setAllProducts] = useState(null);
	const [productCategories, setProductCategories] = useState(null);
	const [recieptModal, setRecieptModal] = useState(false);
	const [transactionData, setTransactionData] = useState(null);

	const subTotal =
		cartDetails.cartItems.length &&
		cartDetails.cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
	const discount = settings ? (+settings.discount / 100) * subTotal : 0;
	const tax = settings ? (+settings.tax / 100) * subTotal : 0;
	const grandTotal = subTotal + tax - discount;

	async function getAllProducts() {
		let result = await axios("product/transaction");
		setAllProducts(result.data.data.all);
		setProductCategories(result.data.data.categories);
	}
	console.log(cartDetails);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const handleClose = () => {
		setRecieptModal(false);
	};
	const handleOpen = () => {
		setRecieptModal(true);
	};
	const handleSubmit = async () => {
		let { cartItems } = cartDetails;
		if (cartItems.length !== 0) {
			let response = await axios.post("transaction", {
				items: cartItems,
				subtotal: subTotal,
				grandtotal: grandTotal,
				discount,
			});
			if (response.data.status === "success") {
				cartDetails.deleteAllCartItems();
				setRecieptModal(true);
				setTransactionData(response.data.data);
			}
		}
	};
	console.log(transactionData);

	useEffect(() => {
		getAllProducts();
	}, []);
	return (
		<div>
			<h2  className="header">Transactions</h2>
			<Container>
				<Grid container>
					<Grid item sm={8} className={classes.productsWrapper}>
						<Paper>
							<AppBar position="static" color="default">
								<Tabs
									value={value}
									onChange={handleChange}
									indicatorColor="primary"
									textColor="primary"
									variant="scrollable"
									scrollButtons="auto"
									aria-label="scrollable auto tabs example">
									<Tab label="All" {...a11yProps(0)} />
									{productCategories &&
										productCategories.map((category, index) => (
											<Tab label={category.name} {...a11yProps(index + 1)} />
										))}
								</Tabs>
							</AppBar>
							<TabPanel value={value} index={0}>
								<div className={classes.cardWrapper}>
									{allProducts &&
										allProducts.map((product) => (
											<Card
												onClick={() => cartDetails.updateCartItems(product._id)}
												className={classes.productCard}>
												<CardActionArea>
													<CardMedia
														component="img"
														alt={product.description}
														height="80"
														image={product.image}
													/>
													<CardContent>
														<Typography
															gutterBottom
														
	                                                        className="card-name"
															component="h6">
															{product.name}
														</Typography>
														
													</CardContent>
												</CardActionArea>
												<CardActions>
													<Typography 
													gutterBottom 
													className="card-price"
													component="h6">
														$ &nbsp;{product.price}
													</Typography>
												</CardActions>
											</Card>
										))}
								</div>
							</TabPanel>
							
						</Paper>
					</Grid>
					<Grid item sm={4} xs={12}>
						<Paper>
							<div
								style={{ height: "40vh", overflowY: "auto" }}
								className="tableOne">
								<Table aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell align="left">Product</TableCell>
											<TableCell align="center">Quantity</TableCell>
											<TableCell align="right">Total</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{cartDetails.cartItems.length &&
											cartDetails.cartItems.map((item) => (
												<TableRow key={item._id}>
													<TableCell align="left">
														<DeleteOutlineIcon
															onClick={() =>
																cartDetails.deleteCartItem(item._id)
															}
															color=""
															size="small"
														/>
														&nbsp;{item.name} {item.price}
													</TableCell>
													<TableCell align="center">
														<RemoveCircleOutlineIcon
															color="secondary"
															onClick={() =>
																cartDetails.updateQuantity(
																	item._id,
																	"decrement",
																)
															}
														/>

														{item.qty}

														<AddCircleOutlineIcon
															color="secondary"
															onClick={() =>
																cartDetails.updateQuantity(
																	item._id,
																	"increment",
																)
															}
														/>
													</TableCell>
													<TableCell align="right">
														${(item.qty * item.price).toFixed(2)}
													</TableCell>
												</TableRow>
											))}
									</TableBody>
								</Table>
							</div>
							<Table>
								<TableRow>
									<TableCell>Sub Total</TableCell>
									<TableCell align="right">{subTotal.toFixed(2)}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Discount</TableCell>
									<TableCell align="right">{discount.toFixed(2)}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Tax</TableCell>
									<TableCell align="right">{tax.toFixed(2)}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Grand Total</TableCell>
									<TableCell align="right">{grandTotal.toFixed(2)}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell align="left">
										<Button
											variant="contained"
											color="default"
											disabled={cartDetails.cartItems.length === 0}>
											Cancel
										</Button>
									</TableCell>
									<TableCell align="right">
										<Button
											disabled={cartDetails.cartItems.length === 0}
											variant="contained"
											color="default"
											size="large"
											className="c-btn"
											onClick={handleSubmit}>
											Pay
										</Button>
									</TableCell>
								</TableRow>
							</Table>
						</Paper>
					</Grid>
				</Grid>
			</Container>
			<ReciptModal
				isOpen={recieptModal}
				onClose={handleClose}
				onOpen={handleOpen}
				transactionData={transactionData}
			/>
		</div>
	);
}

export default Transactions;