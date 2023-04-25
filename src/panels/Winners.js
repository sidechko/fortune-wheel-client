import React, { useEffect, useState } from 'react';
import './Winners.css'
import { getRolls } from '../Api';

const UPDATE_TIME = 5000;
let prevMap = null
const Winners = () =>{

    const[winners, setWinners] = useState([null,null,null,null,null])

    const mapWinners = () =>{
        if(winners===null || winners === undefined){
            if(prevMap != null)
                return prevMap
            else return
        }
        prevMap = winners.map((user, i)=>{
            return <li>
                <h3>Player number: {user === null || user === undefined ? "???" : user.vk_id}</h3>
                <h3>{user === null || user === undefined ? "???" : user.win_value} scores</h3>
            </li>
        })
        return prevMap
    }

    useEffect(()=>{
        var timer
        const interval = () =>{
            getRolls().then((rolls)=>{
                setWinners(rolls)
            })
            timer = setInterval(interval, UPDATE_TIME);

        }
        timer = setInterval(interval, UPDATE_TIME);

        return () => clearInterval(timer);
    })

    return <ul id="winners">{mapWinners()} 
    </ul>
}

export default Winners