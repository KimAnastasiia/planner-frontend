
import { Routes, Route, Navigate , useNavigate, useLocation } from "react-router-dom";
import "antd/dist/reset.css"
import { Layout, notification } from "antd"
import { useEffect, useState } from "react";
import MenuComponent from "./Components/Menu";
import { Button, Divider, Flex, Radio } from 'antd';
import Registration from "./Components/Registration";
import MenuApiComponent from "./Components/MenuApi";
import Login from "./Components/Login";
import CreateMeeting from "./Components/CreateMeeting";
import SelectionOfDates from "./Components/SelectionOfDates";
import DashboarComponent from "./Components/Dashboard";
import VotesComponent from "./Components/Votes";
import EditMeeting from "./Components/EditMeeting";
import "./App.css"
import ListOfInvitations from "./Components/ListOfInvitations";
import PrivateSelectionOfDates from "./Components/PrivateSelectionOfDates";
import AccounSettings from "./Components/AccounSettings";
import Commons from "./Utility/url";
import MainPage from "./Components/MainPage";

let App = () => {

  let navigate = useNavigate()
  let location = useLocation()


  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    verification();
  }, [localStorage.getItem("access_token")])

  const verification = async () => {

    let response = await fetch(Commons.baseUrl + "/users?access_token=" + localStorage.getItem("access_token"))

    if (response.ok) {

    }else if(localStorage.getItem("voterToken")){
      
    }else{
      localStorage.clear();
  
    }

  }

  const openNotification = (placement, text, type) => {
    api[type]({
      message: 'Notification',
      description: text,
      placement,
    });
  };




  let { Header, Content, Footer } = Layout;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}

      <Header style={{backgroundColor:"#E8D913"}}>
        <Flex align='center' justify="center" style={{ height:"100%", width:"100%"}}>
          {!localStorage.getItem("access_token")&&<MenuComponent/>}
          {localStorage.getItem("access_token")&&<MenuApiComponent/>}
        </Flex>
      </Header>

      <Content style={{ padding: "20px 50px" }}>
        <Routes>
          <Route path="/login" element={
            <Login openNotification={openNotification} />
          }></Route>
          <Route path="/registration" element={
            <Registration  />
          }></Route>
            <Route path="/createMeeting" element={
            <CreateMeeting />
          }></Route>
          <Route path="/participate/:token/:id" element={
            <SelectionOfDates  />
          }></Route>
          <Route path="/participate/:token/:id/:voterToken" element={
            <SelectionOfDates  />
          }></Route>
          <Route path="/private-participate/:token/:id" element={
            <PrivateSelectionOfDates  />
          }></Route>
          <Route path="/dashboard" element={
            <DashboarComponent />
          }></Route>
          <Route path="/votes/:token/:meetingId" element={
            <VotesComponent />
          }></Route>
          <Route path="/edit/meeting/:meetingToken/:meetingId" element={
            <EditMeeting />
          }></Route>
          <Route path="/allInvitations" element={
            <ListOfInvitations />
          }></Route>
          <Route path="/account" element={
            <AccounSettings />
          }></Route>
          <Route path="/" element={
            <MainPage />
          }></Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Content>

      <Footer style={{ textAlign: "center" }}> MeetFlow Planner</Footer>

    </Layout>
  );
}

export default App;
