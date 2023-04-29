import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import "./GameWindow.css"
import {postRoll, getJackpot } from '../Api';
import Winners from './Winners';

let SPINNING = false
const WHEEL_SECKTORS = [0, 10, 50, 100, 200, 500, 750, 'jackpot']
const UPDATE_TIME = 500;
let win_section = 0;

const GameWindow = (props) => {
    
    const canvasRef = useRef()
    const count = 8
    const [wheelAngle, setWheelAngel] = useState(0);
    const [needAngle, setNeedAngle] = useState(0);
    const [shouldStop, setShouldStop] = useState(true);
    const [user, setUser] = useState(null);
    const [userHide, setHideUser] = useState(null);
    const [jackpot, setJackpot] = useState(0);
    const [alertShowed, setAlertShowed] = useState(false);

    const calculateWheel = (winSection) =>{
        var spinCount = Math.floor(Math.random() * 4)+5;
        var spinCountAsAng = spinCount*(2*Math.PI);
        var winAng = winSection*(2*Math.PI/count)
        setNeedAngle(spinCountAsAng-((2*Math.PI/count)*2)-winAng)
        setWheelAngel(0)
    }

    useEffect(()=>{
        var timer = setInterval(()=>{
            getJackpot().then(j=>{
                if(j === null)
                    return
                setJackpot(j.jackpot)
            })
        },UPDATE_TIME)
        return ()=> clearInterval(timer)
    },[])

    useLayoutEffect(()=>{
        let timerId
        if(shouldStop)
            return
        SPINNING = true;
        const incrementAngle = () => {
            setWheelAngel(wa => {
                if(wa >= needAngle){
                    SPINNING = false
                    return needAngle
                }
                var valueToAdd = Math.PI/10
                if(wa/needAngle > 0.5)
                    valueToAdd = Math.PI/20
                if(wa/needAngle > 0.6)
                    valueToAdd = Math.PI/30
                if(wa/needAngle > 0.7)
                    valueToAdd = Math.PI/40
                if(wa/needAngle > 0.8)
                    valueToAdd = Math.PI/50
                if(wa/needAngle > 0.9)
                    valueToAdd = Math.PI/60
                return wa+valueToAdd
            });
            if(SPINNING){
                timerId = requestAnimationFrame(incrementAngle)
                return timerId
            }
            
            cancelAnimationFrame(timerId)
            setShouldStop(true)
            setAlertShowed(true)
        }
        incrementAngle()
    }, [shouldStop])

    useEffect(()=>{
        var canvas = canvasRef.current;
        canvas.width = 220;
        canvas.height = 220;
        var ctx = canvas.getContext('2d');
        ctx.translate(110,110)
        
        ctx.beginPath()
        ctx.moveTo(0,-100)
        ctx.lineTo(0,-90)
        ctx.lineWidth=7;
        ctx.fillStyle="#000000"
        ctx.closePath()
        ctx.stroke();

        var ang = wheelAngle
        ctx.rotate(-Math.PI/8)
        ctx.rotate(ang)
        for(var i = 0; i < count; i++){  
            var color = i % 2? "#dfe48b" : "#e3ea65";
            if(i===0)
                color = "#ffffff"
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(0, 0, 90, 0, 2*Math.PI/count);
            ctx.lineTo(0,0);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = "#161613";
            ctx.font = "20px serif"
            ctx.textAlignt = 'center'
            ctx.rotate(Math.PI/8)
            ctx.fillText(WHEEL_SECKTORS[i], 30, 6);
            ctx.rotate(-Math.PI/8)
            ctx.closePath();

            ctx.rotate((2*Math.PI/count));
        }
        // ctx.rotate(-ang)
        ctx.rotate(Math.PI/8)
    },[wheelAngle])

    const sendRequest = ()=>{
        if(props.user === null)
            return
        postRoll(props.user.id).then((response_data)=>{
            if(response_data === null)
                return
            setHideUser(response_data.user)
            calculateWheel(response_data.wheel_section)
            win_section = response_data.wheel_section
            setShouldStop(false)
        })
    }

    return <div>
        <main style={{background: "blue", margin: "auto"}}>
            <nav style={{display: "flex", justifyContent: "end"}}>
                <button className="nav-button" style={{marginRight: 1}}>...</button>
                <button className="nav-button" style={{marginLeft: 1}}>X</button>
            </nav>
            <div id="game">
                <h1>WHEEL OF FORTUNE</h1>
                <div id="wheel-and-buttons-container">
                    <div id="wheel-container">
                        <canvas id="wheel" ref={canvasRef}/>
                    </div>
                    <div id="buttons-container">
                        <div className="fortune-info">Jackpot <br/>{jackpot}</div>
                        <div className="fortune-info">Balance <br/>{user === null ? '???' : user.balance}</div>
                        <button className="fortune-button" onClick={()=>{
                            if(!SPINNING)
                                sendRequest()
                        }}>Spin <br/> wheel</button>
                    </div>
                </div>
                <Winners/>
            </div>
        </main>
        {alertShowed && <div id='overlay'>
            <div>
                <h1>You win!</h1>
                <h1>{WHEEL_SECKTORS[win_section]}</h1>
                <button className="fortune-button" onClick={()=>{
                    setUser(userHide)
                    setAlertShowed(false)
                }}>GREAT</button>
            </div>
        </div>}
    </div>
}

export default GameWindow;