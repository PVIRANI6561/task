import React from 'react'
import { useForm } from "react-hook-form";
import { useState } from 'react';
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

//MUI
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button } from '@mui/material';
import { cyan } from '@mui/material/colors';
import { Typography } from '@mui/material';
import Alert from '@mui/material/Alert';

import { useInput } from '@mui/base';
import { styled } from '@mui/system';
import axios from 'axios';

//formik
import { Formik, Field, Form } from "formik";

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

export default function RegisterUser() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [err, setErr] = useState(null);

    const data = {
        email: "parth@gmail.com",
        password: "parth"
    }

    const config = {
        'Content-Type': 'application/json',
    };

    const onSubmit = async (data) => {
        setErr(null);
        const res = await axios.post('http://localhost:5050/register', data, { headers: config });
        if (res.data.err) {
            setErr(res.data.err)
            return;
        }
        window.location.href = "/";
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: color }}>

            <Card sx={{ minWidth: 275, boxShadow: 6 }}>
                <CardContent>
                    < Formik
                        onSubmit={(values) => onSubmit(values)}
                    >
                        <Form>
                            <Typography gutterBottom variant="h5" component="div">
                                Register
                            </Typography>

                            <Field name="email" >
                                {({ field }) => <CustomInput required type="text" placeholder="Enter email id"  {...field} />}
                            </Field>

                            <Field name="password">
                                {({ field }) => <CustomInput required type="text" placeholder="Enter password" {...field} />}
                            </Field>
                            <br />

                            <Button variant="contained" size='small' type="submit">register</Button>

                            <Link to="/">
                                <Button size='small' sx={{ ml: 2 }}>
                                    login
                                </Button>
                            </Link>
                        </Form>
                    </Formik >
                </CardContent>
            </Card>
        </div>
    )
}