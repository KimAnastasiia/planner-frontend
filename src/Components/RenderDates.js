import React, { useRef, useState, useEffect } from 'react';
import { Button, Avatar, Flex, Typography, message, Input, Checkbox, Table, Switch, Tooltip, Select, Image } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

let RenderDates = ({ columnsArray, votes }) => {

    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

    useEffect(() => {
        setMaxPage(Math.ceil((columnsArray?.length - 1) / 3))
        console.log(votes)
    }, [columnsArray])

    return (

        <div style={{ width: "100%"}}>

            <Flex align='center' justify="flex-end">

                <Flex vertical align="center" style={{ marginTop: 20, width: 150 }}>
                    <span> Page: {page} of {maxPage}</span>

                    <Flex style={{ marginTop: 10 }}>
                        <Button type="text" shape="circle" icon={<LeftOutlined />} style={{ marginRight: 5 }} onClick={() => {
                            if (page > 1)
                                setPage(page - 1)
                        }}>  </Button>

                        <Button type="text" shape="circle" icon={<RightOutlined />} onClick={() => {

                            if (page < maxPage)
                                setPage(page + 1)
                        }
                        }> </Button>
                    </Flex>

                </Flex>
            </Flex>
            <Table
                columns={columnsArray.filter((column, i) => i == 0 || (i < (page * 3) + 1 && i >= ((page - 1) * 3) + 1))}
                dataSource={votes}
                bordered
                pagination={false}
            />

        </div>
    )
}

export default RenderDates