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

const useStyles = makeStyles({
  table: {},
  firstRow: {
    margin: "20px 0px",
  },
});

function Products(props) {
  const classes = useStyles();
  const [query, setQuery] = useState({
    limit: 100,
  });
  const [products, setProducts] = useState(null);
  const [users, setUsers] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios(
      `${process.env.REACT_APP_BACKEND_API_URL}product?${queryString.stringify(
        query
      )}`
    ).then((result) => setProducts(result.data.data.products));
  }, [refresh, query]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This Product will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        let productCopy = [...products];
        let filtered = productCopy.filter((product) => product._id !== id);
        setProducts(filtered);
        axios
          .delete(`${process.env.REACT_APP_BACKEND_API_URL}product/${id}`,{
			  headers:{
				  "authorization":`Bearer ${localStorage.getItem("token")}`,
			  },
		  })
           
          .then((result) => {
            if (result.data.status === "success") {
              Swal.fire(
                "Deleted!",
                "Product deleted successfully...",
                "success"
              );
              setRefresh(!refresh);
            } else {
              setProducts(productCopy);
              Swal.fire("Deleted!", "Something went wrong...", "error");
            }
          })
          .catch((err) => {
            setProducts(productCopy);
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
    <div className="main-body">
      <Container>
        <Grid container className="firstrow">
          <h1 className="heading">Product List</h1>
          <Link to={`${props.match.path}/newProduct`}>
            <Button className="Button" variant="contained" color="secondary">
              New Product
            </Button>
          </Link>
        </Grid>

        <Grid container justifyContent="flex-end" className="my-3">
          <form onChange={handleQueryChange} className="user-form">
            <section>
              <p className="setting-content">Search</p>
              <TextField
                placeholder="Keyword"
                name="keyword"
                className="setting-input user-input me-4"
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
              />
            </section>
            <section>
              <p className="setting-content">Sort By</p>
              <FormControl
                variant="filled"
                className="setting-input user-input"
              >
                <Select
                  native
                  placeholder="Role"
                  disableUnderline
                  inputProps={{ name: "sort" }}
                >
                  <option value="Newest">Newest</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Name">Name</option>
                  <option value="Lowest to Highest">Lowest to Highest</option>
                  <option value="Highest to Lowest">Highest to Lowest</option>
                </Select>
              </FormControl>
            </section>
          </form>
        </Grid>

        <Table className="table" aria-label="simple table">
          <TableHead className="tableHead">
            <TableRow className="tableHead">
              <TableCell>Image</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="tablebody">
            {products ? (
              products.map((product) => (
                <TableRow className="tableRow" key={product._id}>
                  <TableCell component="th" scope="user">
                    <img
                      style={{
                        width: "75px",
                        height: "50px",
                        borderRadius: "10px",
                        marginTop: "3px",
                        marginLeft: "5px",
                      }}
                      src={product.image}
                      alt=""
                    />
                  </TableCell>
                  <TableCell align="right">{product.name}</TableCell>
                  <TableCell align="right">{product.price}</TableCell>
                  <TableCell align="right">
                    <Chip
                      variant="contained"
                      label={
                        product.category.length && product.category[0].name
                      }
                      color="secondary"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Link to={`${props.match.path}/update/${product._id}`}>
                      <EditIcon />
                    </Link>

                    <DeleteIcon onClick={() => handleDelete(product._id)} />
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
      </Container>
    </div>
  );
}

export default Products;
