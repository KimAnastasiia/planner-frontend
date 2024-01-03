/* eslint-disable no-undef */
import React, { useRef, useState, useEffect } from 'react';
import { Button, Avatar, Flex, Typography, Pagination, Input, Checkbox, Col, Radio, Row, Select, theme } from 'antd';
import { PlusOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import "../App.css"
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Commons from '../Utility/url';
import { useParams } from "react-router-dom";

let SelectionOfDates = () => {
    const { Text } = Typography;
    const { id } = useParams()
    let [meetingData, setMeetingData] = useState()
    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    const { Title } = Typography;
    const meetingsPerPage = 2;
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * meetingsPerPage;
    const endIndex = startIndex + meetingsPerPage;
    const [timesIds, setTimesIds] = useState([]);

    let [disableButton, setDisableButton] = useState(true)

    useEffect(() => {
        getMeetingInfo()
    }, [])

    useEffect(() => {
        if (name && email && name!="" && email!="") {
            setDisableButton(false)
        }else{
            setDisableButton(true)
        }
    }, [email, name])

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    let getMeetingInfo = async () => {
        let response = await fetch(Commons.baseUrl + "/meetings?meetingId=" + id)
        if (response.ok) {
            let data = await response.json()
            console.log(data)
            setMeetingData(data[0])
        }

    }

    let addParticipation = async () => {
        let arrayOfTimes = [
            ...timesIds]
        
        let response = await fetch(Commons.baseUrl + "/participation", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail: email,
                name: name,
                meeting: meetingData.id,
                timesIds: arrayOfTimes
            })
        })
        if (response.ok) {
            let data = await response.json()


        }

    }
    let checkBoxChange = (e, timeId) => {

        let copyOfDates = [...timesIds]
        if (e.target.checked == true) {


            let currentTime = copyOfDates.find((time) => time == timeId)


            if (!currentTime) {
                copyOfDates = [...timesIds, timeId ]

            }
            setTimesIds(copyOfDates)
        }
        if (e.target.checked == false) {

            copyOfDates = copyOfDates.filter((time) => time !== timeId)

            setTimesIds(copyOfDates)
        }
        console.log(copyOfDates)
    }
    let renderDates = () => {

        return (
            <div>
                <Flex>
                    {meetingData?.dates.slice(startIndex, endIndex).map((d) => {
                        return d.times.map((t) => {

                            const dateArray = d.date.split("-");
                            const year = parseInt(dateArray[0], 10);
                            const month = parseInt(dateArray[1], 10) - 1; // Month is 0-indexed in JavaScript
                            const day = parseInt(dateArray[2], 10);
                            const dateObject = new Date(year, month, day)
                            const monthAbbreviation = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObject);
                            const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObject);

                            return (
                                <Flex key={t.time} align='center' justify='center' vertical style={{ border: "1px solid #D3DCE3", padding: 20, marginBottom: 20, marginRight: 10 }}  >

                                    <Text style={{ fontWeight: 'bold', color: "gray" }}>{monthAbbreviation}</Text>
                                    <Title style={{ margin: 0, fontWeight: 'bold' }} level={2}>{day}</Title>
                                    <Text style={{ fontWeight: 'bold', color: "gray" }}>{dayOfWeek}</Text>
                                    <Text style={{ fontWeight: 'bold' }}>{t.time}</Text>
                                    <Checkbox onChange={(e) => { checkBoxChange(e, t.id) }}></Checkbox>
                                </Flex>
                            )

                        }

                        )
                    }




                    )}
                </Flex>
                <Pagination
                    defaultCurrent={1}
                    total={meetingData?.dates.length}
                    pageSize={meetingsPerPage}
                    onChange={handlePageChange}
                />
                <Button disabled={disableButton} onClick={addParticipation} type="primary" style={{ width: "100%", marginTop: 20 }}>Save</Button>
            </div>
        )
    }
    return (
        <Flex align='center' justify='center' style={{ height: "100vh", width: "100%" }}>
            <Flex style={{ border: "1px solid #D3DCE3", height: "70%", width: "900px", backgroundColor: "white", borderRadius: 10 }}>
                <Flex align='center' vertical style={{ width: "400px", borderRight: "1px solid #D3DCE3", padding: 30 }}>

                    <Flex style={{ borderBottom: "1px solid #D3DCE3" }} align='center'>
                        <Avatar size="large" icon={<UserOutlined />} style={{ marginRight: 20 }} />
                        <Flex align='center' vertical>
                            <Title level={5}>{meetingData?.userEmail}</Title>
                            <Text>meeting organizer</Text>
                        </Flex>
                    </Flex>

                    <Flex align='center' style={{ width: "100%", height: "100%" }} vertical>



                        <Flex vertical align="flex-start" justify="space-around" style={{ width: "100%", height: "30%" }}>
                            <Title level={5}>{meetingData?.title}</Title>
                            <Text style={{ fontWeight: 'bold' }}><img src='/pin.png' style={{ height: 20, width: 20, marginRight: 10 }} alt='location Icon' />{meetingData?.location} </Text>
                            <Text style={{ fontWeight: 'bold' }}><img src='/left.png' style={{ height: 20, width: 20, marginRight: 10 }} alt='description Icon' />{meetingData?.descriptions}</Text>
                            <Text style={{ fontWeight: 'bold' }}><Checkbox style={{ height: 20, width: 20, marginRight: 10 }} checked={true}></Checkbox>Yes, i can </Text>
                            <Text style={{ fontWeight: 'bold' }}><Checkbox style={{ height: 20, width: 20, marginRight: 10 }} checked={false}></Checkbox>No, i can not </Text>
                        </Flex>

                    </Flex>
                </Flex>

                <Flex align='center' vertical style={{ width: "500px", padding: 20 }}>
                    <Title level={2}>Select your preferred hours</Title>
                    <Text style={{ marginBottom: 20 }}>We will notify you when the organizer chooses the best time</Text>
                    <Input value={name} onChange={(e) => { setName(e.currentTarget.value) }} style={{ marginBottom: 20 }} size="large" placeholder="Write your name" prefix={<UserOutlined />} />
                    <Input value={email} type="email" onChange={(e) => { setEmail(e.currentTarget.value) }} style={{ marginBottom: 20 }} size="large" placeholder="Write your email" prefix={<MailOutlined />} />
                    {renderDates()}
                </Flex>
            </Flex>
        </Flex>
    )


}

export default SelectionOfDates