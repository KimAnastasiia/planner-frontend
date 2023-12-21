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
        date: ''
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
    const MyFormItemContext = React.createContext([]);
    function toArr(str) {
        return Array.isArray(str) ? str : [str];
    }

    const MyFormItemGroup = ({ prefix, children }) => {
        const prefixPath = React.useContext(MyFormItemContext);
        const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix]);
        return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>;
    };

    const MyFormItem = ({ name, ...props }) => {
        const prefixPath = React.useContext(MyFormItemContext);
        const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;
        return <Form.Item name={concatName} {...props} />;
    };

    const onChange = (checked) => {
        setFormData({
            ...formData,
            videoConference: checked
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
            <Flex vertical style={{ width: "70%", minHeight: "100vh", backgroundColor: "white", padding: 50 }}>
                <Title style={{ width: "100%", height: "40px", borderBottom: "1px solid #D3DCE3", margin: 30 }} level={3}>Create group poll</Title>
                <Form name="form_item_path" layout="vertical" onFinish={CreateNewMeeting}>
                    <MyFormItemGroup prefix={['user']}>
                        <MyFormItemGroup prefix={['name']}>
                            <MyFormItem name="Title" label="Title">
                                <Input onChange={(e) => { handleInputChange(e, "title") }} />
                            </MyFormItem>

                            <MyFormItem name="Description" label="Description (optional)">
                                <Input onChange={(e) => { handleInputChange(e, "descriptions") }} />
                            </MyFormItem>
                        </MyFormItemGroup>

                        <MyFormItem name="Location" label="Location (optional)">
                            <Input onChange={(e) => { handleInputChange(e, "location") }} />
                        </MyFormItem>

                        <MyFormItem name="VideoConferencing" label="Video conferencing">
                            <Switch onChange={onChange} />
                        </MyFormItem>

                    </MyFormItemGroup>

                    <Title style={{ width: "100%", height: "40px", borderBottom: "1px solid #D3DCE3", margin: 30 }} level={3}>Add your times</Title>

                    <MyFormItemGroup prefix={['user']}>
                        <MyFormItemGroup prefix={['name']}>
                            <MyFormItem name="Duration" label="Duration">
                                <TimePicker.RangePicker format="HH:mm" onChange={(e) => { handleInputChange(e, "time") }} />
                            </MyFormItem>
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
                                                <Typography.Title level={4}>Custom header</Typography.Title>
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
                                />
                            </div>
                        </MyFormItemGroup>
                        <Flex align='center' justify='center' style={{ width: "100%" }}>
                            <Button type="primary" htmlType="submit" style={{ width: "50%", marginTop: "30px" }}>
                                Submit
                            </Button>
                        </Flex>
                    </MyFormItemGroup>
                </Form>
            </Flex>

        </Flex>
    )
};

export default CreateMeeting;