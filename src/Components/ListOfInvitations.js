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
    let deleteInvitation=async(meetingId)=>{
      let response = await fetch(Commons.baseUrl + `/invited/${meetingId}?access_token=`+ localStorage.getItem("access_token"), {
          method: 'DELETE'
      })
      if(response.ok){
        getInvitations()
      }
      
  }
    return (
      <Flex vertical align='center' style={{ height:"100vh", width:"100%"}}>
        <List style={{backgroundColor:"white", minWidth:"90%", padding:20}}>

         {invitations.length>0 &&
          <VirtualList
            data={invitations}
            itemHeight={47}
            itemKey="email"
          >
            {(item) => (
              <List.Item key={item.id} >
                <List.Item.Meta
                  onClick={()=>{navigate("/private-participate/" +item.meeting.token+"/"+item.meeting.id)}}
                  title={  <Title style={{ margin: 0, fontWeight: 'bold' }} level={4}>{item.meeting.title}</Title>}
                  description={ <Text style={{ fontWeight: 'bold', color: "gray" }}>{item.meeting.userEmail}</Text>}
                />
                  <Button onClick={()=>{deleteInvitation(item.meeting.id)}} danger>delete</Button>
              </List.Item>
            )}
          </VirtualList>}

      </List>
      </Flex>
    )
}
export default ListOfInvitations