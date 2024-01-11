/* eslint-disable no-undef */
import React, { useRef, useState, useEffect } from 'react';
import { Button, Avatar, Flex, Typography, message, Input, Checkbox, Table, Row, Select, theme } from 'antd';
import { PlusOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import "../App.css"
import Commons from '../Utility/url';
import { useParams } from "react-router-dom";
let SelectionOfDates = () => {

    const { Text } = Typography;
    const { id } = useParams()
    const { token } = useParams()
    let [meetingData, setMeetingData] = useState()
    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    const { Title } = Typography;
    let [ids, setIds] = useState([])
    let [votes, setVotes] = useState([])
    let [disableButton, setDisableButton] = useState(true)
    let [columnsArray, setColumnsArray] = useState([])
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        getMeetingInfo()
    }, [])

    useEffect(() => {
        if (name && email && name != "" && email != "") {
            setDisableButton(false)
        } else {
            setDisableButton(true)
        }
    }, [email, name])

    let getVotes = async (meetingData) => {

        let response = await fetch(Commons.baseUrl + "/participation-public/" + id)
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

            let objetPutYourChoose = {
                name: "You"
            }
            console.log(meetingData)
            meetingData?.dates?.forEach((d) => {
                d.times.forEach((t) => objetPutYourChoose[t.id] = t.id)
            })
            newAr.unshift(objetPutYourChoose)
            setVotes(newAr)

        }


    }

    let getMeetingInfo = async () => {
        let response = await fetch(Commons.baseUrl + `/meetings-public?meetingId=${id}&token=${token}`)
        if (response.ok) {
            let data = await response.json()
            console.log(data)
            setMeetingData(data[0])
            createColumns(data[0])
            getVotes(data[0])
        }

    }

    let addParticipation = async () => {

        let arrayOfTimes = [
            ...ids]

        let response = await fetch(Commons.baseUrl + "/participation", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail: email,
                name: name,
                meetingId: meetingData.id,
                timesIds: arrayOfTimes
            })
        })
        if (response.ok) {
            let data = await response.json()
            
            setIds([])
            setName("")
            setEmail("")

            getVotes()
            success()
        }

    }
    const success = () => {
        messageApi.open({
          type: 'success',
          content: 'You have successfully selected the appropriate dates',
        });
      };
    let checkBoxChange = (e, timeId) => {

        setIds((prevIds) => {
            let copyOfTimesIds = [...prevIds];
    
            if (e.target.checked) {
                let currentTime = copyOfTimesIds.find((time) => time === timeId);
    
                if (!currentTime) {
                    copyOfTimesIds = [...prevIds, timeId];
                }
            } else {
                copyOfTimesIds = copyOfTimesIds.filter((time) => time !== timeId);
            }
    
            console.log(copyOfTimesIds); // This will log the updated array
    
            return copyOfTimesIds;
        });
    }

    let createColumns = (currentMeeting) => {

        let columns=[]
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
                <Button disabled={disableButton} onClick={addParticipation} type="primary" style={{ width: "100%" }}>Save</Button>
            </div>
        )
    }
    return (
        <Flex align='center' justify='center' style={{ height: "100vh", width: "100%" }}>
              {contextHolder}
            <Flex style={{ border: "1px solid #D3DCE3", height: "70%", width: "1000px", backgroundColor: "white", borderRadius: 10 }}>
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

                <Flex align='center' vertical style={{ width: "600px", padding: 20 }}>
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