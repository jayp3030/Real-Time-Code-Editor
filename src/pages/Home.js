import React, { useState } from "react";
import {v4 as uuidv4} from 'uuid'
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
    
    const [roomId , setRoomId] = useState('');
    const [userName , setUserName] = useState('');
    const navigate = useNavigate();

    const createNewroom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setRoomId(id);
        toast.success('New Room Created');

        console.log(id);
    }
    
    const joinRoom = (e) => {
        e.preventDefault();
        if (!roomId || !userName) {
            toast.error('Room ID & User Name is Required')
            return
        }

        // else redirect to the code editor page
        navigate(`/editor/${roomId}` , 
            {
                state : {
                    userName,
                }
            }
        );

    }

  return (
    <div className="home">
      <div className="formWrapper">
        <div className="formHeader">
          <h1>
            Welcome to Real-time <br />
            <i className="fa-solid fa-code"></i><span> Code Editor </span><i className="fa-solid fa-code"></i>
          </h1>
          <h4>Enter Your ROOM ID Here</h4>
        </div>
        <form onSubmit={joinRoom}>

          <input 
            type="text" 
            className="inputBox" 
            placeholder="Room ID" 
            onChange={ (e) => {
                console.log(e.target.value);
                setRoomId(e.target.value)
            } }
            value={roomId}
          />

          <input 
            type="text"
            className="inputBox" 
            placeholder="User Name"
            onChange={ (e) => {
                console.log(e.target.value);
                setUserName(e.target.value)
            } } 
            value={userName}
          />

          <button className="btn joinBtn" onClick={joinRoom} >Join</button>
          <span>
            If you don't have an invite then create &nbsp;{" "}
            <a href="/" className="createnew" onClick={createNewroom} >
              new room
            </a>
          </span>
        </form>
      </div>

      <div className="footer">
        Developed By <a href="/">JAY</a>
      </div>
    </div>
  );
}

export default Home;
