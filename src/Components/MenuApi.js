import React, { useState } from 'react';
import { Button, Avatar, Flex, Typography, Popconfirm } from 'antd';
import { CalendarOutlined, UserOutlined, DownOutlined , UpOutlined} from '@ant-design/icons';
import "../App.css"
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
let MenuApiComponent = () => {
  const [size, setSize] = useState('large')
  const { Title } = Typography;
  let navigate = useNavigate()
  let [open, setOpen] = useState(false);
  const text = 'Are you sure to delete this task?';
  const description = 'Delete the task';
  return (
    <Flex justify="space-between" align='center' style={{ height: "100%", width: "90%" }} >
      <Flex align='center' style={{ textAlign: "center", height: "100%" }}>
        <CalendarOutlined style={{ fontSize: '35px', marginRight: 10 }} />
        <h2>MeetFlow Planner</h2>
      </Flex>
      <Flex>

        <Button size={size} shape="round" type="text" style={{ marginLeft: 10 }}>
          <Flex justify="space-between" align='center' style={{ width: 60,height:"100%"}}>
            <Avatar icon={<UserOutlined />} />
            <Popconfirm
              placement="bottom"
              title={text}
              description={description}
              okText="Yes"
              cancelText="No"
              className="myCustomPopconfirm"
            >
              {!open &&<DownOutlined onClick={()=>{setOpen(true)}}/>}
              {open && <UpOutlined onClick={()=>{setOpen(false)}}/>}
            </Popconfirm>
          </Flex>
        </Button>
        <Button onClick={() => { navigate("/createDate") }} type="primary" shape="round" size={size} style={{ backgroundColor: "#9D7D6F", marginLeft: 10 }}>
          + Crear
        </Button>
      </Flex>
    </Flex>
  );
};

export default MenuApiComponent;