import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Joi, { errors } from "joi-browser";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
	root: {
		height: "100vh",
	},
	image: {
		backgroundImage: "url(https://source.unsplash.com/random)",
		backgroundRepeat: "no-repeat",
		backgroundColor:
			theme.palette.type === "light"
				? theme.palette.grey[50]
				: theme.palette.grey[900],
		backgroundSize: "cover",
		backgroundPosition: "center",
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function Login(props) {
	const classes = useStyles();
	const [formData, setFormData] = useState({});
	const [error, setError] = useState([]);
	const [info, setInfo] = useState("");

	const handleFormChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const loginSchema = {
		username: Joi.string().required().min(8).max(30),
		password: Joi.string().required().min(7).max(30),
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		let validate = Joi.validate(formData, loginSchema);
		console.log(validate);
		if (validate.error) {
			setError(validate.error.details);
			return;
		}
		async function attemptLogin() {
			let result = await fetch(
				`${process.env.REACT_APP_BACKEND_API_URL}auth/login`,
				{
					method: "POST",
					body: JSON.stringify(formData),
					headers: {
	 					"Content-type": "application/json",
					},
				},
			);
			let data = await result.json();
			if (data.status === "success") {
				setInfo("Login successfull...");
				localStorage.setItem("token", data.token);
				props.history.push("/dashboard");
			} else {
				setError([{ message: "Authentication failed" }]);
			}
		}
		attemptLogin();
	};

	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<Typography component="h1" variant="h5">
						Login
					</Typography>
					{error.length !== true &&
						error.map((er) => <Alert severity="error">{er.message}</Alert>)}
					{info && <Alert severity="success">{info}</Alert>}

					<form
						onSubmit={handleSubmit}
						onChange={handleFormChange}
						className={classes.form}
						noValidate>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Username"
							name="username"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}>
							Sign In
						</Button>
					</form>
				</div>
			</Grid>
		</Grid>
	);
}