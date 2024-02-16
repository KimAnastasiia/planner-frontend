import React, { useState, useEffect } from 'react';
import { Avatar, List, Input,Typography  } from 'antd';
import VirtualList from 'rc-virtual-list';
import "../App.css"
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Commons from '../Utility/url';

const ListOfInvitations = () => {
  
    let [invitations, setInvitations] = useState([])
   

    useEffect(() => {
        getInvitations()
    }, [])

    let getInvitations = async () => {

        let response = await fetch(Commons.baseUrl + "/invited?access_token=" + localStorage.getItem("access_token"))
        if (response.ok) {
            let data = await response.json()
            setInvitations(data)
        }

    }
    return (
        <List>
        <VirtualList
          data={invitations}
          height={400}
          itemHeight={47}
          itemKey="email"
        >
          {(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
              
                title={<a href="https://ant.design">{item.meeting.title}</a>}
                description={item.meeting.userEmail}
              />
              <div>Delete</div>
            </List.Item>
          )}
        </VirtualList>
      </List>
    )
}
export default ListOfInvitations