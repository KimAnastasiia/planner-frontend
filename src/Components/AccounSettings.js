import React, { useState, useMemo, useEffect } from 'react';
import { Button, Avatar, Flex, Typography, Input,message } from 'antd';
import { CalendarOutlined, UserOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import "../App.css"
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Commons from '../Utility/url';

let AccounSettings = () => {
    const { Title, Text } = Typography;
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        getUser()
    }, [])

    const [user, setUser]=useState({

        email:"",
        name:"",
        password:""

    })

    const getUser = async () => {
        let response = await fetch(Commons.baseUrl + "/users?access_token=" + localStorage.getItem("access_token"))

        if (response.ok) {
            let data = await response.json()
            console.log(data)
            setUser(data[0])
        }

    }
    const updateData=async()=>{

        let response = await fetch(Commons.baseUrl +"/users?access_token=" + localStorage.getItem("access_token"), {

            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        if(response.ok){
            success()
        }else{
            failed()
        }
    }
    const success = () => {
        messageApi.open({
          type: 'success',
          content: 'Your data updates successfully',
        });
    };
    const failed = () => {
        messageApi.open({
          type: "error",
          content: 'Failed to update your data, check the correctness of the entered data',
        });
    };
    return(
        <Flex justify='center' style={{height:"40vh"}} >
            {contextHolder}
            <Flex justify="space-around" style={{backgroundColor:"white", minWidth:"30%", padding:20,borderRadius:12}} vertical>
                <Flex align='center' style={{borderBottom: "1px solid #D3DCE3",height:"25%"}} justify="flex-start">
                    <Text>Profile</Text>
                </Flex>
                <Flex align='center' style={{borderBottom: "1px solid #D3DCE3",height:"25%" }} justify="space-between">
                    <Avatar icon={<UserOutlined />}></Avatar>
                    <Input onChange={(e)=>{setUser({...user, name:e.target.value})}} style={{width:"50%"}} value={user.name}></Input>
                </Flex>
                <Flex align='center' justify="space-between" style={{borderBottom: "1px solid #D3DCE3",height:"25%"}}>
                    <Text>Email</Text>
                    <Text>{user.email}</Text>
                </Flex>
                <Flex align='center' justify="space-between" style={{height:"25%"}}>
                    <Text>Password</Text>
                    <Input style={{width:"50%"}} onChange={(e)=>{setUser({...user, password:e.target.value})}}  value={user.password}></Input>
                </Flex>
                <Button onClick={updateData} type="primary">Save</Button>
            </Flex>
        </Flex>
    )
};

export default AccounSettings;