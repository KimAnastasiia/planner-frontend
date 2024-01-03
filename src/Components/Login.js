import React from 'react';
import { Button, message, Form, Input } from 'antd';
import { Flex, Radio } from 'antd';
import { useGoogleLogin } from '@react-oauth/google';
import { backendUrl } from '../Global';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Commons from '../Utility/url';
const Login = () => {

    let [email, setEmail] = useState(false);
    let [password, setPassword] = useState(false);
    let navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();
    let CreateAccount = async () => {

        let response = await fetch("http://localhost:3001/users/verification", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password,
                email: email
            })
        })
        if (response.ok) {
            let data = await response.json()
   
                localStorage.setItem('access_token', data.apiKey);
                localStorage.setItem('email', data.email);
                localStorage.setItem('name', data.name);
                navigate("/createMeeting")
         

        }
        else {
            error()
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


        let response = await fetch(Commons.baseUrl + "/users?access_token=" + access_token)


        if (response.ok) {
            let data = await response.json()
            console.log(data)
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('email', data[0].email);
            localStorage.setItem('name', data[0].name);
            navigate("/createMeeting")
        }

    }
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'This is an error message',
        });
    };
    return (
        <Flex justify='center' align='center' style={{ height: "100vh", width: "100%" }}>
            {contextHolder}
            <Flex justify='center' align='center' style={{ height: 600, width: 600, backgroundColor: "white", border: "1px solid #D3DCE3" }}>


                <Flex align="center" justify='center' vertical style={{ width: "100%", height: "60%", }}>
                    <h1>Log in and plan again with ease</h1>
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
                            <Input type="email" onChange={(e) => { setEmail(e.target.value) }} />
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
                            <Input.Password onChange={(e) => { setPassword(e.target.value) }} />
                        </Form.Item>

                        <Form.Item
                            style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
                        >

                            <Button onClick={CreateAccount} shape="round" style={{ backgroundColor: "#933D55", width: "300px", height: 50, fontSize: 17, }} type="primary" htmlType="submit">
                                Login
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

export default Login;