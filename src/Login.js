import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { Flex, Radio } from 'antd';
import { useGoogleLogin } from '@react-oauth/google';
import { backendUrl } from './Global';


const Login = () => {

  const login = useGoogleLogin({onSuccess: tokenResponse =>{
    checkUser(tokenResponse.access_token)
  }});

 const checkUser=async(access_token)=>{
  localStorage.setItem('access_token',access_token);

  let response = await fetch(backendUrl + "/users?access_token="+access_token)

  if(response.ok){
    console.log("Logined")
  }
  console.log(response)
 }

  return (
    <Flex justify='center' align='center' style={{minHeight:800}}>
    <Form.Item >
      <Button style={{width:"100%", marginTop:20}} type='primary' onClick={() => login()}>  Sign in with Google 🚀</Button>
    </Form.Item>
    </Flex>)
}

export default Login;