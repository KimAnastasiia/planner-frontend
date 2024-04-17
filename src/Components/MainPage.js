import { Button, Avatar, Flex, Typography, message, Input, Checkbox, Table, Switch, Tooltip, Select, Image } from 'antd';
import "../App.css"
import { useNavigate } from "react-router-dom";
import { Col, Row } from 'antd';

const MainPage = () => {
    const { Title } = Typography;
    let navigate = useNavigate()
    return (
        <Flex vertical align='center' justify="center" style={{ width: "100%", backgroundColor: "#FFFFFF" }}>
    
            <Flex style={{minHeight:"90vh", padding:30}}>
                <Row>
                    <Col  md={24} lg={12}>
                        <Flex vertical >
                            <h1 style={{fontSize:35, lineHeight:1.5, color:"black"}}>Simplify
                            your meet-ups today!</h1>
                            <h3 style={{fontSize:25, lineHeight:1.5, color:"#7895CB"}}>
                                Create quick surveys, offer multiple time options, and let participants choose the best fit. 
                            </h3>
                           
                        </Flex>
                        <Flex justify='center' style={{width:"100%"}}>
                             <Button shape="round" style={{width:300, backgroundColor:"#4A55A2"}} onClick={()=>{navigate("/login")}} type='primary' >Create meeting</Button>
                        </Flex>
                    </Col>
                    <Col md={24} lg={12}>
                        <img
                            src={"/descarga.jpg"}
                            alt="comunication Icon"
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
              
            </Flex>
            <Flex justify='center' align='center' vertical style={{minHeight:"100vh",padding:30, backgroundColor:"#E8EDFF"}}>
                <Flex align='center' style={{minHeight:"50vh"}}>
                    <h3 style={{color: "black", fontSize:40,  marginBottom:20, textAlign:"center"}}>Optimize your time organizing your schedule and calendar. Useful for Recruitment, Business Meetings, Sales, Training, etc.</h3>
                </Flex>
                <Flex>

                    <Row>
                        <Col  md={24} lg={12}>
                            <Flex vertical>
                                <h3 style={{fontSize:25, lineHeight:1.5, color:"black"}}>Managing appointments has never been easier or more flexible. </h3>
                                <text style={{fontSize:25, lineHeight:1.5, color:"#7895CB"}}>Create personalized calendars and let your users book their preferred times. </text>
                            </Flex>
                        </Col>
                        <Col md={24} lg={12}>
                            <Flex>
                                <img
                                    src={"/best-online-meeting-platforms.png"}
                                    alt="comunication Icon"
                                    style={{ width: '100%' }}
                                />
                            </Flex>
                        </Col>
                    </Row>
                </Flex>
            </Flex>
        </Flex>

    )
}
export default MainPage