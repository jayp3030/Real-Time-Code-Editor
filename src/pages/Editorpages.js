import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Editorpages = () => {

  const socketRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams()

  const [users , setUsers] = useState( [])

  useEffect(() => {

    const init = async () => {
        
      if (! location.state) {
        navigate('/');
      }

        const handleError = (e) => {
          console.log('socket error : ' , e);
          toast.error('Socket Connection Failed Try again later')
          navigate('/')
        }

        socketRef.current = await initSocket();
        socketRef.current.on('connect-error' , (err) => handleError(err));
        socketRef.current.on('connection-failed' , (err) => handleError(err));

        // emiting join event

        socketRef.current.emit('join' , {
          roomId,
          userName : location.state?.userName
        })

        // listening to joined event

        socketRef.current.on('joined' , ({users , userName , socketId}) => {
            if (userName !== location.state.userName) {
              toast.success(`${userName} joined the room`);
              console.log(`${userName} joined`);
            }
            setUsers(users);
            console.log(users);
        } )
    }

    init();
  } , [])

  return (
    <div className="editorWrapper">
      <div className="left">
        <div className="header">
          <h2>
          <i className="fa-solid fa-code"></i> Code Editor <i className="fa-solid fa-code"></i>
          </h2>
        </div>
        <div className="hr"></div>
        <div className="clientList">
          <h3>Connected Users</h3>
          <div className="users">
          { users.map( (user) => 
            (
            <Client key={Math.random()} username = {user.userName} />
            )
          )}
          </div>
        </div>
        <div className="bottom">
          <button className="copyBtn">Copy Room Id</button>
          <button className="leaveBtn">Leave Room</button>
        </div>
      </div>
      <div className="right">
        <Editor/>
      </div>
    </div>
  );
};

export default Editorpages;
