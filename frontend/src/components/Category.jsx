import React, { useState, useEffect, Fragment } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import Swal from 'sweetalert2';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from "@material-ui/icons/Search";
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";



function Category(props) {
    const [categories, setCategories] = useState(null);
    const [query, setQuery] = useState({
        limit: 20,
    });
    const [refresh, setRefresh] = useState(false);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This user will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${process.env.REACT_APP_BACKEND_API_URL}category/${id}`)
                    .then((res) => {
                        console.log(res);
                        if (res.data.status === "success") {
                            Swal.fire("Deleted!", "User deleted successfully...", "success");
                            setRefresh(!refresh);
                        }
                    })
                    .catch((err) => {
                        Swal.fire("Deleted!", "Something went wrong...", "error");
                    });
            }
        });
    };
    const handleQueryChange = (e) => {
        setCategories(null);
        setQuery({ ...query, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        axios(
            `${process.env.REACT_APP_BACKEND_API_URL}category?${queryString.stringify(query)}`,
        ).then((result) => setCategories(result.data.data.categories))
    }, [refresh, query]);

    return (
        <Fragment>
            <div className="dashboard-container text-start">
                <div className="user-heading">
                    <h4 className="heading">Category List</h4>
                    <Link to={`${props.match.path}/create`} >
                        <Button variant="contained" className="Button" color="secondary">+ New Data</Button>
                    </Link>
                </div>
                <Grid container justifyContent="flex-end" className="my-3">
                    <form onChange={handleQueryChange} className="user-form">
                        <section>
                            <p className="setting-content">Search</p>
                            <TextField placeholder="Keyword" name="keyword" className="setting-input user-input me-4" InputProps={{ disableUnderline: true, endAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} variant="filled" />
                        </section>
                        <section>
                            <p className="setting-content">Sort By</p>
                            <FormControl variant="filled" className="setting-input user-input">
                                <Select native placeholder="Role" disableUnderline inputProps={{ name: "sort" }}>
                                    <option value="Newest">Newest</option>
                                    <option value="Oldest">Oldest</option>
                                    <option value="Name">Name</option>
                                    <option value="Last Active">Last Active</option>
                                </Select>
                            </FormControl>
                        </section>
                    </form>
                </Grid>
                <Table className="table" aria-label="simple table">
                    <TableHead className="tableHead">
                        <TableRow className="tableHead">
                            <TableCell>Category Name</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories && categories.map((category) => (
                            <TableRow className="tableRow" key={category._id}>
                                <TableCell component="th" scope="user">
                                    {category.name}
                                </TableCell>
                                <TableCell align="right">
                                    <Link to={`${props.match.path}/update/${category._id}`}>
                                        <EditIcon />
                                    </Link>
                                    <DeleteIcon onClick={() => handleDelete(category._id)} className="delete-icon" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>
        </Fragment>
    )
}

export default Category;