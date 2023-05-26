import React, { useEffect, useState } from "react";
import TableHead from "@mui/material/TableHead";
import { Link } from "react-router-dom";
import "./TableProductCategories.scss";

import {
  createTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TableSortLabel,
  ThemeProvider,
  Typography,
} from "@mui/material";
import CategoryProduct from "@Models/Product/ProductCategory";
import ModalAddCategoryProduct from "../ModalAddCategoryProduct/ModalAddCategoryProduct";

function comparadorDescendiente(a: any, b: any, orderBy: any) {
  if (typeof a[orderBy] == "string") {
    a = a[orderBy][0].toLowerCase();
    b = b[orderBy][0].toLowerCase();
    if (b < a) {
      return -1;
    }
    if (b > a) {
      return 1;
    }
    return 0;
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
}

function getComparador(order: string, orderBy: string) {
  return order === "desc"
    ? (a: any, b: any) => comparadorDescendiente(a, b, orderBy)
    : (a: any, b: any) => -comparadorDescendiente(a, b, orderBy);
}

const stableSort = (array: CategoryProduct[], comparator: any, orderBy: any) => {
  const stabilizedThis = array.map((product: any, index: number) => [
    product,
    index,
  ]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((product) => product[0]);
};

function CabeceraMejorada(props: any) {
  const { order, orderBy, rowCount, handleRequestSort } = props;

  const crearSortHandler = (property: any) => (event: any) => {
    handleRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell
          className="tableCell"
          key="description"
          style={{ backgroundColor: "#C6C6C6" }}
        >
          <TableSortLabel
            active={orderBy === "description"}
            direction={orderBy === "description" ? order : "asc"}
            onClick={crearSortHandler("description")}
          >
            <Typography fontWeight="bold">Nombre rubro</Typography>
          </TableSortLabel>
        </TableCell>



        <TableCell
          className="tableCell"
          key="Acciones"
          style={{ backgroundColor: "#C6C6C6" }}
        >
          <Typography fontWeight="bold">Acciones</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

interface myProps {
  categories: CategoryProduct[];
}

export default function TableProductCategories({ categories }: myProps) {
  const formatoMonedaLocal = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("Name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [showModal, setShowModal] = React.useState(false);
  const [categoryEditing, setCategoryEditing] = React.useState<CategoryProduct>();

  const handleShowModal = (prod: CategoryProduct) => {
    setShowModal(true);
    setCategoryEditing(prod);
  };
  const handleClose = () => {
    setShowModal(false);
  };

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrderBy(property);
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, categories.length - page * rowsPerPage);

  return (
    <div className="container_tabla">
      <Paper className="paper">
        <TableContainer>
          <Table
            className="table"
          // aria-labelledby="tableTitle"
          // aria-label="enhanced table"
          >
            <CabeceraMejorada
              component="th"
              orderBy={orderBy}
              order={order}
              handleRequestSort={handleRequestSort}
              rowCount={categories.length}
            />

            <TableBody>
              {stableSort(categories, getComparador(order, orderBy), orderBy)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((category: CategoryProduct, index) => {

                  return (
                    <TableRow key={index}>
                      <TableCell className="tableCell">
                        {category.description}
                      </TableCell>

                      <TableCell className="tableCell">
                        {
                          <button
                            data-title="Eliminar"
                            type="button"
                            className="btn btn-sm"
                            onClick={() => handleShowModal(category)}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        }
                      </TableCell>
                    </TableRow>
                  );

                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{
            marginBottom: "0 !important",
            ".MuiTablePagination-selectLabel": {
              marginBottom: "0",
            },
            ".MuiTablePagination-displayedRows": {
              marginBottom: "0",
            },
          }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <ModalAddCategoryProduct
        showModal={showModal}
        handleClose={handleClose}
        category={categoryEditing}
        editing={true}
      />
    </div>
  );
}
