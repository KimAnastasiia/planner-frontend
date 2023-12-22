import React, { useState } from 'react';
import { Button, Form, Flex, Input, Switch, TimePicker, Calendar, Col, Radio, Row, Select, Typography, theme } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import "../App.css"

import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

let CreateMeeting = () => {

    const { Title } = Typography;
    let navigate = useNavigate()
    const { token } = theme.useToken();
    const [formData, setFormData] = useState({
        title: '',
        descriptions: '',
        location: '',
        time: '',
        date: '',
        onlineConference: false
    });

    let CreateNewMeeting = async () => {

        let response = await fetch("http://localhost:3001/meetings?access_token=" + localStorage.getItem("access_token"), {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })

        console.log(response)
    }

    const onChange = (checked) => {
        setFormData({
            ...formData,
            onlineConference: checked
        });
        console.log(checked)
    };
    const onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);//2025-05-01 month
        setFormData({
            ...formData,
            date: value.format('YYYY-MM-DD')
        });

    };
    const onSelectCalendar = (date, { source }) => {
        if (source === 'date') {
            let dataNew = date.format('YYYY-MM-DD')
            console.log('Panel Select:', source);
            console.log(dataNew)
            setFormData({
                ...formData,
                date: dataNew
            });
        }
    }
    const wrapperStyle = {
        width: 300,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };
    const handleInputChange = (e, name) => {

        if (name == "time") {
            setFormData({
                ...formData,
                [name]: e[0].$H + ":" + e[0].$m + "-" + e[1].$H + ":" + e[1].$m
            });

        } else {
            setFormData({
                ...formData,
                [name]: e.currentTarget.value
            });
        }

    };
    return (
        <Flex justify='center' style={{ width: "100%", minHeight: "100vh" }}>
            <Flex vertical justify='center' align='center' style={{ width: "70%", minHeight: "100vh", backgroundColor: "white", padding: 50 }}>
                <Title style={{ width: "100%", height: "40px", borderBottom: "1px solid #D3DCE3", margin: 30 }} level={3}>Create group poll</Title>

                <Flex vertical style={{ width: "400px" }}>

                    <Typography.Title level={5}>Title</Typography.Title>
                    <Input value={formData.title} onChange={(e) => { handleInputChange(e, "title") }} />

                    <Typography.Title level={5}>Description</Typography.Title>
                    <Input onChange={(e) => { handleInputChange(e, "descriptions") }} />

                    <Typography.Title level={5}>Location</Typography.Title>
                    <Input onChange={(e) => { handleInputChange(e, "location") }} />

                    <Flex style={{ marginTop: 20 }}>
                        <Typography.Title level={5} style={{ marginRight: 20 }}>Online conference</Typography.Title>
                        <Switch style={{ width: "30px" }} onChange={onChange} />
                    </Flex>

                </Flex>

                <Title style={{ width: "100%", height: "40px", borderBottom: "1px solid #D3DCE3", margin: 30 }} level={3}>Add your times</Title>

                <Flex vertical style={{ width: "400px" }}>
                    <Typography.Title level={5}>Time of meeting</Typography.Title>
                    <TimePicker.RangePicker style={{ marginBottom: 20 }} format="HH:mm" onChange={(e) => { handleInputChange(e, "time") }} />

                    <Typography.Title level={5}>Date</Typography.Title>
                    <div style={wrapperStyle}>
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
                </Flex>

                <Button onClick={CreateNewMeeting} type="primary" style={{ width: "100%", marginTop: "30px" }}>
                    Submit
                </Button>
            </Flex>

        </Flex>
    )
};

export default CreateMeeting;