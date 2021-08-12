import React, { useEffect, useState } from "react";
import axios from "axios";
import queryString from "query-string";

import {
  Chip,
  Container,
  Grid,
  Paper,
  Button,
  InputAdornment,
  TextField,
  FormControl,
  Select,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import LinearProgress from "@material-ui/core/LinearProgress";
import "bootstrap/dist/css/bootstrap.css";

const useStyles = makeStyles({});

function Users(props) {
  const classes = useStyles();
  const [query, setQuery] = useState({
    limit: 100,
  });
  const [users, setUsers] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    let URL= `${process.env.REACT_APP_BACKEND_API_URL
    }user?${queryString.stringify(
        query
      )}`;
    axios({
      url: URL,
      headers:{
        'authorization':`Bearer ${localStorage.getItem('token')}`
      },
    }
      
    ).then((result) => setUsers(result.data.data.users));
  }, [refresh, query]);

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
          .delete(`${process.env.REACT_APP_BACKEND_API_URL}user/${id}`)
          .then((result) => {
            if (result.data.status === "success") {
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
    setUsers(null);
    setQuery({ ...query, [e.target.name]: e.target.value });
  };
  console.log(query);
  console.log(users);
  return (
    <div className="usersinterface">
      <Container>
        <Grid container className="firstrow">
          <h1 className="heading">Users List</h1>
          <Link to={`${props.match.path}/new`}>
            <Button className="Button" variant="contained" color="secondary">
              + New User
            </Button>
          </Link>
        </Grid>
        <Grid container justifyContent="flex-end" className="my-3 ">
                    <form  onChange={handleQueryChange} className="user-form">
                        <section>
                            <p className="setting-content">Search</p>
                            <TextField placeholder="Keyword" name="keyword" className="setting-input user-input me-4" InputProps={{ disableUnderline: true, endAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} variant="filled" />
                        </section>
                        <section>
                            <p className="setting-content">Role</p>
                            <FormControl variant="filled" className="setting-input me-4 user-input">
                                <Select native label="Role" placeholder="Role" disableUnderline inputProps={{ name: "role" }}>
                                    <option value="all">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="cashier">Cashier</option>
                                </Select>
                            </FormControl>
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
        <div>
          <Table className="table">
            <TableHead className="tableHead">
              <TableRow className="tableHead">
                <TableCell>Full Name</TableCell>
                <TableCell align="left">Username</TableCell>
                <TableCell align="left">Role</TableCell>
                <TableCell align="left">Last Active</TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="">
              {users ? (
                users.map((user) => (
                  <TableRow className="tableRow" key={user._id}>
                    <TableCell component="th" scope="user">
                      {user.fullname}
                    </TableCell>
                    <TableCell align="left">{user.username}</TableCell>
                    <TableCell align="left">
                      <Chip
                        variant="outline"
                        label={user.role}
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell align="left">
                      {moment(user.lastActive).format("llll")}
                    </TableCell>
                    <TableCell align="left">
                      <Link to={`${props.match.path}/update/${user._id}`}>
                        <EditIcon />
                      </Link>

                      <DeleteIcon onClick={() => handleDelete(user._id)} className="delete-icon"/>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <Box item sm={6} style={{ width: "100%" }}>
                  <LinearProgress />
                </Box>
              )}
            </TableBody>
          </Table>
        </div>
      </Container>
    </div>
  );
}

export default Users;
