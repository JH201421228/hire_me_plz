import React, { useState } from "react";
import app from "../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import styled from "styled-components";

const MasterContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(218, 218, 220);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Container = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
`;

const ImgBox = styled.img`
    max-width: 500px;
    margin: auto;
    display: block;
`;

const Title = styled.h3`
    margin-top: 1rem;
    text-align: center;
    font-weight: bold;
    color: rgb(80, 80, 80);
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    margin-top: 10px;
    font-weight: bold;
    color: rgb(80, 80, 80);
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
    text-align: center;
    margin-top: 20px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [errorFromSubmit, setErrorFromSubmit] = useState("");

    const auth = getAuth(app);

    const { register, formState: { errors }, handleSubmit } = useForm();
    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            // 사용자 정보를 Redux 상태로 설정
            dispatch(setUser({
                uid: userCredential.user.uid,
                displayName: userCredential.user.displayName,
                email: userCredential.user.email,
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
        <MasterContainer>
            <Container>
                <ImgBox src="/images/iwbtd2.jpg" />
                <Title>Sign In</Title>
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
                            }
                        })}
                    />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

                    {errorFromSubmit && <ErrorMessage>{errorFromSubmit}</ErrorMessage>}

                    <SubmitButton type="submit" disabled={loading} value="Sign In" />
                    <StyledLink to={'/register'}>Sign Up</StyledLink>
                </Form>
            </Container>
        </MasterContainer>
    );
};

export default LoginPage;
