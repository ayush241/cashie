import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Typography } from "@material-ui/core";
import moment from "moment";

export default function ReceiptModal({
	isOpen,
	onOpen,
	onClose,
	transactionData,
}) {
	return (
		<div>
			<Dialog
				style={{ padding: "20px" }}
				open={isOpen}
				onClose={onClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">
					<Typography
						align="center"
						className="text-muted"
						variant="h4"
						component="h3"
						gutterBottom>
						Receipt
					</Typography>
					<Typography
						variant="caption"
						display="block"
						align="center"
						gutterBottom>
						{moment(transactionData && transactionData.createdAt).format(
							"llll",
						)}
					</Typography>
					<Typography
						variant="caption"
						display="block"
						align="center"
						gutterBottom>
						{transactionData && transactionData._id}
					</Typography>
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						<Table aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell align="left">Product</TableCell>
									<TableCell align="center">Quantity</TableCell>
									<TableCell align="center">Unit Price</TableCell>
									<TableCell align="right">Total</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{transactionData &&
									transactionData.products.map((item) => (
										<TableRow key={item._id}>
											<TableCell align="left">{item.name}</TableCell>
											<TableCell align="center">{item.qty}</TableCell>
											<TableCell align="center">{item.price}</TableCell>
											<TableCell align="right">
												${(item.qty * item.price).toFixed(2)}
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
						<Table>
							<TableRow>
								<TableCell>Sub Total</TableCell>
								<TableCell align="right">
									{transactionData && transactionData.subtotal.toFixed(2)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Discount</TableCell>
								<TableCell align="right">
									{transactionData && transactionData.discount.toFixed(2)}
								</TableCell>
							</TableRow>

							<TableRow>
								<TableCell>Grand Total</TableCell>
								<TableCell align="right">
									{transactionData && transactionData.grandtotal.toFixed(2)}
								</TableCell>
							</TableRow>
						</Table>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button variant="default" fullWidth className="c-btn">
						PRINT RECEIPT
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}