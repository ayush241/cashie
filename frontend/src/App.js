

import { Redirect, Route, Switch } from "react-router-dom";

import dashboard from "./screen/dashboard.jsx";
import Login from "./components/login.jsx";
import './App.css';
import ProductForm from "./components/productsForm.jsx";
import React, { useState, useEffect } from "react";
import axios from "./components/config/axiosConfig";
import Swal from 'sweetalert2';
import ReceiptModal from './components/ReceiptModal';
import Account from "./components/Account.jsx";
import Setting from "./components/Setting.jsx";
import CategoryForm from "./components/CategoryForm.jsx";
export const CartContext = React.createContext();
export const SettingContext = React.createContext();

function App() {
	const [cartItems, setCartItems] = useState([]);
	const [receiptModal, setReceiptModal] = useState(false);
	const [transactionData, setTransactionData] = useState(null);
	const [allProducts, setAllProducts] = useState(null);
	const [settings, setSettings] = useState(null);
	const [storeSettings, setStoreSettings] = useState(null);

	const subTotal = cartItems.length && cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
	const discount = storeSettings ? (+storeSettings.discount / 100) * subTotal : 0;
	const tax = storeSettings ? (+storeSettings.tax / 100) * subTotal : 0;
	const grandTotal = subTotal + tax - discount;

	const updateCartItems = (id) => {
		let index = cartItems.findIndex((item) => item._id === id);
		if (index === -1) {
			let product = allProducts.find((product) => product._id === id);
			product.qty = 1;
			product.price = +product.price;
			setCartItems([...cartItems, product]);
		} else {
			let newCartItems = [...cartItems];
			newCartItems.splice(index, 1);
			setCartItems(newCartItems);
		}
	};
	const deleteCartItem = (id) => {
		let index = cartItems.findIndex((item) => item._id === id);
		let newCartItems = [...cartItems];
		newCartItems.splice(index, 1);
		setCartItems(newCartItems);
	};
	const deleteAllCartItems = (params) => {
		setCartItems([]);
	};

	const updateQuantity = (id, type) => {
		let index = cartItems.findIndex((item) => item._id === id);
		let updatedCart = [...cartItems];
		if (type === "increment") {
			updatedCart[index]["qty"]++;
			setCartItems(updatedCart);
			return;
		} else if (type === "decrement") {
			if (updatedCart[index]["qty"] === 1) return;
			updatedCart[index]["qty"]--;
			setCartItems(updatedCart);
		}
	};
	const handleSubmit = () => {
		let data = {
			items: cartItems,
			subtotal: subTotal,
			grandtotal: grandTotal,
			discount
		};
		axios({
			method: "POST",
			url: `${process.env.REACT_APP_BACKEND_API_URL}transaction`,
			data: data,
		}).then((result) => {
			if (result.data.status === "success") {
				setCartItems([]);
				setReceiptModal(true);
				setTransactionData(result.data.data);
			} else {
				Swal.fire("Error", "Something went wrong", "error");
			}
		}).catch((err) => {
			Swal.fire("Error", "Something went wrong", "error");
		});
	};
	const handleOpen = (transaction) => {
		console.log("yay");
		setTransactionData(transaction);
		setReceiptModal(true);
	};
	const handleClose = () => {
		setReceiptModal(false);
	};

	async function verifyToken(token) {
		let result = await axios(`auth/checktoken`);
		return result.status === 200;
	}

	useEffect(() => {
		axios("product?limit=100000").then((result) =>
			setAllProducts(result.data.data.products),
		);
		axios("setting").then((result) => setSettings(result.data.data));
	}, []);
	return (
		<div className="App">
			<CartContext.Provider
				value={{
					cartItems,
					updateCartItems,
					updateQuantity,
					deleteCartItem,
					deleteAllCartItems,
					handleOpen,
					handleSubmit
				}}>

				<SettingContext.Provider value={settings}>
					<Switch>
						<Route path="/dashboard" component={dashboard} />
							{/* <Route
							path="/dashboard"
							render={(props) => {
								let token = localStorage.getItem("token");
								
								                                   
								if (token && verifyToken(token))
									return <Dashboard {...props} />;
								return <Redirect to="/login" />;
							}}></Route> */}
						<Route path="/" exact component={Login} />
						<Route path="/account" exact component={Account} />
						<Route path="/setting" exact component={Setting} />
						<Route exact path="/create" component={CategoryForm} />



						{/* <Redirect from="/" to="page-not-found"/> */}


					</Switch>
				</SettingContext.Provider>
			</CartContext.Provider>
			<ReceiptModal isOpen={receiptModal} onClose={handleClose} onOpen={handleOpen} transactionData={transactionData} />
		</div>
	);
}

export default App;
