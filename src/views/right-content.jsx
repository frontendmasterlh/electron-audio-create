import React, { Component, createContext, createRef, useState, useEffect, useRef, useCallback } from 'react';
import eventBus from '../utils/event-bus.js';
import request, { downloadCurAudio } from '../utils/request.js';
import { Card, Button, Input, message, Slider, Divider } from 'antd';
import { SoundFilled, DownloadOutlined, UserOutlined } from '@ant-design/icons';
// audio player
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
// 爆改css
import '../style/player.diy.css'

const { TextArea } = Input;

// 当前选择的主播信息
let ShowCurSlectAnchor = (props) => {

    if(props.info === null){
        return <span style={{color: 'red'}}><SoundFilled /> 暂无选择任何主播</span>
    }else{
        return (
            <div>
                <span style={{color: 'blue'}}><SoundFilled /> 当前主播：  </span>
                <span style={{color: 'red'}}><UserOutlined /> {props.info ? props.info.name : ''}</span>
            </div>
        )
    }
}


let RigthContent = () => {

    // 当前设置的主播信息
    const [anchorInfo, setAnchorInfoState] = useState(null);
    // 文案
    const [aiText, changeAiText] = useState('');
    // 音频url
    const [aiAudio, setAudioUrl] = useState('');
    // 语速
    const [speed, changeSpeed] = useState(0);
    // 语调
    const [pitch, changePitch] = useState(0);
    // 音量
    const [volume, changeVolume] = useState(70);


    useEffect(() => {

        // 设置当前播放的音频-试听
        eventBus.addListener('setCurAudioUrl', (url) => {
            setAudioUrl(url);
        });
        // 设置主播信息
        eventBus.addListener('setCurAnchorInfo', (anchorData) => {
            setAnchorInfoState(anchorData);
            message.success('主播选择成功！', 1);
        });
        
        // 移除
        return () => {
            eventBus.removeListener('setCurAnchorInfo');
            eventBus.removeListener('setCurAudioUrl');
        }
    }, []);

    // 处理双向数据绑定 - input文案
    let handleAiTextEvent = (val) => {
        if(val.length > 5000){
            changeAiText(val.slice(0, 5000));
        }else{
            changeAiText(val);
        }
    }
    // 去创建新的配音
    let goCreateAudio = () => {
        // 文本没有输入
        if(!aiText.length){
            message.error('请先输入文本', 1);
            return
        }
        // 没有选择主播
        if(!anchorInfo){
            message.error('请先选择主播', 1);
            return
        }
        // 去拉接口，生成数据
        pullNewAudioResult();
    }
    // 拉接口，生成
    let pullNewAudioResult = () => {
        let jsonStrQ = JSON.stringify({
            qd: "110710",
            ver: "010156",
            zbid: anchorInfo.options.zbid,
            text: aiText,
            speed: speed,
            pitch: pitch,
            volume: volume,
            isurl: 2,
            viptype: "0",
            bgdelaytime: 0,
            textdelaytime: 0,
            bgvolume: 20,
            emotion: "",
            emotiondegree: 50,
            opertype: "1001"
        });
        let encodeQuery = encodeURIComponent(jsonStrQ);
        request('/v2app/peiyin/ttsmnp?req=' + encodeQuery, (res, httpBody) => {
            if(res.statusCode === 200){
                let parseJsonToObj = JSON.parse(httpBody);
                // 保存当前已经生成的mp3
                setAudioUrl(parseJsonToObj.model.audiourl);
            }
        })
    }
    
    return (
        <div>
            {/* 当前主播信息 */}
            <Card>
                <div className="pub-flex pub-jc-start">
                    <ShowCurSlectAnchor info={anchorInfo} />
                </div>
            </Card>
            {/* 配音文案输入 */}
            <Card className="mt20">
                <div>
                    <TextArea value={aiText} autoSize={{minRows: 14, maxRows: 14}} placeholder="请输入配音文案" allowClear onChange={(e)=> handleAiTextEvent(e.target.value)} />
                    <div className="text-right mt20">
                        <Button type="primary" onClick={goCreateAudio}>生成</Button>
                    </div>
                </div>
            </Card>
            {/* 滑块 */}
            <Card className="mt20">
                <div className="pub-flex pub-d">
                    <div className="text-left" style={{width: '100px'}}>语速： {speed} </div>
                    <div className="pub-flex1">
                        <Slider
                            max={100}
                            min={-100}
                            step={10}
                            defaultValue={0}
                            tipFormatter={null}
                            onChange={(val) => changeSpeed(val)}
                        />
                    </div>
                </div>
                <Divider />
                <div className="pub-flex pub-d">
                    <div className="text-left" style={{width: '100px'}}>音量： {volume} </div>
                    <div className="pub-flex1">
                        <Slider
                            max={100}
                            min={0}
                            step={1}
                            defaultValue={70}
                            tipFormatter={null}
                            onChange={(val) => changeVolume(val)}
                        />
                    </div>
                </div>
                <Divider />
                <div className="pub-flex pub-d">
                    <div className="text-left" style={{width: '100px'}}>语调： {pitch} </div>
                    <div className="pub-flex1">
                        <Slider
                            max={100}
                            min={-100}
                            step={10}
                            defaultValue={0}
                            tipFormatter={null}
                            onChange={(val) => changePitch(val)}
                        />
                    </div>
                </div>
            </Card>
            {/* 播放器 */}
            <div className="mt20">
                <AudioPlayer
                    customAdditionalControls={[
                        <div className="pl5 pr5">
                            <Button 
                                onClick={() => downloadCurAudio(aiAudio)} 
                                type="primary" 
                                shape="circle" 
                                size="middle" 
                                icon={<DownloadOutlined />} 
                                />
                        </div>
                    ]}
                    volume={0.7}
                    showJumpControls={false}
                    layout="horizontal-reverse"
                    src={aiAudio}
                    onPlay={e => console.log("开始播放")}
                />
            </div>
        </div>
    );
}
export default RigthContent;