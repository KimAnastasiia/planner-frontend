import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Flex, Input, Switch, Calendar,Avatar, Divider, List, Skeleton, TimePicker, Col, Radio, Row, Select, Typography, theme } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import "../App.css"
import InfiniteScroll from 'react-infinite-scroll-component';
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Commons from '../Utility/url';

let CreateMeeting = () => {
    const { Search } = Input;
    const { Title } = Typography;
    let navigate = useNavigate()
    const { token } = theme.useToken();
    const [formData, setFormData] = useState({
        title: '',
        descriptions: '',
        location: '',
        onlineConference: false,
        private:false,
        invited:[],
        oneToOne:false
    });
    let indexTime = useRef(0)
    const [selectedDate, setSelectedDate] = useState([])
    const [defaultTime, setDefaultTime] = useState("")
    const [messageApi, contextHolder] = message.useMessage();
    const [sameTimeForAll, setSameTimeForAll] = useState(false)
    const [actualInvited, setActualInvited]=useState("")
    useEffect(() => {
       if(sameTimeForAll){
            addDefaultTime()
       }else{
        setDefaultTime("")
       }
    }, [sameTimeForAll,defaultTime, selectedDate.length]);

    const isValidEmail=(email)=>{
        // Regular expression for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    const addInvited=()=>{
        if(isValidEmail(actualInvited)){
            let copyOfInvatied=[...formData.invited]
            let exist = copyOfInvatied.find((p)=>p==actualInvited)
            if(!exist){
                copyOfInvatied.push(actualInvited)
                setFormData({
                    ...formData,
                    invited:copyOfInvatied
                });
                setActualInvited("")
            }else{
                invatedPersonAlreadyExistInList()
            }
        }else{
            messageApi.open({
                type: 'error',
                content: "Invalid email format",
            });
        }
    }
    let CreateNewMeeting = async () => {

        if(formData.title!=""&& (formData.location!="" || formData.onlineConference!=false) && selectedDate.length>0){
            let dateWithoutTime = selectedDate.find(d => d.times.length==0)

            if(dateWithoutTime){
                return didntAddAllInfo("in time of meetings")
            }
        }else{
            return didntAddAllInfo("in Title, Description, Location and days of meeting")
        }

        
        let objToSent = {
            ...formData,
            dates: [...selectedDate]
        }
        objToSent.invited=objToSent.invited.map((i)=>{
            return {
                email:i
            }
        })
        console.log(objToSent)
        let response = await fetch(Commons.baseUrl +"/meetings?access_token=" + localStorage.getItem("access_token"), {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(objToSent)
        })
        if (response.ok) {
            let data = await response.json()
            setSelectedDate([])
            setFormData({
                title: '',
                descriptions: '',
                location: '',
                onlineConference: false,
                private:false,
                invited:[]
            });
            navigate("/votes/" +data.token+"/"+data.meetingId)
            success()
        }else{
            failed()
        }

    }
    const success = () => {
        messageApi.open({
          type: 'success',
          content: 'The meeting created successfully',
        });
    };
    const invatedPersonAlreadyExistInList = () => {

        messageApi.open({
          type: 'error',
          content: 'The person with this email is already on your invite list',
        });

    };
    const failed = () => {
        messageApi.open({
          type: "error",
          content: 'Failed to create meeting, check the correctness of the entered data',
        });
    };
    const didntAddAllInfo = (data) => {
        messageApi.open({
          type: "error",
          content: 'Please enter data '+data,
        });
    };
    const onChangeSwitchs = (name, checked) => {
        setFormData({
            ...formData,
            [name]:checked
        });
        console.log(checked)
    };
    const onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);//2025-05-01 month
        //setSelectedDays([...selectedDays,value.format('YYYY-MM-DD'), mode])

    };
    const onSelectCalendar = (date, { source }) => {
        if (source === 'date') {
            let dateNew = date.format('YYYY-MM-DD')
            //console.log('Panel Select:', source);
            //console.log(dateNew)
            //dataNew
            let copyOfDay = [...selectedDate]
            let currentDay = copyOfDay.find((d) => d.date == dateNew)

            if (!currentDay) {
                setSelectedDate([...selectedDate, { date: dateNew, times: [] }])
            }
        }
    }
    const wrapperStyle = {
        width: 300,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        marginRight:10
    };
    const handleInputChange = (e, name, day) => {
        if(name=="defaultTime"){
            let curTime = e[0].$H + ":" + e[0].$m + "-" + e[1].$H + ":" + e[1].$m
            setDefaultTime(curTime)
           
        }else if (name == "time") {
            let curTime = e[0].$H + ":" + e[0].$m + "-" + e[1].$H + ":" + e[1].$m
            indexTime.current = indexTime.current + 1
            let copyOfDay = [...selectedDate]
            let currentDay = copyOfDay.find((d) => d.date == day)
            let exist = currentDay.times.find((t) => t.time == curTime)
            if (!exist) {
                currentDay.times.push({ time: curTime, timeId: indexTime.current })
                setSelectedDate(copyOfDay)
            }
        } else {
            setFormData({
                ...formData,
                [name]: e.currentTarget.value
            });
        }

    };
    const deleteTimeOfDate = (day, timeIndex) => {

        let copyOfDays = [...selectedDate]

        let currentDays = copyOfDays.map((d) => {
            if (d.day === day) {
                d.times = d.times.filter((time) => time.timeId !== timeIndex);
            }
            return d;
        });

        setSelectedDate(currentDays)
    }
    const addDefaultTime=()=>{
        
        if(defaultTime!=""){ 

            let copyOfDay = [...selectedDate]

            copyOfDay.map((d)=>{

                let exist = d.times.find((t)=>t.time==defaultTime)

                if(!exist){
                    indexTime.current = indexTime.current + 1
                    d.times.push({ time: defaultTime, timeId: indexTime.current })
                }
            })

            setSelectedDate(copyOfDay)
        }

    }

    const deleteDay = (day) => {
        let copyOfDays = [...selectedDate]
        let currentDays = copyOfDays.filter((d) => d.date !== day)
        setSelectedDate(currentDays)
    }
    const deleteEmailOfInvited=(email)=>{
        let listOfInvited=[...formData.invited]
        listOfInvited=listOfInvited.filter((e)=>e!=email)
        setFormData({
            ...formData,
            invited: listOfInvited
        });
    }
    return (
        <Flex justify='center' style={{ width: "100%", minHeight: "100vh" }}>
            {contextHolder}
            <Flex vertical justify='center' align='center' style={{ minHeight: "100vh", backgroundColor: "white", padding: 50 }}>
                <Title style={{ width: "100%", height: "40px", borderBottom: "1px solid #D3DCE3", margin: 30 }} level={3}>Create group poll</Title>

                <Flex justify="space-around">
                    <Flex vertical>
                        <Typography.Title level={5}>Title</Typography.Title>
                        <Input value={formData.title} onChange={(e) => { handleInputChange(e, "title") }} />

                        <Typography.Title level={5}>Description</Typography.Title>
                        <Input value={formData.descriptions} onChange={(e) => { handleInputChange(e, "descriptions") }} />

                        <Typography.Title level={5}>Location</Typography.Title>
                        <Input value={formData.location} onChange={(e) => { handleInputChange(e, "location") }} />

                        <Flex style={{ marginTop: 20 }}>
                            <Typography.Title level={5} style={{ marginRight: 20 }}>Online conference</Typography.Title>
                            <Switch value={formData.onlineConference} style={{ width: "30px" }} onChange={(checked)=>{onChangeSwitchs("onlineConference", checked)}} />
                        </Flex>

                        <Flex style={{ marginTop: 20 }}>
                            <Typography.Title level={5} style={{ marginRight: 20 }}>1:1</Typography.Title>
                            <Switch value={formData.oneToOne} style={{ width: "30px" }} onChange={(checked)=>{onChangeSwitchs("oneToOne", checked)}} />
                        </Flex>
                    </Flex>
                    <Flex vertical style={{marginLeft:30}}>
                        <Flex align='center' justify='center'>
                            <Typography.Title level={5} style={{ marginRight: 20 }}>Private meeting</Typography.Title>
                            <Switch style={{ width: "30px" }} onChange={(checked)=>{onChangeSwitchs("private", checked)}}/>
                        </Flex>
                        {formData.private&& 
                        <Flex  style={{marginBottom:10}}>
                            <Input value={actualInvited} onChange={(e)=>{setActualInvited(e.currentTarget.value)}} placeholder="Add emails of invited" />
                            <Button onClick={addInvited}>Add</Button>
                        </Flex>
                        }
                       
                        {formData.private &&
                        <div
                            id="scrollableDiv"
                            style={{
                                height: 300,
                                width:300,
                                overflow: 'auto',
                                padding: '0 16px',
                                border: '1px solid rgba(140, 140, 140, 0.35)',
                            }}
                        >
                            <InfiniteScroll
                                dataLength={formData.invited.length}
                            
                                loader={
                                <Skeleton
                                    avatar
                                    paragraph={{
                                    rows: 1,
                                    }}
                                    active
                                />
                                }
                                scrollableTarget="scrollableDiv"
                            >
                                <List
                                    dataSource={formData.invited}
                                    renderItem={(item) => (
                                    <List.Item key={item}>
                                        <List.Item.Meta
                                        
                                            title={<a href="https://ant.design">{item}</a>}
                                        
                                        />
                                        <Button onClick={()=>{deleteEmailOfInvited(item)}} danger>Delete</Button>
                                    </List.Item>
                                     )}
                                />
                            </InfiniteScroll>
                        </div>}
                    </Flex>
                 
                </Flex>

                <Title style={{ width: "100%", height: "40px", borderBottom: "1px solid #D3DCE3", margin: 30 }} level={3}>Add your times</Title>

                <Flex justify="space-around" style={{ width: "100%" }}>



                    <div style={wrapperStyle}>
                        <Typography.Title style={{ margin: 10 }} level={4}>Date</Typography.Title>
                        <Calendar
                            fullscreen={false}
                            headerRender={({ value, type, onChange, onTypeChange }) => {
                                const start = 0;
                                const end = 12;
                                const monthOptions = [];
                                let current = value.clone();
                                const localeData = value.localeData();
                                const months = [];
                                for (let i = 0; i < 12; i++) {
                                    current = current.month(i);
                                    months.push(localeData.monthsShort(current));
                                }
                                for (let i = start; i < end; i++) {
                                    monthOptions.push(
                                        <Select.Option key={i} value={i} className="month-item">
                                            {months[i]}
                                        </Select.Option>,
                                    );
                                }
                                const year = value.year();
                                const month = value.month();
                                const options = [];
                                for (let i = year - 10; i < year + 10; i += 1) {
                                    options.push(
                                        <Select.Option key={i} value={i} className="year-item">
                                            {i}
                                        </Select.Option>,
                                    );
                                }
                                return (
                                    <div
                                        style={{
                                            padding: 8,
                                        }}
                                    >

                                        <Row gutter={8}>
                                            <Col>
                                                <Radio.Group
                                                    size="small"
                                                    onChange={(e) => onTypeChange(e.target.value)}
                                                    value={type}
                                                >
                                                    <Radio.Button value="month">Month</Radio.Button>
                                                    <Radio.Button value="year">Year</Radio.Button>
                                                </Radio.Group>
                                            </Col>
                                            <Col>
                                                <Select
                                                    size="small"
                                                    dropdownMatchSelectWidth={false}
                                                    className="my-year-select"
                                                    value={year}
                                                    onChange={(newYear) => {
                                                        const now = value.clone().year(newYear);
                                                        onChange(now);
                                                    }}
                                                >
                                                    {options}
                                                </Select>
                                            </Col>
                                            <Col>
                                                <Select
                                                    size="small"
                                                    dropdownMatchSelectWidth={false}
                                                    value={month}
                                                    onChange={(newMonth) => {
                                                        const now = value.clone().month(newMonth);
                                                        onChange(now);
                                                    }}
                                                >
                                                    {monthOptions}
                                                </Select>
                                            </Col>
                                        </Row>
                                    </div>
                                );
                            }}
                            onPanelChange={onPanelChange}
                            onSelect={onSelectCalendar}
                        />
                    </div>
                    <div>
                       {selectedDate.length>0&&
                        <Flex vertical align='center'>
                            <Flex>
                                <Typography.Title level={5} style={{ marginRight: 20 }}>Add same time to all dates</Typography.Title>
                                <Switch value={sameTimeForAll} onChange={()=>{setSameTimeForAll(!sameTimeForAll)}} style={{ width: "30px" }} />
                            </Flex>
                            {sameTimeForAll&&<TimePicker.RangePicker onChange={(e) => { handleInputChange(e, "defaultTime") }}  format={"HH:mm"} style={{ margin: 20 }} />}
                        </Flex>}
                        {selectedDate.map((date) =>

                            <Flex align="center" style={{ border: "1px solid #D3DCE3", padding: 20, marginBottom: 20 }}>
                                <Flex>
                                    <Typography.Title level={5}>{date.date}</Typography.Title>
                                </Flex>
                                <Flex vertical align="center">

                                    {date.times.map((timeObj) =>

                                        <Flex style={{ border: "1px solid #D3DCE3", padding: 20, marginBottom: 20 }}>
                                            <Typography.Title level={5}>{timeObj.time}</Typography.Title>
                                            <Button onClick={() => { deleteTimeOfDate(date.day, timeObj.timeId) }} style={{ marginLeft: 20 }}><DeleteOutlined /></Button>
                                        </Flex>
                                    )}
                                    <Flex align='center'>
                                        <Typography.Title level={5} style={{ marginLeft: 20 }}>Choose time for this date</Typography.Title>
                                        <TimePicker.RangePicker onChange={(e) => { handleInputChange(e, "time", date.date) }} format={"HH:mm"} style={{ margin: 20 }} />
                                    </Flex>
                                </Flex>
                                <div>
                                    <Button danger type="dashed" onClick={() => { deleteDay(date.date) }}><DeleteOutlined /></Button>
                                </div>
                            </Flex>
                        )}
                    </div>
                </Flex>

                <Button onClick={CreateNewMeeting} type="primary" style={{ width: "100%", marginTop: "30px" }}>
                    Submit
                </Button>
            </Flex>

        </Flex>
    )
};

export default CreateMeeting;