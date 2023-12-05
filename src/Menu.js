import React, { useState } from 'react';
import { Menu } from 'antd';
const items = [
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        Registration
      </a>
    ),
    key: 'registration',
  },
];

let MenuComponent = () => {
  const [current, setCurrent] = useState('mail');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};

export default MenuComponent;