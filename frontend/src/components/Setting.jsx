import React, { useState, useEffect, Fragment } from 'react';
import Joi from 'joi-browser';
import Swal from 'sweetalert2';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Grid, Paper } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';

function Setting() {
    const [formData, setFormData] = useState({
        name: '',
        discount: '',
        tax: ''
    });
    const formSchema = {
        name: Joi.string().required().max(30).min(5),
        discount: Joi.number().required().max(100).min(0),
        tax: Joi.number().required().max(100).min(0)
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
        console.log(formData);
        e.preventDefault();

        let validation = Joi.validate(formData, formSchema, { abortEarly: false });
        if (validation.error) {
            setErrors(validation.error.details);
            return;
        }

        let id = '';
        if (Cookies.get('id')) {
            id = Cookies.get('id');
        } else if (localStorage.getItem('id')) {
            id = localStorage.getItem('id');
        }
        axios({
            method: "PUT",
            url: `${process.env.REACT_APP_BACKEND_API_URL}setting/${id}`,
            data: formData,
        }).then((result) => {
            console.log(result);
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
        async function getValues() {
            let result = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}setting`);
            let response = await result.json();
            if (response.data) {
                setFormData({
                    name: response.data.name,
                    discount: response.data.discount,
                    tax: response.data.tax
                });
            }
        }
        getValues();
    }, []);
    return (
        <Fragment>
            <div className="dashboard-container text-start">
                <h4>Update Store Setting</h4>
				<Paper className="p-4 setting-data">
                    <form onSubmit={handleSubmit} onChange={handleOnchange}>
                        <p className="setting-content">Store Name</p>
                        <TextField className="mb-3 setting-input" name="name" value={formData.name} variant="filled" required fullWidth autoFocus InputProps={{ disableUnderline: true }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={6}>
                                <p className="setting-content">Discount</p>
                                <TextField className="setting-input" name="discount" value={formData.discount} variant="filled" required fullWidth autoFocus InputProps={{ disableUnderline: true, endAdornment: <InputAdornment position="start">%</InputAdornment> }} />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <p className="setting-content">Tax</p>
                                <TextField className="setting-input" name="tax" value={formData.tax} variant="filled" required fullWidth autoFocus InputProps={{ disableUnderline: true, endAdornment: <InputAdornment position="start">%</InputAdornment> }} />
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

export default Setting;