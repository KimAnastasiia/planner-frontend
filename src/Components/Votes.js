/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Button, Avatar, Flex, Typography, Pagination, Input, Checkbox, Table, Row, Select, theme } from 'antd';
import { PlusOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import "../App.css"
import Commons from '../Utility/url';
import { useParams } from "react-router-dom";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
let VotesComponent = () => {

    const { Text } = Typography;
    const { meetingId } = useParams()
    let [meetingData, setMeetingData] = useState()
    const { Title } = Typography;
    let [ids, setIds] = useState([6, 7])
    let [votes, setVotes] = useState([])
    let [columnsArray, setColumnsArray] = useState([])
    let navigate = useNavigate()
    useEffect(() => {
        getMeetingInfo()
    }, [])

    let getVotes = async () => {

        let response = await fetch(Commons.baseUrl + `/participation/${meetingId}?access_token=${localStorage.getItem("access_token")}`)
        if (response.ok) {
            let data = await response.json()
            const result = data.reduce((acc, item) => {
                if (acc.includes(item.name)) {
                    return acc; // если значение уже есть, то просто возвращаем аккумулятор
                }
                return [...acc, item.name]; // добавляем к аккумулятору и возвращаем новый аккумулятор
            }, []);


            let newAr = result.map(name => ({ name }))
            newAr.forEach((n) => {
                data.forEach((v) => {
                    if (n.name == v.name) {
                        n[v.time.id] = "x"
                    }
                })
            })

            setVotes(newAr)

        }


    }

    let getMeetingInfo = async () => {
        let response = await fetch(Commons.baseUrl + "/meetings?meetingId=" + meetingId)
        if (response.ok) {
            let data = await response.json()
            console.log(data)
            setMeetingData(data[0])
            createColumns(data[0])
            getVotes(data[0])
        }

    }

    let checkBoxChange = (e, timeId) => {

        let copyOfDates = [...ids]
        if (e.target.checked == true) {


            let currentTime = copyOfDates.find((time) => time == timeId)


            if (!currentTime) {
                copyOfDates = [...ids, timeId]

            }
            setIds(copyOfDates)
        }
        if (e.target.checked == false) {

            copyOfDates = copyOfDates.filter((time) => time !== timeId)

            setIds(copyOfDates)
        }
        console.log(copyOfDates)
        console.log(ids)

    }

    let createColumns = (currentMeeting) => {

        let columns = []

        columns.push({
            title: '',
            dataIndex: 'name',
            key: 'name',
        })

        currentMeeting?.dates?.map((d) => {

            return d.times.map((t) => {

                const dateArray = d.date.split("-");
                const year = parseInt(dateArray[0], 10);
                const month = parseInt(dateArray[1], 10) - 1; // Month is 0-indexed in JavaScript
                const day = parseInt(dateArray[2], 10);
                const dateObject = new Date(year, month, day)
                const monthAbbreviation = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObject);
                const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObject);




                columns.push({
                    title:
                        <Flex key={t.time} align='center' justify='center' vertical style={{ width: "100%" }}  >
                            <Text style={{ fontWeight: 'bold', color: "gray" }}>{monthAbbreviation}</Text>
                            <Title style={{ margin: 0, fontWeight: 'bold' }} level={2}>{day}</Title>
                            <Text style={{ fontWeight: 'bold', color: "gray" }}>{dayOfWeek}</Text>
                            <Text style={{ fontWeight: 'bold' }}>{t.time}</Text>
                        </Flex>,

                    dataIndex: t.id,
                    key: t.id,
                    render: (timeId) => (timeId == "x" || !timeId ? timeId : <Checkbox onChange={(e) => { checkBoxChange(e, timeId) }}></Checkbox>),
                })



            }

            )
        })
        if (columns.length > 0) {
            setColumnsArray(columns)
        }
    }


    let renderDates = () => {

        return (
            <div style={{ width: "100%" }}>
                <Table
                    columns={columnsArray}
                    dataSource={votes}
                    scroll={{ x: 900, y: 170 }}
                    bordered
                />
            </div>
        )
    }
    let shareLink = () => {
        navigator.share({
            title: 'Shared Link',
            text: 'Check out this link!',
            url: "/participate/" + meetingId
        })
    }

    return (
        <Flex align='center' justify='center' style={{ height: "100vh", width: "100%" }}>
            <Flex vertical style={{ border: "1px solid #D3DCE3", height: "70%", width: "1000px", backgroundColor: "white", borderRadius: 10 }}>
                <Flex style={{ borderBottom: "1px solid #D3DCE3", height: "40%" }}>

                    <Flex justify="space-between" vertical style={{ width: "70%", padding: 30 }}>

                        <Title level={2}>{meetingData?.title}</Title>
                        <Text style={{ fontWeight: 'bold' }}><Avatar size="small" style={{ marginRight: 10 }} icon={<UserOutlined />} />You are the organizer of the group event.</Text>
                        <Text style={{ fontWeight: 'bold' }}><img src='/pin.png' style={{ height: 20, width: 20, marginRight: 10 }} alt='location Icon' />{meetingData?.location} </Text>
                        <Text style={{ fontWeight: 'bold' }}><img src='/left.png' style={{ height: 20, width: 20, marginRight: 10 }} alt='description Icon' />{meetingData?.descriptions}</Text>
                        <Text style={{ fontWeight: 'bold' }}><Checkbox style={{ height: 20, width: 20, marginRight: 10 }} checked={true}></Checkbox>Yes, i can </Text>
                        <Text style={{ fontWeight: 'bold' }}><Checkbox style={{ height: 20, width: 20, marginRight: 10 }} checked={false}></Checkbox>No, i can not </Text>
                    </Flex>
                    <Flex align='center' justify='center'>
                        <Button >Preview</Button>
                        <Button style={{ margin: 20 }} onClick={() => { navigate("/edit/meeting/" + meetingData?.id) }}>Edit</Button>
                        <Button onClick={() => { shareLink() }} type='primary'>Share invite</Button>
                    </Flex>
                </Flex>
                <Flex align='center' vertical style={{ width: "100%", height: "60%", padding: 20 }}>
                    {renderDates()}
                </Flex>
            </Flex>
        </Flex>
    )


}

export default VotesComponent