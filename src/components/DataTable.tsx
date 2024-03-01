import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { MandateHeadCell, Order, UserData, UserHeadCell } from "../utils/types";
import { MandateData } from "../utils/types";
import {
  EnhancedTableHead,
  EnhancedTableToolbar,
} from "./TableHead";
import { getComparator, stableSort } from "../utils/tablefunction";
import { Box } from "@mui/material";



export type UnionHeadCellType = MandateHeadCell | UserHeadCell;
export type UnionRowType = MandateData | UserData;


interface DataTableProps {
  title: string;
  headCells: UnionHeadCellType[];
  rows: UnionRowType[];
}



export default function DataTable(props: DataTableProps) {

  const { title, headCells, rows } = props;

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof UnionRowType>("srno");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof UnionRowType
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} title={title}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>

                    {
                      Object.entries(row).map(([key, value]) => {
                        if(key === 'id'){
                          return(null);
                        }else{
                          return(
                            <TableCell
                              component="th"
                              id={labelId} 
                              scope="row"
                              padding="none"
                              align="center"
                            >
                              {value}
                            </TableCell>
                          );
                        }
                      })
                    }

                    {/* {Object.values(row).map((value) => (
                     
                    ))} */}

                    {/* <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      align="center"
                    >
                      {row.srno}
                    </TableCell>
                    <TableCell align="center">{row.mandateStatus}</TableCell>
                    <TableCell align="center">{row.UMRN}</TableCell>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">{row.reference1}</TableCell>
                    <TableCell align="center">{row.customerName}</TableCell>
                    <TableCell align="center">{row.customerAccountNo}</TableCell>
                    <TableCell align="center">{row.amount}</TableCell>
                    <TableCell align="center">{row.amountInWord}</TableCell>
                    <TableCell align="center">{row.IFSC_MICR}</TableCell>
                    <TableCell align="center">{row.customerBank}</TableCell>
                    <TableCell align="center">{row.sponsorBank}</TableCell>
                    <TableCell align="center">{row.dateOnMandate}</TableCell>
                    <TableCell align="center">{row.formDate}</TableCell>
                    <TableCell align="center">{row.debitTo}</TableCell>
                    <TableCell align="center">{row.frequency}</TableCell>
                    <TableCell align="center">{row.mandateType}</TableCell>
                    <TableCell align="center">{row.rejectResion}</TableCell>
                    <TableCell align="center">{row.createOn}</TableCell>
                    <TableCell align="center">{row.createBy}</TableCell>
                    <TableCell align="center">{row.lastActivityOn}</TableCell>
                    <TableCell align="center">{row.product}</TableCell>
                    <TableCell align="center">{row.branch}</TableCell>
                    <TableCell align="center">{row.categoryCode}</TableCell>
                    <TableCell align="center">{row.utilityCode}</TableCell> */}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}