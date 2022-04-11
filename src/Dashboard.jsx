import React from 'react'
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';

//data aos
import AOS from 'aos';
import 'aos/dist/aos.css';

//MUI
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import { cyan } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

//MUI table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

//formik
import { Formik, Field, Form } from "formik";

import { useInput } from '@mui/base';
import { styled } from '@mui/system';

const blue = {
    100: '#DAECFF',
    200: '#80BFFF',
    400: '#3399FF',
    600: '#0072E5',
};

const grey = {
    50: '#F3F6F9',
    100: '#E7EBF0',
    200: '#E0E3E7',
    300: '#CDD2D7',
    400: '#B2BAC2',
    500: '#A0AAB4',
    600: '#6F7E8C',
    700: '#3E5060',
    800: '#2D3843',
    900: '#1A2027',
};

const StyledInputElement = styled('input')(
    ({ theme }) => `
  width: 220px;
  font-size: 0.875rem;
  font-family: IBM Plex Sans, sans-serif;
  font-weight: 400;
  line-height: 1;
  color: ${grey[900]};
  background: ${grey[50]};
  border: 1px solid ${grey[300]};
  border-radius: 8px;
  padding: 6px 12px;

  &:hover {
    background: ${grey[100]};
    border-color: ${grey[400]};
  }

  &:focus {
    outline: 3px solid ${blue[100]};
  }
`,
);

const CustomInput = React.forwardRef(function CustomInput(props, ref) {
    const { getRootProps, getInputProps } = useInput(props, ref);

    return (
        <div {...getRootProps()} style={{ marginTop: '10px' }}>
            <StyledInputElement {...props} {...getInputProps()} />
        </div>
    );
});

const color = cyan[50];

export default function Dashboard(props) {
    const [book, setBook] = useState([]);
    const [edit, setEdit] = useState({ status: false, editData: {} });
    const [open, setOpen] = React.useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const config = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };

    useEffect(() => { getBook() }, [])

    const getBook = async () => {
        await axios.get('http://localhost:5050/get_book', { headers: config }).then((res) => {
            setBook(res.data)
            handleClick()
        });
        // await setBook(response.data)
    }

    const onSubmit = async (data) => {
        if (edit.status) {
            await axios.put('http://localhost:5050/update_book', { _id: edit.editData._id, data: data }, { headers: config });
            setEdit({ status: false, editData: {} })
        } else {
            console.log(data);
            await axios.post('http://localhost:5050/add_book', data, { headers: config });
        }
        reset({ bookName: null, authorName: null, price: null });
        getBook();
    };

    const deleteBook = async (id) => {
        await axios.delete('http://localhost:5050/delete_book', { headers: config, data: { _id: id } }).then(() => getBook());
        // getBook();
    }

    function bookForm() {
        if (edit.status) {
            return (

                < Formik
                    initialValues={edit.editData}
                    onSubmit={(values) => onSubmit(values)}
                >
                    <Form>
                        <Typography gutterBottom variant="h5" component="div">
                            Update Book
                        </Typography>

                        <Field name="bookName" >
                            {({ field }) => <CustomInput required type="text"  {...field} />}
                        </Field>

                        <Field name="authorName">
                            {({ field }) => <CustomInput required type="text"  {...field} />}
                        </Field>

                        <Field name="price">
                            {({ field }) => <CustomInput required type="text"  {...field} />}
                        </Field>
                        <br />

                        <Button variant="contained" size='small' type="submit">update</Button>
                        <Button variant="contained" size='small' color='error' sx={{ ml: 1.5 }} onClick={() => setEdit({ status: false, editData: {} })} > cancle</Button>
                        <Button size='small' sx={{ ml: 1.5 }} onClick={(e) => {
                            e.preventDefault();
                            props.setAuth(localStorage.removeItem("token"))
                        }} >Logout</Button>
                    </Form>
                </Formik >
            )
        }

        return <form id='registerForm' onSubmit={handleSubmit(onSubmit)}>
            <Typography gutterBottom variant="h5" component="div">
                Register Book
            </Typography>

            <CustomInput aria-label="Book Name" placeholder="Enter book name"{...register("bookName", { required: true })} />
            {errors.bookName && <span>This field is required</span>}

            <CustomInput aria-label="Author Name" placeholder="Enter author name" {...register("authorName", { required: true })} />
            {errors.authorName && <span>This field is required</span>}

            <CustomInput aria-label="price" placeholder="Price" {...register("price", { required: true, pattern: /^0|[1-9]\d*$/ })} />
            {errors.price && <span>This field is required</span>}

            <br />
            <Button variant="contained" size='small' type="submit">Register</Button>
            <Button size='small' sx={{ ml: 2 }} onClick={(e) => {
                e.preventDefault();
                props.setAuth(localStorage.removeItem("token"))
            }} >Logout</Button>
        </form>
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: color }}>

            <Card sx={{ minWidth: 275, boxShadow: 'rgba(17, 17, 26, 0.1) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px' }}>
                <CardContent>
                    {bookForm()}
                </CardContent>
            </Card>

            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {book.length} book found.
                </Alert>
            </Snackbar>

            <div style={{ maxHeight: '600px', overflowY: 'scroll', marginTop: '20px', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px' }}>
                <TableContainer component={Paper} sx={{ width: '500px' }}>
                    <Table aria-label="simple table" size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Book Name</TableCell>
                                <TableCell>Author Name</TableCell>
                                <TableCell>Price&nbsp;($)</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {book.map((item) => (
                                <TableRow
                                    key={item._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{item.bookName}</TableCell>
                                    <TableCell>{item.authorName}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>
                                        <Stack direction="row">
                                            <IconButton aria-label="edit" size="small" onClick={() => setEdit({ status: true, editData: item })}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton aria-label="delete" size="small" onClick={() => deleteBook(item._id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div >
    )
}