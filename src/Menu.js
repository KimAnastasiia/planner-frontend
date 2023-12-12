import React, { useState } from 'react';
import { Button, Divider, Flex, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

let MenuComponent = () => {
  const [size, setSize] = useState('large')
  const { Title } = Typography;

  return (
    <Flex justify="space-between" align='center' style={{ height:"100%", width:"90%"}} >
      <Flex>
        <CalendarOutlined style={{fontSize: '35px'}}/>
        <Title level={3}>MeetFlow Planner</Title>
      </Flex>
      <Flex>

        <Button type="text" shape="round" size={size} style={{color:"#933D55"}}>
          Iniciar sesion
        </Button>

        <Button type="primary" shape="round" size={size} style={{backgroundColor:"#13B5E8", marginLeft:10}}>
          Registrarse
        </Button>
      </Flex>
    </Flex>
  );
};

export default MenuComponent;