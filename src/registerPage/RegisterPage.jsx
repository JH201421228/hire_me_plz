import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import app, { db } from "../firebase";
import { set, ref } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import styled from "styled-components";

const Container = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
`;

const Title = styled.h3`
    text-align: center;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    margin-top: 10px;
`;

const Input = styled.input`
    padding: 8px;
    margin-top: 5px;
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 12px;
`;

const SubmitButton = styled.input`
    margin-top: 20px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const StyledLink = styled(Link)`
    color: grey;
    text-decoration: none;
    margin-top: 10px;
    display: inline-block;
`;

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const [errorFromSubmit, setErrorFromSubmit] = useState("");

    const auth = getAuth(app);

    const { register, watch, formState: { errors }, handleSubmit } = useForm();
    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const createUser = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfile(auth.currentUser, {
                displayName: data.name,
            });

            console.log(createUser);
            console.log(auth.currentUser);

            set(ref(db, `users/${createUser.user.uid}`), {
                name: createUser.user.displayName,
            });

            dispatch(setUser({
                uid: createUser.user.uid,
                displayName: createUser.user.displayName,
            }));

        } catch (error) {
            console.error(error);
            setErrorFromSubmit(error.message);
            setTimeout(() => {
                setErrorFromSubmit("");
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Title>Register</Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Label htmlFor='email'>Email</Label>
                <Input
                    name='email'
                    type='email'
                    id='email'
                    {...register("email", {
                        required: "This email field is required",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Please enter a valid email address"
                        }
                    })}
                />
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

                <Label htmlFor="name">Name</Label>
                <Input
                    type="text"
                    name='name'
                    id='name'
                    {...register("name", {
                        required: "This name field is required",
                        maxLength: {
                            value: 10,
                            message: "Your input exceed maximum length"
                        }
                    })}
                />
                {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}

                <Label htmlFor="password">Password</Label>
                <Input
                    name='password'
                    type="password"
                    id='password'
                    {...register("password", {
                        required: "This password field is required",
                        minLength: {
                            value: 6,
                            message: "Password must have at least 6 characters"
                        },
                        pattern: {
                            value: /(?=.*[!@#$%^&*])/,
                            message: "Password must contain at least one special character"
                        }
                    })}
                />
                {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

                {errorFromSubmit && <ErrorMessage>{errorFromSubmit}</ErrorMessage>}

                <SubmitButton type="submit" disabled={loading} value="Register" />
                <StyledLink to={'/login'}>로그인</StyledLink>
            </Form>
        </Container>
    );
};

export default RegisterPage;
