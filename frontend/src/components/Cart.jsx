import React, { useContext, Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import Button from "@material-ui/core/Button";
import { CartContext, SettingsContext } from "../App";

function Cart() {
    const storeSettings = useContext(SettingsContext);
    const cartDetails = useContext(CartContext);
    
    const subTotal = cartDetails.cartItems.length ? cartDetails.cartItems.reduce((sum, item) => sum + item.price * item.qty, 0) : 0;
    const discount = storeSettings ? (+storeSettings.discount / 100) * subTotal : 0;
    const tax = storeSettings ? (+storeSettings.tax / 100) * subTotal : 0;
    const grandTotal = storeSettings ? subTotal + tax - discount : 0;

    return (
        <Fragment>
            <div className="user-heading pt-2" style={{ display: "block" }}>
                <h4>Cart</h4>
            </div>
            <Table className="cart-table" aria-label="simple table">
                <TableBody>
                    { cartDetails.cartItems.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell align="left">
                                <DeleteIcon style={{ height: "20px", marginTop: "10px" }} onClick={() => cartDetails.handleCartDelete(item._id)} />
                                <img style={{ width: "50px", height: "33px", marginTop: "15px" }} src={item.image} alt="" />
                                <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "5px" }}>
                                    <span>{item.name}</span>
                                    <span>$ {item.price}</span>
                                </div>
                            </TableCell>
                            <TableCell align="right">
                                <RemoveCircleOutlineIcon className="pink" onClick={() => cartDetails.handleQtyChange(item._id, "decrement") } />
                                    {" "}{item.qty}{" "}
                                <AddCircleOutlineIcon className="pink" onClick={() => cartDetails.handleQtyChange(item._id, "increment") } />
                            </TableCell>
                            <TableCell align="right" style={{ fontWeight: "bold" }}>
                                $ {(item.price * item.qty).toFixed(2)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <br /><br />
            <Table className="cart-table">
                <TableBody>
                    <TableRow>
                        <TableCell align="left">SubTotal</TableCell>
                        <TableCell align="right">$ {subTotal.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Discount</TableCell>
                        <TableCell align="right">$ {discount.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Tax</TableCell>
                        <TableCell align="right">$ {tax.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">
                            <h5>Grand Total</h5>
                        </TableCell>
                        <TableCell align="right">
                            <h5>$ {grandTotal.toFixed(2)}</h5>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <section style={{ display: "flex" }}>
            <section style={{ width: '50%', padding: '5px' }}>
                <Button variant="contained" className="reset-button" fullWidth disabled={cartDetails.cartItems.length === 0} onClick={cartDetails.handleReset}>Reset</Button>
            </section>
            <section style={{ width: '50%', padding: '5px' }}>
                <Button variant="contained" className="user-newdata" fullWidth disabled={cartDetails.cartItems.length === 0} onClick={() => cartDetails.handleSubmit(grandTotal.toFixed(2))}>Pay</Button>
            </section>
            </section>
        </Fragment>
    );
}

export default Cart;