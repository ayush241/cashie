import React, { useState, useEffect, Fragment } from 'react';
import Cookies from 'js-cookie';
import Joi from 'joi-browser';
import Swal from 'sweetalert2';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import { Grid, Paper } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function Account(props) {
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        email: '',
        password: ''
    });
    const formSchema = {
        fullname: Joi.string().required().max(30).min(7),
        username: Joi.string().required().max(30).min(7),
        email: Joi.string().email().required().max(30).min(7),
        password: Joi.string().required().max(30).min(7)
    };
    const [errors, setErrors] = useState([]);

    const handleOnchange = (e) => {
        let newFormData = {...formData}; 
        newFormData[e.target.name] = e.target.value;       
        setFormData(newFormData);

        let validation = Joi.validate(newFormData, formSchema);
        if (validation.error) {
            setErrors(validation.error.details);
        } else {
            setErrors([]);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        let validation = Joi.validate(formData, formSchema, { abortEarly: false });
        if (validation.error) {
            setErrors(validation.error.details);
            return;
        }

        let id = '';
        if (Cookies.get('user')) {
            id = JSON.parse(Cookies.get('user'))._id;
        } else if (localStorage.getItem('user')) {
            id = JSON.parse(localStorage.getItem('user'))._id;
        }

        axios({
            method: "PUT",
            url: `${process.env.REACT_APP_BACKEND_API_URL}user/${id}`,
            data: formData,
        }).then((result) => {
            if (result.data.status === "success") {
                setErrors([]);
                Swal.fire(
                    "User updated successfully",
                );
            } else {
                Swal.fire("Error", "Something went wrong", "error");
            }
        }).catch((err) => {
            Swal.fire("Error", "Something went wrong", "error");
        });
    };

    useEffect(() => {
        let id = '';
        if (Cookies.get('user')) {
            id = JSON.parse(Cookies.get('user'))._id;
        } else if (localStorage.getItem('user')) {
            id = JSON.parse(localStorage.getItem('user'))._id;
        }

        async function getValues() {
            let result = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}user/${id}`);
            let response = await result.json();
            if (response.data) {
                setFormData({
                    fullname: response.data.fullname,
                    username: response.data.username,
                    email: response.data.email,
                    password: ''
                });
            }
        }
        getValues();
    }, []);
    return (
        <Fragment>
            <div className="dashboard-container text-start">
                <h4>Update Account</h4>
				<Paper className="p-4 setting-data">
                    <form onSubmit={handleSubmit} onChange={handleOnchange}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={6}>
                                <p className="setting-content">Full Name</p>
                                <TextField className="setting-input" name="fullname" value={formData.fullname} variant="filled" required fullWidth autoFocus InputProps={{ disableUnderline: true }} />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <p className="setting-content">Username</p>
                                <TextField className="setting-input" name="username" value={formData.username} variant="filled" required fullWidth autoFocus InputProps={{ disableUnderline: true }} />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <p className="setting-content">Email Address</p>
                                <TextField className="setting-input" name="email" value={formData.email} variant="filled" required fullWidth autoFocus InputProps={{ disableUnderline: true }} />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <p className="setting-content">Password</p>
                                <TextField className="setting-input" name="password" value={formData.password} variant="filled" type="password" required fullWidth autoFocus InputProps={{ disableUnderline: true }} />
                            </Grid>
                        </Grid>
                        <div className="text-end mt-4">
                            <Button className="setting-submit" type="submit" variant="contained" color="primary">Submit</Button>
                        </div>
                    </form>
				</Paper>
            </div>
            <div className="error">
                { errors.length !== 0 && errors.map((error) => (
                    <Alert severity="error" className="m-1" key={error.message}>{error.message}</Alert>
                ))}
            </div>
        </Fragment>
    )
}

export default Account;