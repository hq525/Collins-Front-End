import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
});

function createData(jan: number, feb: number, mar: number, apr: number, may: number, jun: number, jul: number, aug: number, sep: number, oct: number, nov: number, dec: number, ytd: number) {
  return { jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec, ytd };
}

const rows = [
  createData(99.0, 98.7, 96.3, 99.3, 100, 98.0, 97.8, 97.0, 98.2, 98.1, 97.9, 99.9, 99.0)
];

export default function DenseTable() {
  const classes = useStyles({});

  return (
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center"><h3>Jan</h3></TableCell>
            <TableCell align="center"><h3>Feb</h3></TableCell>
            <TableCell align="center"><h3>Mar</h3></TableCell>
            <TableCell align="center"><h3>Apr</h3></TableCell>
            <TableCell align="center"><h3>May</h3></TableCell>
            <TableCell align="center"><h3>Jun</h3></TableCell>
            <TableCell align="center"><h3>Jul</h3></TableCell>
            <TableCell align="center"><h3>Aug</h3></TableCell>
            <TableCell align="center"><h3>Sep</h3></TableCell>
            <TableCell align="center"><h3>Oct</h3></TableCell>
            <TableCell align="center"><h3>Nov</h3></TableCell>
            <TableCell align="center"><h3>Dec</h3></TableCell>
            <TableCell align="center"><h3>YTD</h3></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow>
              <TableCell align="center">{row.jan}</TableCell>
              <TableCell align="center">{row.feb}</TableCell>
              <TableCell align="center">{row.mar}</TableCell>
              <TableCell align="center">{row.apr}</TableCell>
              <TableCell align="center">{row.may}</TableCell>
              <TableCell align="center">{row.jun}</TableCell>
              <TableCell align="center">{row.jul}</TableCell>
              <TableCell align="center">{row.aug}</TableCell>
              <TableCell align="center">{row.sep}</TableCell>
              <TableCell align="center">{row.oct}</TableCell>
              <TableCell align="center">{row.nov}</TableCell>
              <TableCell align="center">{row.dec}</TableCell>
              <TableCell align="center">{row.ytd}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  );
}