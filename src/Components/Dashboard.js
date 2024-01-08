import React, { useState, useEffect } from 'react';
import { Avatar, Flex, Typography, Button, Input } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import "../App.css"
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Commons from '../Utility/url';

let DashboarComponent = () => {
    const { Search } = Input;
    let [meetings, setMeetings] = useState([])
    const [search, setSearch]=useState("")
    const { Title, Text } = Typography;
    let navigate = useNavigate()
    useEffect(() => {
        getmeetings()
    }, [])

    let getmeetings = async () => {

        let response = await fetch(Commons.baseUrl + "/meetings/list?access_token=" + localStorage.getItem("access_token"))
        if (response.ok) {
            let data = await response.json()
            setMeetings(data)
        }

    }
    return (


        <Flex justify='center' style={{ width: "100%", height: "100vh" }}>
            <Flex vertical style={{ width: "700px", backgroundColor: "white", padding: "30px" }}>
                <Flex justify="flex-end" style={{width:"100%", marginBottom:20}}>
                    <Search
                        onChange={(e)=>{setSearch(e.target.value)}}
                        style={{
                            width: 200
                        }}
                    />
                </Flex>
                
                {meetings.filter((meeting)=>{
                return meeting.title.includes(search)
            }).map((m) =>
                    <Flex onClick={()=>{navigate("/votes/"+m.id)}} align='center' justify="space-between" style={{ border: "1px solid #D3DCE3", padding: 20 }}>
                        <Flex style={{ width: "10%" }}>
                            <Avatar icon={<UserOutlined />} />
                        </Flex>
                        <Flex justify='center' vertical style={{ width: "70%", height: "100%" }}>
                            <Title style={{ margin: 0, fontWeight: 'bold' }} level={4}>{m.title}</Title>
                            <Flex align='center'>
                                <CalendarOutlined style={{ fontSize: 20 }} />
                                <Text style={{ fontWeight: 'bold', color: "gray", marginLeft: 5, marginRight: 5 }}>{m.dates?.length}</Text>
                                <Text style={{ fontWeight: 'bold', color: "gray" }}>options</Text>
                            </Flex>

                        </Flex>
                        <Flex style={{ width: "20%" }}>
                            <Button type="dashed" danger>delete</Button>
                        </Flex>


                    </Flex>)}
            </Flex>
        </Flex>
    )
}
export default DashboarComponent