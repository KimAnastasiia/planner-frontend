import React, { useState, useMemo, useEffect } from 'react';
import { Button, Avatar, Flex, Typography, Popover } from 'antd';
import { CalendarOutlined, UserOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import "../App.css"
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
let MenuApiComponent = () => {
  const [size, setSize] = useState('large')
  const { Title } = Typography;
  let navigate = useNavigate()
  let [open, setOpen] = useState(false);
  const text = 'Are you sure to delete this task?';
  const description = 'Delete the task';
  const [arrow, setArrow] = useState('Show');

  const { Text, Link } = Typography;
  const mergedArrow = useMemo(() => {
    if (arrow === 'Hide') {
      return false;
    }
    if (arrow === 'Show') {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);
  let disconnect = async () => {
    localStorage.clear();
    navigate("/login")
  }
  const content = (
    <div style={{ width: 300, height: 250 }}>
      <Flex align='center' style={{ height: "30%", width: "100%", borderBottom: "1px solid #D3DCE3" }}>
        <div>
          <Avatar size="large" style={{ margin: 20 }} icon={<UserOutlined />} />
        </div>
        <Flex vertical>

          <Text level={4}>   {localStorage.getItem("name")}</Text>
          <Text level={4}>   {localStorage.getItem("email")}</Text>
        </Flex>
      </Flex>
      <Flex vertical justify="space-between" style={{ marginTop: 10 }}>

        <Button onClick={()=>{navigate("/dashboard")}} block>Dashboard</Button>
        <Button onClick={()=>{navigate("/account")}} block style={{marginTop:10, marginBottom:10}}>Account Settings</Button>
        <Button onClick={()=>{navigate("/allInvitations")}} block>My invitations</Button>
        <Button danger onClick={disconnect} block style={{marginTop:10, marginBottom:10}}>Log out</Button>
      </Flex>
    </div>
  );

  return (
    <Flex justify="space-between" align='center' style={{ height: "100%", width: "90%" }} >
      <Flex  style={{ textAlign: "center", height: "100%" }}>
        <CalendarOutlined style={{ fontSize: '35px', marginRight: 10, color:"#4A55A2" }} />
        <h2 style={{color:"#4A55A2"}}>SlotMeeting</h2>
      </Flex>
      <Flex>

        <Button size={size} shape="round" type="text" style={{ marginLeft: 10 }}>
          <Flex justify="space-between" align='center' style={{ width: 60, height: "100%" }}>
            <Popover placement="bottom" content={content} arrow={mergedArrow}>
              <Avatar style={{ marginRight: 10 }} icon={<UserOutlined />} />
              {!open && <DownOutlined onClick={() => { setOpen(true) }} />}
              {open && <UpOutlined onClick={() => { setOpen(false) }} />}
            </Popover>
          </Flex>
        </Button>
        <Button onClick={() => { navigate("/createMeeting") }} type="primary" shape="round" size={size} style={{ backgroundColor: "#4A55A2", marginLeft: 10 }}>
          + Crear
        </Button>
       
      </Flex>
    </Flex>
  );
};

export default MenuApiComponent;