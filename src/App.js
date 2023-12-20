
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import "antd/dist/reset.css"
import { Layout, notification } from "antd"
import { useEffect, useState } from "react";
import Login from "./Login";
import MenuComponent from "./Components/Menu";
import { Button, Divider, Flex, Radio } from 'antd';
import Registration from "./Components/Registration";
import MenuApiComponent from "./Components/MenuApi";


let App = () => {

  let navigate = useNavigate()
  let location = useLocation()
  let [login, setLogin] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    checkLoginIsActive();
  }, [localStorage.getItem("apiKey")])

  let checkLoginIsActive = async () => {

    if (localStorage.getItem("apiKey") == null) {
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

  let disconnect = async () => {
    localStorage.removeItem("apiKey");
    setLogin(false)
    navigate("/login")
  }


  let { Header, Content, Footer } = Layout;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}

      <Header style={{backgroundColor:"#E8D913"}}>
        <Flex align='center' justify="center" style={{ height:"100%", width:"100%"}}>
          <MenuComponent/>
        </Flex>
      </Header>

      <Content style={{ padding: "20px 50px" }}>
        <Routes>
          <Route path="/login" element={
            <Login openNotification={openNotification} />
          }></Route>
          <Route path="/registration" element={
            <Registration openNotification={openNotification} />
          }></Route>
        </Routes>
      </Content>

      <Footer style={{ textAlign: "center" }}> My Website</Footer>

    </Layout>
  );
}

export default App;
