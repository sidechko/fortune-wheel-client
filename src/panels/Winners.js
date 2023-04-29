import React, { useEffect, useState } from 'react';
import './Winners.css'
import { getFetchedRolls } from '../Api';

const UPDATE_TIME = 5000;
let WINNERS_FETCHINF = false;

const Winner = (props) =>{
    const[rollInfo, setRollInfo] = useState(null)

    useEffect(()=>{
        if(props === null)
            return
        setRollInfo(props.roll)
    },[])

    return <div className="winner">
        <h3>{rollInfo === null ? "???" : rollInfo.user.first_name+" "+rollInfo.user.last_name}</h3>
        <h3>{rollInfo === null ? "???" : rollInfo.win_value} scores</h3>
    </div>
}

const Winners = () =>{

    const[winners, setWinners] = useState([])
    const[childs, setChilds] = useState([])

    const getChilds = () => {
        return childs
    }

    const fetchLastRols = ()=>{
        getFetchedRolls().then((v)=>{
            setWinners(v)
            WINNERS_FETCHINF = false
        })
    }

    useEffect(()=>{
        var timer
        const interval = () =>{
            if(WINNERS_FETCHINF == false){
                WINNERS_FETCHINF = true
                fetchLastRols()
            }
            timer = setInterval(interval, UPDATE_TIME);
        }
        timer = setInterval(interval, UPDATE_TIME);
        return () => clearInterval(timer);
    },[])

    useEffect(()=>{
        setChilds(winners.filter(w => w !== null).map(winner => {return <Winner key={winner.timestamp} roll={winner}/>}))
    },[winners])

    return <div id="winners">{getChilds()} 
    </div>
}

export default Winners