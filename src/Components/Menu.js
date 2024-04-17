import React, { useState } from 'react';
import { Button, Divider, Flex, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import "../App.css"
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
let MenuComponent = () => {
  const [size, setSize] = useState('large')
  const { Title } = Typography;
  let navigate = useNavigate()
  return (
    <Flex justify="space-between" align='center' style={{ height:"100%", width:"90%"}}>
      <Flex onClick={()=>{navigate("/")}} align='center' style={{textAlign:"center", height:"100%"}}>
        <CalendarOutlined style={{fontSize: '35px', marginRight:10, color:"#4A55A2"}}/>
        <h2 style={{color:"#4A55A2"}}>SlotMeeting</h2>
      </Flex>
      <Flex>

        <Button onClick={()=>{navigate("/login")}} type="primary" shape="round" size={size} style={{ backgroundColor:"#4A55A2"}}>
          Iniciar sesion
        </Button>

        <Button onClick={()=>{navigate("/registration")}} type='text' size={size} style={{ marginLeft:10, color:"#4A55A2"}}>
          Registrarse
        </Button>
      </Flex>
    </Flex>
  );
};

export default MenuComponent;