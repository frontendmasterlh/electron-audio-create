
import React, { Component, createContext, createRef, useState, useEffect, useRef, useCallback } from 'react';
// 组件
import MenuList from "./views/menu-list.jsx"
import RigthContent from "./views/right-content.jsx"

let App = () => (
    <div className="pl20 pr20 pb20 pt20">
        <div className="pub-flex pub-ai-stretch">
            <div style={{width: '400px'}}>
                <MenuList />
            </div>
            <div className="pub-flex1">
                <div className="pl20">
                    <RigthContent />
                </div>
            </div>
        </div>
    </div>
)
export default App;
