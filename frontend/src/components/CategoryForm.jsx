import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import Joi from 'joi-browser';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Grid, Paper } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Alert from '@material-ui/lab/Alert';

function CategoryForm(props) {
    let params = useParams();

    const [formData, setFormData] = useState({
        name: ''
    });
    const formSchema = {
        name: Joi.string().required().max(30).min(3)
    };
    const [errors, setErrors] = useState([]);
    const [method, setMethod] = useState("POST");

    const handleOnchange = (e) => {
        let newFormData = { ...formData };
        newFormData[e.target.name] = e.target.value;
        setFormData(newFormData);

        let validation = Joi.validate(newFormData, formSchema);
        if (validation.error) {
            setErrors(validation.error.details);
        } else {
            setErrors([]);
        }
    };
    const handleBackwards = () => {
        props.history.goBack();
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        let validation = Joi.validate(formData, formSchema, { abortEarly: false });
        if (validation.error) {
            setErrors(validation.error.details);
            return;
        }

        axios({
            method,
            url: `${process.env.REACT_APP_BACKEND_API_URL}${method === "PUT" ? "category/" + props.match.params.id : "category"
                }`,
            data: formData,
        }).then((result) => {
            if (result.data.status === "success") {
                setErrors([]);
                Swal.fire(
                    `User ${method === "PUT" ? "updated" : "created"} successfully`,
                );
                props.history.goBack();
            } else {
                Swal.fire("Error", "Something went wrong", "error");
            }
        }).catch((err) => {
            Swal.fire("Error", "Something went wrong", "error");
        });
    };

    useEffect(() => {
        async function getValues(id) {
            let result = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}category/${id}`);
            let response = await result.json();
            if (response.data) {
                setFormData({
                    name: response.data.name
                });
            }
        }
        if (params.id) {
            setMethod('PUT');
            getValues(params.id);
        }
    }, [params.id]);

    return (
        <Fragment>
            <div className="dashboard-container text-start">
                <h4><ArrowBackIcon onClick={handleBackwards} className="back-icon" />&ensp;Form Category</h4>
                <Paper className="p-4 setting-data">
                    <form onSubmit={handleSubmit} onChange={handleOnchange}>
                        <Grid container>
                            <p className="setting-content">Category Name</p>
                            <TextField className="setting-input" name="name" value={formData.name} variant="filled" required fullWidth autoFocus InputProps={{ disableUnderline: true }} />
                        </Grid>
                        <div className="text-end mt-4">
                            <Button className="setting-submit" type="submit" variant="contained" color="primary">Submit</Button>
                        </div>
                    </form>
                </Paper>
            </div>
            <div className="error">
                {errors.length !== 0 && errors.map((error) => (
                    <Alert severity="error" className="m-1" key={error.message}>{error.message}</Alert>
                ))}
            </div>
        </Fragment>
    )
}

export default CategoryForm;