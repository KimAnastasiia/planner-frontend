import React, { useRef, useState, useEffect } from 'react';
import { Button, Avatar, Flex, Typography, message, Input, Checkbox, Space, Switch, Tooltip, Select,Image  } from 'antd';
import { PlusOutlined, UserOutlined, MailOutlined, SearchOutlined  } from '@ant-design/icons';
import "../App.css"
import Highlighter from 'react-highlight-words';
import Commons from '../Utility/url';
import { useParams } from "react-router-dom";
import TableHeadreStatistic from './TableHeadreStatistic';
import RenderDates from './RenderDates';
let SelectionOfDates = () => {

    const { Text } = Typography;
    const { id } = useParams()
    const { token } = useParams()
    const { voterToken } = useParams()
    let [meetingData, setMeetingData] = useState()
    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let emailRef = useRef();
    let nameRef = useRef();
    let meetingDataRef = useRef();
    let [editButton, setEditButton] = useState(false)
    const { Title } = Typography;
    const idsRef = useRef([]);
    let [votes, setVotes] = useState([])
    let [disableButton, setDisableButton] = useState(true)
    let [voted, setVoted]=useState(false)
    const searchInput = useRef(null);
    let [columnsArray, setColumnsArray] = useState([])
    const [messageApi, contextHolder] = message.useMessage();
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [datesForSelect, setDatesForSelect] =useState([])
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 800); // Update isSmallScreen based on window width
    };
    const numberOfVotersPerWindow = (arraySelectedWindows, timeId) => {
        const objectWithAmountOfNumberOfVotesForId =  arraySelectedWindows?.find(v => v.timeId === timeId);
        return objectWithAmountOfNumberOfVotesForId?.numberOfVotes || 0  
    };
    
    useEffect(() => {
       
        
        handleResize()
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [window.innerWidth]);

    useEffect(() => {
        console.log(localStorage.getItem("voter_token"))
        if(voterToken){
            localStorage.setItem('voter_token', voterToken);
        }
        getMeetingInfo()
    }, [])

    useEffect(() => {
        
        emailRef.current = email
        nameRef.current = name
        meetingDataRef.current = meetingData
       
        if (name && email && name != "" && email != "") {
            setDisableButton(false)
        } else {
            setDisableButton(true)
        }
    }, [email, name, meetingData])

    let getVotes = async (meetingData) => {

        let response = await fetch(Commons.baseUrl + `/participation-public/${id}`)
        if (response.ok) {
            let data = await response.json()
            console.log(localStorage.getItem("voter_token"))
            data.map((el)=>{
                if(el.token==localStorage.getItem("voter_token")){
                    setName(el.name)
                    setEmail(el.userEmail)
                    setVoted(true)
                    el.name="You"
                    
                }
            })
            const result = data.reduce((acc, item) => {
                if (acc.includes(item.name)) {
                    return acc; // если значение уже есть, то просто возвращаем аккумулятор
                }
                return [...acc, item.name]; // добавляем к аккумулятору и возвращаем новый аккумулятор
            }, []);


            let newAr = result.map(name => ({ name }))
            newAr.map((n) => {
                data.forEach((v) => {
                    if (n.name == v.name) {
                        n[v.time.id] = "x"
                    }
                })
            })
            let userAlreadyVoted=data.find((el)=>el.name=="You")
            
            if(!userAlreadyVoted){
                let objetPutYourChoose = {
                    name: "You"
                }
             
                meetingData?.dates?.forEach((d) => {
                    d.times.forEach((t) => objetPutYourChoose[t.id] = t.id)
                })
                newAr.unshift(objetPutYourChoose)
            }
            setVotes(newAr)
            return countVotess(newAr)
        }


    }

    let getMeetingInfo = async (arrayOfDates) => {
        let response = await fetch(Commons.baseUrl + `/meetings-public?meetingId=${id}&token=${token}`)
        if (response.ok) {
            let data = await response.json()
   

            if(data.length>0){     
                setMeetingData(data[0])
                let infoOfVotes = await getVotes(data[0])
                createColumns(data[0], arrayOfDates, infoOfVotes)
                let arrayInSelect=[]

                data[0].dates.forEach((d)=>{
                    arrayInSelect.push({
                        value:d.date,
                        label:d.date
                    })
                })
                setDatesForSelect(arrayInSelect)
            }
        }

    }
    let countVotess=(arrOfVotes)=>{
        //мы пропускаем его если
        arrOfVotes = arrOfVotes.filter(av =>isNaN(Object.values(av)[0]) || Object.values(av)[Object.values(av).length-1]!="You");
        
        let votesStadistic=[]

        arrOfVotes.forEach((v)=>{
            const attributeNamesArray = Object.keys(v);
            attributeNamesArray.forEach((atrName)=>{
                if(atrName!="name"){
                    let exist = votesStadistic.find((date)=>date.timeId==atrName )
                    if(!exist){
                        votesStadistic.push({
                            numberOfVotes:1,
                            timeId:atrName,
                            names:[v.name]
                        })
                    }else{
                        exist.numberOfVotes++
                        exist.names.push(v.name)
                    }
                }
            })
        })
        //setInfoOfVotes(votesStadistic)
        return votesStadistic
    }
    let putParticipation = async () => {

        let arrayOfTimes = [
            ...idsRef.current]

        let response = await fetch(Commons.baseUrl + "/participation-public?voter_token="+localStorage.getItem("voter_token"), {

            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail: emailRef.current,
                name: nameRef.current,
                meetingId: meetingDataRef.current.id,
                timesIds: arrayOfTimes,
                userToken:token
            })
        })
        if (response.ok) {
            let data = await response.json()
            localStorage.setItem('voter_token', data.token);
            idsRef.current=[]
            setName("")
            setEmail("")
            getMeetingInfo()
            //getVotes()
            success()
            setEditButton(false)
        }

    }
    let addParticipation = async (time) => {

        let response = await fetch(Commons.baseUrl + "/participation-public?voter_token="+localStorage.getItem("voter_token"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail: emailRef.current,
                name: nameRef.current,
                meetingId: meetingDataRef.current.id,
                time: {id: time},
                userToken:token
            })
        })
        if (response.ok) {

            let data = await response.json()
            localStorage.setItem('voter_token', data.token);
        }

    }
    let deleteParticipation=async(time)=>{

        let response = await fetch(Commons.baseUrl + `/participation-public/${time}?voter_token=${localStorage.getItem("voter_token")}`, {
            method: 'DELETE'
          })
          if (response.ok) {

          }
    }
    const success = () => {
        messageApi.open({
          type: 'success',
          content: 'You have successfully selected the appropriate dates',
        });
      };
    let checkBoxChange = (e, timeId) => {

        const copyOfTimesIds = [...idsRef.current];
    
        if (e.target.checked) {
            const currentTime = copyOfTimesIds.find(time => time === timeId);
    
            if (!currentTime) {
                idsRef.current = [...copyOfTimesIds, timeId]; 
                addParticipation(timeId)
            }
        } else {
            idsRef.current = copyOfTimesIds.filter(time => time !== timeId);
            deleteParticipation(timeId)
        }

    }
    const markCheckBoxIfItsExist=(infoOfVotes, timeId)=>{

        const yourVote=infoOfVotes.find((i)=>i.timeId==timeId)

        if(yourVote){
            let exist = yourVote.names.find((n)=>n=="You")
            if(exist){
                return true
            }
        }

        return false
        
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
    let createColumns = (currentMeeting, arrayOfDates, infoOfVotes) => {

        let columns=[]
        columns.push({
            title: 'Participants',
            dataIndex: 'name',
            key: 'name',
            color:"#E8134B",
            fixed: 'left',
            ...getColumnSearchProps('name'),
        })
    
        currentMeeting?.dates?.map((d) => {
            if(arrayOfDates?.length>0 ){
                arrayOfDates?.forEach((daySelected)=>{
                    if(d.date==daySelected){
                        
                        return d.times.map((t) => {
                            columns.push({
                                date:d.date,
                                title:<TableHeadreStatistic dateData={d} timeInfo={t} infoOfVotes={infoOfVotes}/>,
                                dataIndex: t.id,
                                key: t.id,
                                render: (timeId) => (
                                   
                                    (timeId == "x" || !timeId ? 
                                    <Flex justify='center' style={{width:"100%"}}>{timeId}</Flex>  : 
                                      (
                                        ((( numberOfVotersPerWindow(infoOfVotes, timeId)< meetingDataRef.current.amountOfLimitedSelection)
                                         &&
                                         (meetingDataRef.current.limitedSelection))
                                            || 
                                        !meetingDataRef.current.limitedSelection
                                            ||
                                        markCheckBoxIfItsExist(infoOfVotes, timeId)
                                         )
                                        
                                        && 
                                        <Flex justify='center' style={{width:"100%"}}>
                                            <Checkbox 
                                            disabled={(name === "" && nameRef.current === "")||(email=="" && emailRef.current=="") }
                                                defaultChecked={idsRef.current.includes(timeId)}  
                                                onChange={(e) => { checkBoxChange(e, timeId) }}
                                            />
                                        </Flex>
                                      )
                                    )
                                )
                                  
                            })



                        }
                        

                    )}
                })
            }else{
                
                    return d.times.map((t) => {
                     
                        columns.push({
                            date:d.date,
                            title:<TableHeadreStatistic dateData={d} timeInfo={t} infoOfVotes={infoOfVotes}/>,
                            dataIndex: t.id,
                            key: t.id,
                            render: (timeId) => (
                                (timeId == "x" || !timeId ? 
                                   
                                  <Flex justify='center' style={{width:"100%"}}>{timeId}</Flex> : 

                                  (
                                    ((( numberOfVotersPerWindow(infoOfVotes, timeId)< meetingDataRef.current.amountOfLimitedSelection)
                                     &&
                                     (meetingDataRef.current.limitedSelection))
                                     || 
                                     !meetingDataRef.current.limitedSelection
                                     ||
                                     markCheckBoxIfItsExist(infoOfVotes, timeId)
                                    )
                                        && 
                                        <Flex justify='center' style={{width:"100%"}}>
                                            <Checkbox 
                                                disabled={(name === "" && nameRef.current === "")||(email=="" && emailRef.current=="") }
                                                defaultChecked={idsRef.current.includes(timeId)}  
                                                onChange={(e) => { checkBoxChange(e, timeId) }}
                                            />
                                        </Flex>
                                    )
                                ) 
                            )
                        })
                    
                })
            }
        })
        if (columns.length > 0) {
            setColumnsArray(columns)
        }
    }
    
    const onChangeSelect =(arrayOfDates)=>{
        
        getMeetingInfo(arrayOfDates)

    }

    let searchObjectsByValueOne=(array)=>{
        const result = [];
        array.forEach(obj => {
            // Check each property value for equality to 1
            Object.entries(obj).forEach(([key, value])  => {
                if (value === "x" && obj.name=="You") {
                    result.push(key);
                }
            });
        });
        return result;
    }
    let editAnswer=()=>{

        let arrayOfSelectedDates = searchObjectsByValueOne(votes)
        idsRef.current=arrayOfSelectedDates
        let temp =votes.filter((el)=>el.name!=="You")
        let objetPutYourChoose = {
            name: "You"
        }
        meetingData?.dates?.forEach((d) => {
            d.times.forEach((t) => objetPutYourChoose[t.id] = t.id)
        })
        temp.push(objetPutYourChoose)

        setEditButton(true)
        setVoted(false)
        setVotes(temp)

    }
    const hideAllPastDates=(checked)=>{
        
        if(checked){
            const currentDate = new Date(Date.now());
            let tempArray = [...columnsArray]
            tempArray=tempArray.filter((c)=>new Date(c.date)>currentDate||c.title=="Participants")
   
            setColumnsArray(tempArray)
        }else{
            getMeetingInfo()
        }
   }
   if(meetingData?.private==false){
        if(isSmallScreen){
            return (
                <Flex vertical align='center' justify='center' style={{ width: "100%" }}>
                    {contextHolder}
                    {voted && 
                        <Flex vertical style={{ border: "1px solid #D3DCE3",backgroundColor: "white", borderRadius: 10, padding: 10, marginBottom:10}}>
                            <Text style={{ fontWeight: 'bold', marginBottom:5 }}><img src='/calendar.png' style={{ height: 20, width: 20, marginRight: 5 }} alt='location Icon' />Reply sent!</Text>
                            <Text >Now it depends on the organizer. We will send you an email to <Text style={{ fontWeight: 'bold' }}>{email}</Text> when will the selected final hour.</Text>
                            <Flex align='center' style={{marginTop:10, marginBottom:10}}>

                                <Switch style={{marginRight:10}} size="small" />
                                <Text style={{marginRight:5}}>Receive event updates</Text>
                                <Tooltip  color='#448BA7' placement="top" title={"We will send you an email when someone responds"}>
                                    <img  src='/exclamation.png' style={{ height: 20, width: 20, marginRight: 5 }} alt='location Icon' />
                                </Tooltip>

                            </Flex>
                            <Button onClick={editAnswer}  style={{color:"gray", width:"50%"}}>Change your answer</Button>
                        </Flex>
                    }
                    <Flex vertical style={{ border: "1px solid #D3DCE3",backgroundColor: "white", borderRadius: 10, height: "100%", padding: 10}}>
                        <Flex align='center' vertical>
                            <Flex style={{ borderBottom: "1px solid #D3DCE3", paddingBottom:5 }} align='center'>
                                <Avatar size="small"icon={<UserOutlined />} style={{ marginRight: 5 }} />
                                <Flex align='center' vertical>
                                    <Text >{meetingData?.userEmail}</Text>
                                </Flex>
                            </Flex>
                            <Flex vertical align="flex-start" justify="space-around" style={{ width: "100%", height: "30%"}}>
                                <Title level={5}>{meetingData?.title}</Title>
                                <Text ><img src='/left.png' style={{ height: 10, width: 10, marginRight: 10 }} alt='description Icon' />{meetingData?.descriptions}</Text>
                                <Text ><img src='/pin.png' style={{ height: 10, width: 10, marginRight: 10 }} alt='location Icon' />{meetingData?.location} </Text>
                                <Text ><Checkbox style={{ marginRight: 10 }} checked={true}></Checkbox>Yes, i can </Text>
                                <Text ><Checkbox style={{ marginRight: 10, marginBottom:10 }} checked={false}></Checkbox>No, i can not </Text>
                            </Flex>
                        {!voted && 
                        <>
                                <Text style={{ fontWeight: 'bold'}}>Select your preferred hours</Text>
                                <Text style={{ marginBottom: 10 }}>We will notify you when the organizer chooses the best time</Text>
                                <Input value={name} onChange={(e) => { setName(e.currentTarget.value) }} style={{ marginBottom: 5 }} size="small" placeholder="Write your name" prefix={<UserOutlined />} />
                                <Input value={email} type="email" onChange={(e) => { 
                                    setEmail(e.currentTarget.value) 
                                }} style={{ marginBottom:10 }} size="small" placeholder="Write your email" prefix={<MailOutlined />} />
                            </>}
                            <Select
                                mode="multiple"
                                allowClear
                                showSearch
                                placeholder="Filter by days"
                                optionFilterProp="children"
                                options={datesForSelect}
                                onChange={onChangeSelect}
                                style={{width:"90%",marginBottom:10}}
                            />
                            <Flex style={{width:"100%",marginBottom: 20}}>
                                <Flex>
                                    <Text style={{marginRight:10}}>Show only actual dates</Text>
                                    <Switch onChange={hideAllPastDates}/>
                                </Flex>
                            </Flex>
                            <RenderDates columnsArray={columnsArray} votes={votes}/>
                        </Flex>
                    </Flex>
                </Flex>
            )
        }

        return (
            <Flex vertical align='center' justify='center' style={{ width: "100%" }}>
                {contextHolder}
                {voted && 
                        <Flex vertical style={{ border: "1px solid #D3DCE3",backgroundColor: "white", borderRadius: 10, padding: 10, marginBottom:10, width:"66%"}}>
                            <Text style={{  marginBottom:5, fontSize:25 }}><img src='/calendar.png' style={{ height: 20, width: 20, marginRight: 5 }} alt='location Icon' />Reply sent!</Text>
                            <Text >Now it depends on the organizer. We will send you an email to <Text style={{ fontWeight: 'bold' }}>{email}</Text> when will the selected final hour.</Text>
                            <Flex justify="space-between" align='center' style={{marginTop:10, marginBottom:10}}>

                                <Flex align='center'>
                                    <Switch style={{marginRight:10}} size="small" />
                                    <Text style={{marginRight:5}}>Receive event updates</Text>
                                    <Tooltip  color='#448BA7' placement="top" title={"We will send you an email when someone responds"}>
                                        <img  src='/exclamation.png' style={{ height: 20, width: 20, marginRight: 5 }} alt='location Icon' />
                                    </Tooltip>
                                </Flex>

                                <Button onClick={editAnswer} style={{color:"gray", width:"30%"}}>Change your answer</Button>
                            </Flex>
                        
                        </Flex>
                    }
                <Flex style={{ border: "1px solid #D3DCE3",backgroundColor: "white", borderRadius: 10, width:"100%" }}>
                    <Flex align='center' vertical style={{ borderRight: "1px solid #D3DCE3", padding: 30, width:"30%" }}>

                        <Flex style={{ borderBottom: "1px solid #D3DCE3", marginBottom:20 }} align='center'>
                            <Avatar size="large" icon={<UserOutlined />} style={{ marginRight: 20 }} />
                            <Flex align='center' vertical>
                                <Title level={5}>{meetingData?.userEmail}</Title>
                                <Text>meeting organizer</Text>
                            </Flex>
                        </Flex>

                        <Flex align='center' style={{ width: "100%", height: "100%" }} vertical>



                            <Flex vertical align="flex-start" justify="space-around" style={{ width: "100%", height: "30%" }}>
                                <Title level={5}>{meetingData?.title}</Title>
                                <Text style={{ fontWeight: 'bold' }}><img src='/pin.png' style={{ height: 20, width: 20, marginRight: 10 }} alt='location Icon' />{meetingData?.location} </Text>
                                <Text style={{ fontWeight: 'bold' }}><img src='/left.png' style={{ height: 20, width: 20, marginRight: 10 }} alt='description Icon' />{meetingData?.descriptions}</Text>
                                <Text style={{ fontWeight: 'bold' }}><Checkbox style={{ height: 20, width: 20, marginRight: 10 }} checked={true}></Checkbox>Yes, i can </Text>
                                <Text style={{ fontWeight: 'bold' }}><Checkbox style={{ height: 20, width: 20, marginRight: 10 }} checked={false}></Checkbox>No, i can not </Text>
                            </Flex>

                        </Flex>
                    </Flex>

                    <Flex align='center' vertical style={{ width: "60%", padding: 20 }}>
                        {!voted && 
                            <>
                                <Title level={2}>Select your preferred hours</Title>
                                <Text style={{ marginBottom: 20 }}>We will notify you when the organizer chooses the best time</Text>
                                <Flex style={{width:"100%",marginBottom: 20}}>
                                    <Flex>
                                        <Text style={{marginRight:10}}>Show only actual dates</Text>
                                        <Switch onChange={hideAllPastDates}/>
                                    </Flex>
                                </Flex>
                                <Input value={name} onChange={(e) => { setName(e.currentTarget.value) }} style={{ marginBottom: 20 }} size="large" placeholder="Write your name" prefix={<UserOutlined />} />
                                <Input value={email} type="email" onChange={(e) => { 
                                    setEmail(e.currentTarget.value) 
                                }} style={{ marginBottom: 20 }} size="large" placeholder="Write your email" prefix={<MailOutlined />} />
                            </>
                        }
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            placeholder="Filter by days"
                            optionFilterProp="children"
                            options={datesForSelect}
                            onChange={onChangeSelect}
                            style={{width:"30%", marginBottom:10}}
                        />
                        <RenderDates columnsArray={columnsArray} votes={votes}/>
                    </Flex>
                </Flex>
            </Flex>
        )
    }else{
        return (
            <Flex vertical justify='center' align='center' style={{width:"100%", height:"100vh"}}>
              <img src='/empty-box.png' style={{ height: 150, width: 150 }} alt='no data Icon' />
              <Text > No data :( </Text>
            </Flex>
        )
    }


}

export default SelectionOfDates