
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import "antd/dist/reset.css"
import { Layout, Menu, notification } from "antd"
import { useEffect, useState } from "react";
import Login from "./Login";




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
      <Header>
        {!login &&
          <Menu theme="dark" mode="horizontal" items={[
            { key: "menuLogin", label: <Link to="/login">Login</Link> },
          ]}>
          </Menu>
        }

        {login &&
          <Menu theme="dark" mode="horizontal" items={[

            { key: "menuDisconnect", label: <Link to="#" onClick={disconnect} >Disconnect</Link> },
          ]}>
          </Menu>
        }

      </Header>

      <Content style={{ padding: "20px 50px" }}>
        <Routes>
          <Route path="/login" element={
            <Login openNotification={openNotification} />
          }></Route>

        </Routes>
      </Content>

      <Footer style={{ textAlign: "center" }}> My Website</Footer>

    </Layout>
  );
}

export default App;
