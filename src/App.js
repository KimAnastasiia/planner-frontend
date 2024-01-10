
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
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

let App = () => {

  let navigate = useNavigate()
  let location = useLocation()
  let [login, setLogin] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    checkLoginIsActive();
  }, [localStorage.getItem("access_token")])

  let checkLoginIsActive = async () => {

    if (localStorage.getItem("access_token") == null) {
      setLogin(false);
      return;
    } else {
      setLogin(true)
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
          <Route path="/participate/:id" element={
            <SelectionOfDates  />
          }></Route>
          <Route path="/dashboard" element={
            <DashboarComponent />
          }></Route>
          <Route path="/votes/:token/:meetingId" element={
            <VotesComponent />
          }></Route>
          <Route path="/edit/meeting/:meetingId" element={
            <EditMeeting />
          }></Route>
        </Routes>
      </Content>

      <Footer style={{ textAlign: "center" }}> My Website</Footer>

    </Layout>
  );
}

export default App;
