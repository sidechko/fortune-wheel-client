import axios from 'axios'

const URL = "http://83.220.172.71:3000/api/"

export async function getUser(vk_id){
    try{
        const response = await axios.get(URL+"user/",{headers:{'Authorization':vk_id}})
        return response.data
    }
    catch(err){
        console.error("Request get user error", err);
    }
    return null;
}

export async function getJackpot(){
    try{
        const response = await axios.get(URL+"jackpot/")
        return response.data
    }
    catch(err){
        console.error("Request get jackpot error", err);
    }
    return null;
}

export async function getRolls(){
    try{
        const response = await axios.get(URL+"rolls/")
        return response.data
    }
    catch(err){
        console.error("Request get last rolls", err);
    }
    return null;
}

export async function postRoll(vk_id){
    try{
        const response = await axios.post(URL+"roll/",{},{headers:{'Authorization':vk_id}})
        return response.data
    }
    catch(err){
        console.error("Request get user error", err);
    }
    return null;
}