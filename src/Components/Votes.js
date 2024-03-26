/* eslint-disable no-undef */
import React, { useState,useRef, useEffect } from 'react';
import { Button, Avatar, Flex, Card, Col, Image, Typography, Pagination, Input, Checkbox, Table, Select, Tooltip } from 'antd';
import { PlusOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import "../App.css"
import Commons from '../Utility/url';
import { useParams } from "react-router-dom";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import TableHeadreStatistic from './TableHeadreStatistic';
let VotesComponent = () => {
    const [datesForSelect, setDatesForSelect] = useState([])
    const { Text } = Typography;
    const { meetingId } = useParams()
    const { token } = useParams()
    let [meetingData, setMeetingData] = useState()
    const { Title } = Typography;
    let [votes, setVotes] = useState([])
    let [columnsArray, setColumnsArray] = useState([])
    let navigate = useNavigate()
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    useEffect(() => {
        getMeetingInfo()
    }, [])

    const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 600); // Update isSmallScreen based on window width
    };

    useEffect(() => {
        console.log(window.innerWidth)

        handleResize()
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [window.innerWidth]);

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
            return countVotess(newAr)
        }


    }

    let getMeetingInfo = async (arrayOfDates) => {
        let response = await fetch(Commons.baseUrl + `/meetings?meetingId=${meetingId}&token=${token}&access_token=${localStorage.getItem("access_token")}`)
        if (response.ok) {
            let data = await response.json()
            setMeetingData(data[0])
            let infoOfVotes = await getVotes(data[0])
            createColumns(data[0], arrayOfDates, infoOfVotes)
            let arrayInSelect = []

            data[0].dates.forEach((d) => {
                arrayInSelect.push({
                    value: d.date,
                    label: d.date
                })
            })
            setDatesForSelect(arrayInSelect)
        }

    }

    const onChangeSelect = (arrayOfDates) => {

        getMeetingInfo(arrayOfDates)

    }

    let createColumns = (currentMeeting, arrayOfDates, infoOfVotes) => {

        let columns = []

        columns.push({
            title: 'Participants',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left'
        })

        currentMeeting?.dates?.map((d) => {
            if (arrayOfDates?.length > 0) {
                arrayOfDates?.forEach((daySelected) => {
                    if (d.date == daySelected) {
                        return d.times.map((t) => {
                            columns.push({
                                title: <TableHeadreStatistic dateData={d} timeInfo={t} infoOfVotes={infoOfVotes} />,
                                dataIndex: t.id,
                                key: t.id,
                                render: (timeId) => ((timeId == "x" || !timeId) &&
                                    <Flex justify='center' style={{ width: "100%" }}>{timeId}</Flex>)
                           
                            })
                        })
                    }
                })
            } else {
                return d.times.map((t) => {
                    columns.push({
                        date: d.date,
                        title: <TableHeadreStatistic dateData={d} timeInfo={t} infoOfVotes={infoOfVotes} />,
                        dataIndex: t.id,
                        key: t.id,
                        render: (timeId) => ((timeId == "x" || !timeId) &&
                            <Flex justify='center' style={{ width: "100%" }}>{timeId}</Flex>)
                      
                    })
                })
            }
        })
        if (columns.length > 0) {
            setColumnsArray(columns)
        }
    }

    let countVotess = (arrOfVotes) => {

        let votesStadistic = []

        arrOfVotes.forEach((v) => {
            const attributeNamesArray = Object.keys(v);
            attributeNamesArray.forEach((atrName) => {
                if (atrName != "name") {
                    let exist = votesStadistic.find((date) => date.timeId == atrName)
                    if (!exist) {
                        votesStadistic.push({
                            numberOfVotes: 1,
                            timeId: atrName,
                            names: [v.name]
                        })
                    } else {
                        exist.numberOfVotes++
                        exist.names.push(v.name)
                    }
                }
            })
        })
     
        return votesStadistic
    }
    let renderDates = () => {

        return (
            <div style={{ width: "100%" }}>
                <Table
                    columns={columnsArray}
                    dataSource={votes}
                    bordered
                />
            </div>
        )
    }
    let shareLink = () => {
        navigator.share({
            title: 'Shared Link',
            text: 'Check out this link!',
            url: `/participate/${token}/${meetingId}`
        })
    }
    if (isSmallScreen) {
        return (
            <Flex style={{ minHeight: "100vh", width: "100%" }}>
                <Flex vertical style={{ border: "1px solid #D3DCE3", minHeight: "100vh", backgroundColor: "white", width: "100%", borderRadius: 10 }}>
                    <Flex vertical style={{ borderBottom: "1px solid #D3DCE3", height: "40%", padding: 10, justifyContent: "space-around" }}>
                        <Flex style={{ justifyContent: "center" }}>
                            <Title level={2}>{meetingData?.title}</Title>
                        </Flex>
                        <Flex>
                            <Button type='primary' style={{ marginLeft: 5, marginRight: 5 }} onClick={() => { navigate(`/edit/meeting/${token}/${meetingData?.id}`) }}>Edit</Button>
                            {!meetingData?.private && <Button onClick={() => { shareLink() }} type='primary'>Share invite</Button>}
                        </Flex>
                        <Text style={{ marginTop: 10 }}><Avatar size="small" style={{ marginRight: 10 }} icon={<UserOutlined />} />You are the organizer of the group event.</Text>
                        <Flex style={{ justifyContent: "center", marginTop: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Availabilities</Text>
                        </Flex>
                        <Flex vertical>
                            <Text style={{ fontWeight: 'bold' }}><img src='/pin.png' style={{ height: 20, width: 20, marginRight: 10 }} alt='location Icon' />{meetingData?.location} </Text>
                            <Text style={{ fontWeight: 'bold' }}><img src='/left.png' style={{ height: 20, width: 20, marginRight: 10 }} alt='description Icon' />{meetingData?.descriptions}</Text>
                            <Text ><Checkbox style={{ height: 20, width: 20, marginRight: 10 }} checked={true}></Checkbox>Yes, i can </Text>
                            <Text ><Checkbox style={{ height: 20, width: 20, marginRight: 10 }} checked={false}></Checkbox>No, i can not </Text>
                        </Flex>
                    </Flex>
                    <Flex align='center' vertical style={{ width: "100%", minHeight: "60%", padding: 20 }}>
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            placeholder="Filter by days"
                            optionFilterProp="children"
                            options={datesForSelect}
                            onChange={onChangeSelect}
                            style={{ width: "90%", marginBottom: 10 }}
                        />
                        {renderDates()}
                    </Flex>
                </Flex>
            </Flex>
        )
    }
    return (
        <Flex align='center' justify='center' style={{ height: "100vh", width: "100%" }}>
            <Flex vertical style={{ border: "1px solid #D3DCE3", backgroundColor: "white", borderRadius: 10, padding: 20, width: "60%" }}>
                <Flex style={{ borderBottom: "1px solid #D3DCE3" }}>

                    <Flex justify="space-between" vertical style={{ width: "70%" }}>

                        <Title level={2}>{meetingData?.title}</Title>
                        <Text style={{ fontWeight: 'bold' }}><Avatar size="small" style={{ marginRight: 10 }} icon={<UserOutlined />} />You are the organizer of the group event.</Text>
                        <Text style={{ fontWeight: 'bold' }}><img src='/pin.png' style={{ height: 20, width: 20, marginRight: 10 }} alt='location Icon' />{meetingData?.location} </Text>
                        <Text style={{ fontWeight: 'bold' }}><img src='/left.png' style={{ height: 20, width: 20, marginRight: 10 }} alt='description Icon' />{meetingData?.descriptions}</Text>
                        <Text style={{ fontWeight: 'bold' }}><Checkbox style={{ height: 20, width: 20, marginRight: 10 }} checked={true}></Checkbox>Yes, i can </Text>
                        <Text style={{ fontWeight: 'bold' }}><Checkbox style={{ height: 20, width: 20, marginRight: 10 }} checked={false}></Checkbox>No, i can not </Text>
                    </Flex>
                    <Flex align='center'>

                        <Button type='primary' style={{ marginLeft: 20, marginRight: 20 }} onClick={() => { navigate(`/edit/meeting/${token}/${meetingData?.id}`) }}>Edit</Button>
                        {!meetingData?.private && <Button onClick={() => { shareLink() }} type='primary'>Share invite</Button>}
                    </Flex>
                </Flex>
                <Flex align='center' vertical style={{ width: "100%", height: "60%", padding: 20 }}>
                    <Select
                        mode="multiple"
                        allowClear
                        showSearch
                        placeholder="Filter by days"
                        optionFilterProp="children"
                        options={datesForSelect}
                        onChange={onChangeSelect}
                        style={{ width: "30%", marginBottom: 10 }}
                    />
                    {renderDates()}
                </Flex>
            </Flex>
        </Flex>
    )
}




export default VotesComponent