import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { FormControl, Select, InputLabel, Paper } from "@material-ui/core";
import Joi from "joi-browser";
import Swal from "sweetalert2";
import axios from "axios";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PhotoIcon from "@material-ui/icons/Photo";

const useStyles = makeStyles((theme) => ({
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
		padding: "20px",
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function ProductForm(props) {
	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState(null);
	const [method, setMethod] = useState("POST");
	const [categories, setCategories] = useState(null);
	const [productImage, setProductImage] = useState(null);
	const classes = useStyles();
	const handleFormChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	useEffect(() => {
		props.match.params.id &&
			axios
				.get(
					`${process.env.REACT_APP_BACKEND_API_URL}product/${props.match.params.id}`,
				)
				.then((result) => {
					if (result.data.status === "success") {
						let {
							name,
							price,
							description,
							image: hidden,
							category,
						} = result.data.data;
						setFormData({
							...formData,
							name,
							price,
							description,
							hidden,
							category,
						});

						// setFormData(result.data.data);
						setMethod("PUT");
					}
				});
	}, []);

	useEffect(() => {
		axios(`${process.env.REACT_APP_BACKEND_API_URL}category`).then((result) =>
			setCategories(result.data.data.categories),
		);
	}, []);

	const formSchema = {
		name: Joi.string().required().min(3).max(50),
		price: Joi.number().required().max(1000000000000),
		description: Joi.string().required().min(7).max(500),
		category: Joi.string().required().min(7).max(30),

		hidden: Joi.string(),
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		//validate the request
		let validation = Joi.validate(formData, formSchema, { abortEarly: false });
		if (validation.error) {
			setErrors(validation.error.details);
			return;
		}

		//if form data contains files
		let i = new FormData();
		for (let x in formData) {
			if (x === "price") {
				i.append("price", +formData[x]);
			} else i.append(x, formData[x]);
		}

		//image exist we will append thats to From data
		productImage && i.append("image", productImage);

		//make post request to server
		axios({
			method,
			url: `${process.env.REACT_APP_BACKEND_API_URL}${
				method === "PUT" ? "product/" + props.match.params.id : "product"
			}`,
			data: i,
			headers: {
				"Content-type": "multipart/formData",
			},
		})
			.then((result) => {
				if (result.status === 200) {
					setErrors(null);
					Swal.fire(
						`Product ${
							method === "PUT" ? "updated" : "created"
						} successfully...`,
					);
					props.history.goBack();
				} else {
					Swal.fire("Error", "Somethings went wrong", "error");
				}
			})
			.catch((err) => {
				Swal.fire("Error", "Somethings went wrong", "error");
			});
	};

	const handleUpload = (e) => {
		let fileReader = new FileReader();
		fileReader.readAsDataURL(e.target.files[0]);
		fileReader.onload = function (fileEvent) {
			setProductImage(fileEvent.target.result);
		};
	};
	console.log(errors);

	return (
		<Container>
			<Grid container className="mt-5">
				<Button onClick={() => props.history.goBack()} variant="default">
					<ArrowBackIcon /> Back
				</Button>
			</Grid>
			<Paper>
				<div className={classes.paper}>
					<form
						onSubmit={handleSubmit}
						onChange={handleFormChange}
						className={classes.form}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									name="name"
									variant="outlined"
									fullWidth
									id="firstName"
									placeholder="Product Name"
									value={formData && formData.name}
									autoFocus
								/>
								{errors &&
									errors
										.filter((err) => err.context.key === "name")
										.map((error) => (
											<p className="form-errors">{error.message}</p>
										))}
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									fullWidth
									type="number"
									placeholder="Price"
									name="price"
									value={formData && formData.price}
								/>
								{errors &&
									errors
										.filter((err) => err.context.key === "price")
										.map((error) => (
											<p className="form-errors">{error.message}</p>
										))}
							</Grid>
							<Grid item xs={12}>
								<TextField
									autoComplete="fname"
									name="description"
									variant="outlined"
									fullWidth
									multiline
									rows={3}
									id="firstName"
									placeholder="Product description"
									autoFocus
									value={formData && formData.description}
								/>
								{errors &&
									errors
										.filter((err) => err.context.key === "description")
										.map((error) => (
											<p className="form-errors">{error.message}</p>
										))}
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<FormControl variant="outlined" fullWidth className="mt-3">
								<Select
									native
									placeholder="Category"
									inputProps={{
										name: "category",
										id: "outlined-age-native-simple",
										shrink: false,
									}}>
									<option aria-label="None" value="" />
									{categories &&
										categories.map((category) => (
											<option
												selected={formData.category === category._id}
												key={category._id}
												value={category._id}>
												{category.name}
											</option>
										))}
								</Select>
								{errors &&
									errors
										.filter((err) => err.context.key === "category")
										.map((error) => (
											<p className="form-errors">{error.message}</p>
										))}
							</FormControl>
						</Grid>
						<Grid container justifyContent="flex-start" className="my-3">
							<label htmlFor="icon-button-file">
								<Button
									variant="contained"
									className="c-btn"
									color="primary"
									component="span">
									<PhotoIcon /> &nbsp; Upload Image
								</Button>
							</label>
							<input
								onChange={handleUpload}
								name="hidden"
								accept="image/*"
								className="d-none"
								id="icon-button-file"
								type="file"
							/>
							{(productImage || formData.hidden) && (
								<img
									style={{ width: "200px", marginLeft: "100px" }}
									src={productImage ? productImage : formData.hidden}></img>
							)}
						</Grid>
						<Button
							type="submit"
							variant="contained"
							size="large"
							color="primary"
							className="c-btn mt-5">
							{method === "POST" ? "Create Product" : "Update Product"}
						</Button>
					</form>
				</div>
			</Paper>
		</Container>
	);
}