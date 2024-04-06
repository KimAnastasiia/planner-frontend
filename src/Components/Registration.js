import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { Flex, Radio } from 'antd';
import { useGoogleLogin } from '@react-oauth/google';

import { useEffect, useState } from "react";
import { wait } from '@testing-library/user-event/dist/utils';
import Commons from '../Utility/url';

import { useNavigate } from "react-router-dom";
const Registration = () => {

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [userName, setUserName] = useState("");
    let navigate = useNavigate()
    let CreateAccount = async () => {

        let response = await fetch(Commons.baseUrl + "/users", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name:userName,
                password:password,
                email:email
            })
        })
        if(response.ok){
            let data = await response.json()
            console.log(data)
            localStorage.setItem('access_token', data.apiKey);
            localStorage.setItem('email', data.email);
            localStorage.setItem('name', data.name);
            navigate("/createMeeting")
        }
     
    }
    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            checkUser(tokenResponse.access_token)
        }
    });
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const checkUser = async (access_token) => {
        localStorage.setItem('access_token', access_token);

        let response = await fetch(Commons.baseUrl + "/users?access_token=" + access_token)

        if (response.ok) {
            console.log("Logined")
        }

    }

    return (
        <Flex justify='center' align='center' style={{ height: "100vh", width: "100%" }}>
            <Flex justify='center' align='center' style={{ height: 600, width: 600, backgroundColor: "white", border: "1px solid #D3DCE3" }}>


                <Flex align="center" justify='center' vertical style={{ width: "100%", height: "60%", }}>
                    <h1>Register and plan your day!</h1>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 5,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}

                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        style={{ width: "100%", marginTop: "20px" }}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input type="email" onChange={(e)=>{setEmail(e.target.value)}} />
                        </Form.Item>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input onChange={(e)=>{setUserName(e.target.value)}}/>
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password onChange={(e)=>{setPassword(e.target.value)}} />
                        </Form.Item>

                        <Form.Item
                            style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
                        >

                            <Button onClick={CreateAccount} shape="round" style={{ backgroundColor: "#933D55", width: "300px", height: 50, fontSize: 17, }} type="primary" htmlType="submit">
                                Registrate
                            </Button>

                        </Form.Item>
                    </Form>
                    <Flex align='top' justify='center' style={{ width: "100%", height: "40%" }}>
                        <Button
                            style={{ width: "300px", height: 50, backgroundColor: "white", color: "black", fontSize: 17, border: "1px solid #933D55" }}
                            shape="round"
                            onClick={() => login()}

                        >
                            <img
                                src={process.env.PUBLIC_URL + '/icons8-google-48.png'}
                                alt="Google Icon"
                                style={{ marginRight: 8, width: 25, height: 25 }}
                            />
                            Sign in with Google
                        </Button>
                    </Flex>
                </Flex>


            </Flex>
        </Flex>
    )
}

export default Registration;