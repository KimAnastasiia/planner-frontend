/* eslint-disable no-undef */
import React, { useState, useRef, useEffect } from 'react';
import { Button, Avatar, Flex, Popconfirm, Col, Image, Typography, Space, Input, Checkbox, Table, Select, Tooltip } from 'antd';
import { DeleteOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import "../App.css"
import Commons from '../Utility/url';
import { useParams } from "react-router-dom";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import TableHeadreStatistic from './TableHeadreStatistic';
import RenderDates from './RenderDates';
import Highlighter from 'react-highlight-words';
let VotesComponent = () => {
  const [datesForSelect, setDatesForSelect] = useState([])
  const { Text } = Typography;
  const { meetingId } = useParams()
  let [page, setPage] = useState(1)
  const { token } = useParams()
  let [meetingData, setMeetingData] = useState()
  const { Title } = Typography;
  let [votes, setVotes] = useState([])
  let [columnsArray, setColumnsArray] = useState([])
  let navigate = useNavigate()
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  useEffect(() => {
    getMeetingInfo()
  }, [])

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 600); // Update isSmallScreen based on window width
  };

  useEffect(() => {
    console.log(window.innerWidth)

    handleResize()
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window.innerWidth]);

  let getVotes = async () => {

    let response = await fetch(Commons.baseUrl + `/participation/${meetingId}?access_token=${localStorage.getItem("access_token")}`)
    if (response.ok) {
      let data = await response.json()
      const result = data.reduce((acc, item) => {
        const existingItem = acc.find(obj => obj.name === item.name && obj.userEmail === item.userEmail);
        if (!existingItem) {
          acc.push({ name: item.name, userEmail: item.userEmail });
        }
        return acc;
      }, []);

      result.map((n) => {
        data.forEach((v) => {
          if (n.userEmail == v.userEmail) {
            n[v.time.id] = "x"
          }
        })
  
      })

      setVotes(result)
      return countVotess(result)
    }


  }

  let getMeetingInfo = async (arrayOfDates) => {
    let response = await fetch(Commons.baseUrl + `/meetings?meetingId=${meetingId}&token=${token}&access_token=${localStorage.getItem("access_token")}`)
    if (response.ok) {
      let data = await response.json()
      setMeetingData(data[0])
      let infoOfVotes = await getVotes(data[0])
      createColumns(data[0], arrayOfDates, infoOfVotes)
      let arrayInSelect = []

      data[0].dates.forEach((d) => {
        arrayInSelect.push({
          value: d.date,
          label: d.date
        })
      })
      setDatesForSelect(arrayInSelect)
    }

  }

  const onChangeSelect = (arrayOfDates) => {

    getMeetingInfo(arrayOfDates)

  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const handleDelete = async(voterInfo) => {
    //delete from backend and update vote set getVotes()
    let response = await fetch(Commons.baseUrl + `/participation/ownerDelete/${meetingId}/${voterInfo.userEmail}?access_token=` + localStorage.getItem("access_token"), {
      method: 'DELETE'
    })
    if (response.ok) {
      getVotes()
    }

  };
  let createColumns = (currentMeeting, arrayOfDates, infoOfVotes) => {

    let columns = []

    columns.push({
      title: 'Participants',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      ...getColumnSearchProps('name'),
      render: (text, record) => (
        <Flex align='center' justify="space-between" style={{ width: "100%" }}>
          <span>{text}</span>
          <Button type="text" onClick={() => handleDelete(record)}><DeleteOutlined style={{ color: 'red' }} /></Button>
        </Flex>

      )
    })

    currentMeeting?.dates?.map((d) => {
      if (arrayOfDates?.length > 0) {
        arrayOfDates?.forEach((daySelected) => {
          if (d.date == daySelected) {
            return d.times.map((t) => {
              columns.push({
                title: <TableHeadreStatistic dateData={d} timeInfo={t} infoOfVotes={infoOfVotes} />,
                dataIndex: t.id,
                key: t.id,
                render: (timeId) => ((timeId == "x" || !timeId) &&
                  <Flex justify='center' style={{ width: "100%" }}>{timeId}</Flex>)

              })
            })
          }
        })
      } else {
        return d.times.map((t) => {
          columns.push({
            date: d.date,
            title: <TableHeadreStatistic dateData={d} timeInfo={t} infoOfVotes={infoOfVotes} />,
            dataIndex: t.id,
            key: t.id,
            render: (timeId) => ((timeId == "x" || !timeId) &&
              <Flex justify='center' style={{ width: "100%" }}>{timeId}</Flex>)

          })
        })
      }
    })
    if (columns.length > 0) {
      setColumnsArray(columns)
    }

  }

  let countVotess = (arrOfVotes) => {

    let votesStadistic = []

    arrOfVotes.forEach((v) => {
      const attributeNamesArray = Object.keys(v);
      attributeNamesArray.forEach((atrName) => {
        if (atrName != "name") {
          let exist = votesStadistic.find((date) => date.timeId == atrName)
          if (!exist) {
            votesStadistic.push({
              numberOfVotes: 1,
              timeId: atrName,
              names: [v.name]
            })
          } else {
            exist.numberOfVotes++
            exist.names.push(v.name)
          }
        }
      })
    })

    return votesStadistic
  }
  let shareLink = () => {
    const link = `${window.location.origin}/participate/${token}/${meetingId}`;

    // Copy link to clipboard
    navigator.clipboard.writeText(link)
        .then(() => {
            console.log('Link copied to clipboard:', link);
        })
        .catch((error) => {
            console.error('Error copying link to clipboard:', error);
        });
}

  if (isSmallScreen) {
    return (
      <Flex style={{ minHeight: "100vh", width: "100%" }}>
        <Flex vertical style={{ border: "1px solid #D3DCE3", minHeight: "100vh", backgroundColor: "white", width: "100%", borderRadius: 10 }}>
          <Flex vertical style={{ borderBottom: "1px solid #D3DCE3", height: "40%", padding: 10, justifyContent: "space-around" }}>
            <Flex style={{ justifyContent: "center" }}>
              <Title level={2}>{meetingData?.title}</Title>
            </Flex>
            <Flex>
              <Button type='primary' style={{ marginLeft: 5, marginRight: 5 }} onClick={() => { navigate(`/edit/meeting/${token}/${meetingData?.id}`) }}>Edit</Button>
              {!meetingData?.private && <Button onClick={() => { shareLink() }} type='primary'>Share invite</Button>}
            </Flex>
            <Text style={{ marginTop: 10 }}><Avatar size="small" style={{ marginRight: 10 }} icon={<UserOutlined />} />You are the organizer of the group event.</Text>
            <Flex style={{ justifyContent: "center", marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Availabilities</Text>
            </Flex>
            <Flex vertical>
              <Text style={{ fontWeight: 'bold' }}><img src='/pin.png' style={{ height: 20, width: 20, marginRight: 10 }} alt='location Icon' />{meetingData?.location} </Text>
              <Text style={{ fontWeight: 'bold' }}><img src='/left.png' style={{ height: 20, width: 20, marginRight: 10 }} alt='description Icon' />{meetingData?.descriptions}</Text>
              <Text ><Checkbox style={{ height: 20, width: 20, marginRight: 10 }} checked={true}></Checkbox>Yes, i can </Text>
              <Text ><Checkbox style={{ height: 20, width: 20, marginRight: 10 }} checked={false}></Checkbox>No, i can not </Text>
            </Flex>
          </Flex>
          <Flex align='center' vertical style={{ width: "100%", minHeight: "60%", padding: 20 }}>
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Filter by days"
              optionFilterProp="children"
              options={datesForSelect}
              onChange={onChangeSelect}
              style={{ width: "90%", marginBottom: 10 }}
            />
            <RenderDates columnsArray={columnsArray} votes={votes} />
          </Flex>
        </Flex>
      </Flex>
    )
  }
  return (
    <Flex align='center' justify='center' style={{ height: "100vh", width: "100%" }}>
      <Flex vertical style={{ border: "1px solid #D3DCE3", backgroundColor: "white", borderRadius: 10, padding: 20, width: "60%" }}>
        <Flex style={{ borderBottom: "1px solid #D3DCE3" }}>

          <Flex justify="space-between" vertical style={{ width: "70%" }}>

            <Title level={2}>{meetingData?.title}</Title>
            <Text style={{ fontWeight: 'bold' }}><Avatar size="small" style={{ marginRight: 10 }} icon={<UserOutlined />} />You are the organizer of the group event.</Text>
            <Text style={{ fontWeight: 'bold' }}><img src='/pin.png' style={{ height: 20, width: 20, marginRight: 10 }} alt='location Icon' />{meetingData?.location} </Text>
            <Text style={{ fontWeight: 'bold' }}><img src='/left.png' style={{ height: 20, width: 20, marginRight: 10 }} alt='description Icon' />{meetingData?.descriptions}</Text>
            <Text style={{ fontWeight: 'bold' }}><Checkbox style={{ height: 20, width: 20, marginRight: 10 }} checked={true}></Checkbox>Yes, i can </Text>
            <Text style={{ fontWeight: 'bold' }}><Checkbox style={{ height: 20, width: 20, marginRight: 10 }} checked={false}></Checkbox>No, i can not </Text>
          </Flex>
          <Flex align='center'>

            <Button type='primary' style={{ marginLeft: 20, marginRight: 20 }} onClick={() => { navigate(`/edit/meeting/${token}/${meetingData?.id}`) }}>Edit</Button>
            {!meetingData?.private && <Button onClick={() => { shareLink() }} type='primary'>Share invite</Button>}
          </Flex>
        </Flex>
        <Flex align='center' vertical style={{ width: "100%", height: "60%", padding: 20 }}>
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="Filter by days"
            optionFilterProp="children"
            options={datesForSelect}
            onChange={onChangeSelect}
            style={{ width: "30%", marginBottom: 10 }}
          />
          <RenderDates columnsArray={columnsArray} votes={votes} />
        </Flex>
      </Flex>
    </Flex>
  )
}




export default VotesComponent