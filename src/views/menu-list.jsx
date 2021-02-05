import React, { Component, createContext, createRef, useState, useEffect, useRef, useCallback } from 'react';
import { maleList, femaleList } from '../utils/zb-data.js'
import { Collapse, Button  } from 'antd';
import eventBus from '../utils/event-bus.js';
const { Panel } = Collapse;

let MenuList = () => {

    const [menus, setDate] = useState([
        {
            tag: "女主播",
            list: femaleList
        },
        {
            tag: "男主播",
            list: maleList
        }
    ]);
    // 存key
    const [curKey, setNewKey] = useState(null);

    // 处理当前主播信息
    let handleCurAnchor = (anchor) => {
        // 触发播放器事件
        eventBus.emit('setCurAudioUrl', anchor.trial);
        // 更新当前key
        setNewKey(anchor.name);
    }
    // 选择当前主播
    let handleSelectAnchor = (anchor) => {
        // 触发播放器事件
        eventBus.emit('setCurAnchorInfo', anchor);
        // 更新当前key
        setNewKey(anchor.name);
    }

    return (
        <Collapse accordion={true} defaultActiveKey={menus[0].tag} >
            {
                menus.map((groups) => (
                    <Panel header={groups.tag} key={groups.tag}>
                        {
                            groups.list.map((anchor) => (
                                <div key={anchor.name} style={{flexDirection: 'row'}} 
                                    className={curKey === anchor.name ? 'anchor-items-active' : 'anchor-items'}>
                                    <div className="pointer pb5 pt5">
                                        <div className="pub-flex">
                                            <div className="pub-flex1 text-left">
                                                {anchor.name}
                                            </div>
                                            <div>
                                                <Button onClick={() => handleCurAnchor(anchor)} size="small" type="primary">试听</Button>
                                                <Button onClick={() => handleSelectAnchor(anchor)} size="small" danger type="primary">选择</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </Panel>
                ))
            }
        </Collapse>
    );
}
export default MenuList;