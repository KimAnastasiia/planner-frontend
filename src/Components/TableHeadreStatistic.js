import { Button, Avatar, Flex, Card, Col, Image, Typography, Pagination, Input, Checkbox, Table, Select, Tooltip } from 'antd';



const TableHeadreStatistic = ({dateData, timeInfo, infoOfVotes}) => {

    let infoOfVotesForStadistic = infoOfVotes.find((vInfo) => vInfo.timeId == timeInfo.id)
    const dateArray = dateData.date.split("-");
    const year = parseInt(dateArray[0], 10);
    const month = parseInt(dateArray[1], 10) - 1; // Month is 0-indexed in JavaScript
    const day = parseInt(dateArray[2], 10);
    const dateObject = new Date(year, month, day)
    const monthAbbreviation = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObject);
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObject);
    const { Text,Title } = Typography;

    return (

        <Flex  key={timeInfo.time} align='center' justify='center' vertical style={{ width: "100%" }}  >
            <Text className="conditional-text" style={{ fontWeight: 'bold', color: "gray" }}>{monthAbbreviation}</Text>
            <Text className="conditional-text" style={{ margin: 0, fontWeight: 'bold' }} level={2}>{day}</Text>
            <Text className="conditional-text" style={{ fontWeight: 'bold', color: "gray" }}>{dayOfWeek}</Text>
            <Text className="conditional-text" style={{ fontWeight: 'bold' }}>{timeInfo.time}</Text>
            {infoOfVotesForStadistic ?
                <Tooltip color='#448BA7' placement="top" title={infoOfVotesForStadistic.names.join(', ')}>
                    <Flex align='center'>
                        <Image style={{ width: 20, height: 20, marginRight: 5 }} src='/audience.png'></Image>
                        <Text> {infoOfVotesForStadistic.numberOfVotes}</Text>
                    </Flex>
                </Tooltip>
                :
                <Flex align='center'>
                    <Image style={{ width: 20, height: 20, marginRight: 5 }} src='/audience.png'></Image>
                    <Text>0 </Text>
                </Flex>
            }
        </Flex>
    )

}

export default TableHeadreStatistic