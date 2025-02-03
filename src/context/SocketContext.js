import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import AuthContext from '../context/AuthContext';

const SocketContext = createContext();

export const useSocketContext=()=>{
    return useContext(SocketContext);
}

export const SocketContextProvider=({children})=>{
    const [socket , setSocket]= useState(null);
    const [onlineUser,setOnlineUser]=useState([]);
    const { user } = useContext(AuthContext);

    useEffect(()=>{
        if(user){
            const socket = io("http://localhost:3000",{
                query:{
                     query: { userId: user?._id || '' },
                }
            })
            socket.on("getOnlineUsers",(users)=>{
                setOnlineUser(users)
            });
            setSocket(socket);
            return()=>socket.close();
        }else{
            if(socket){
                socket.close();
                setSocket(null); 
            }
        }
    },[user]);
    return(
    <SocketContext.Provider value={{socket , onlineUser}}>
        {children}
    </SocketContext.Provider>
    )
}