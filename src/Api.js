import axios from 'axios'
import bridge from '@vkontakte/vk-bridge';

const URL = "https://slaaaadd.fvds.ru:3000/api/"

export async function getUser(vk_id){
    try{
        const response = await axios.get(URL+"user/",{headers:{'Authorization':vk_id}})
        return response.data
    }
    catch(err){
        // console.error("Request get user error", err);
    }
    return null;
}

export async function getJackpot(){
    try{
        const response = await axios.get(URL+"jackpot/")
        return response.data
    }
    catch(err){
        // console.error("Request get jackpot error", err);
    }
    return null;
}

export async function getRolls(){
    try{
        const response = await axios.get(URL+"rolls/")
        return response.data
    }
    catch(err){
        // console.error("Request get last rolls", err);
    }
    return null;
}

export async function getFetchedRolls(){
    try{
        const rolls = await getRolls()
        if(rolls === null)
            return null
        const fetchedData = []
        for(const roll of rolls){
            const fetchedRoll = await getUserAndRollInfoById(roll)
            if(fetchedRoll === null)
                continue
            fetchedData.push(fetchedRoll)
        }
        return fetchedData
    }
    catch(err){
        return null
    }
}

async function getUserAndRollInfoById(roll){
    if(roll === null)
        return null
    if(roll.vk_id === null)
        return null
    try{
        const user_info = await bridge.send('VKWebAppGetUserInfo', {user_id:roll.vk_id})
        return { user:user_info, win_value:roll.win_value, timestamp: roll.timestamp}
    }
    catch(err){
        return null
    }
}
    

export async function postRoll(vk_id){
    try{
        const response = await axios.post(URL+"roll/",{},{headers:{'Authorization':vk_id}})
        return response.data
    }
    catch(err){
        // console.error("Request get user error", err);
    }
    return null;
}