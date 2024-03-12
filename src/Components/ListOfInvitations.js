import React, { useState, useEffect } from 'react';
import { Button, List, Typography, Flex  } from 'antd';
import VirtualList from 'rc-virtual-list';
import "../App.css"
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Commons from '../Utility/url';

const ListOfInvitations = () => {
  
    let [invitations, setInvitations] = useState([])
    let navigate = useNavigate()
    const { Title, Text } = Typography;
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
      <Flex vertical align='center' style={{ height:"100vh", width:"100%"}}>
        <List style={{backgroundColor:"white", minWidth:"90%", padding:20}}>
          <VirtualList
            data={invitations}
            itemHeight={47}
            itemKey="email"
          >
            {(item) => (
              <List.Item key={item.id} onClick={()=>{navigate("/private-participate/" +item.meeting.token+"/"+item.meeting.id)}}>
                <List.Item.Meta
                
                  title={  <Title style={{ margin: 0, fontWeight: 'bold' }} level={4}>{item.meeting.title}</Title>}
                  description={ <Text style={{ fontWeight: 'bold', color: "gray" }}>{item.meeting.userEmail}</Text>}
                />
                  <Button  type="dashed" danger>delete</Button>
              </List.Item>
            )}
          </VirtualList>
      </List>
      </Flex>
    )
}
export default ListOfInvitations