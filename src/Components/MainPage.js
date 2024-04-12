import { Button, Avatar, Flex, Typography, message, Input, Checkbox, Table, Switch, Tooltip, Select, Image } from 'antd';
import "../App.css"
import { Col, Row } from 'antd';

const MainPage = () => {
    const { Title } = Typography;
    return (
        <Flex  vertical justify="flex-end" style={{ padding: 30 , width: "100%", backgroundColor: "#FFFFFF" }}>
            <Flex vertical align='center' justify='center'>
                
                <h1 style={{color: "#462B51",fontSize:50}}>MeetFlow </h1> 
                <h2 style={{color: "#3895E2", fontSize:40}}>Streamline Your Meeting Experience</h2>

            </Flex>
            <Flex>

            <Row>
                <Col  md={24} lg={12}>
                    <h3 style={{fontSize:25, lineHeight:1.5, color:"#4EB5E8"}}>
                        Welcome to MeetFlow, your all-in-one solution for organizing seamless meetings, whether online or offline. With MeetFlow, you can effortlessly schedule, manage, and host meetings, making collaboration a breeze. Say goodbye to scheduling conflicts and communication chaos – MeetFlow has got you covered.
                    </h3>
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
        </Flex>

    )
}
export default MainPage