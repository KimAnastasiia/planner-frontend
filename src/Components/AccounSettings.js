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
        name:""

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
            localStorage.setItem('name', user.name);
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
        <Flex justify='center' style={{minHeight:"50vh"}} >
            {contextHolder}
            <Flex justify="space-around" style={{backgroundColor:"white", minWidth:"30%", padding:20,borderRadius:12, minHeight:"100%"}} vertical>
                <Flex vertical style={{borderBottom: "1px solid #D3DCE3",height:"25%"}} justify="flex-start">
                    <Flex align='center'style={{minHeight:"50%"}} >
                        <Avatar style={{marginRight:10}} icon={<UserOutlined />}></Avatar>
                        <Text >Profile</Text>
                    </Flex>
                    <Flex style={{minHeight:"50%"}}>
                        <Text>{user.email}</Text>
                    </Flex>
                    
                </Flex>
                <Flex align='center' style={{borderBottom: "1px solid #D3DCE3",minHeight:"25%" }} justify="space-between">
                    <Text>Name</Text>
                    <Input onChange={(e)=>{setUser({...user, name:e.target.value})}} style={{width:"50%"}} value={user.name}></Input>
                </Flex>
                <Button shape="round" style={{backgroundColor:"#4A55A2"}} onClick={updateData} type="primary">Save</Button>
            </Flex>
        </Flex>
    )
};

export default AccounSettings;