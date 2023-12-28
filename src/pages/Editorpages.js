import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Editorpages = () => {

  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams()
  const [users , setUsers] = useState([])

  const copyroomId = async() => {
      try {
        await navigator.clipboard.writeText(roomId);
        toast.success('Room Id has been copied to Clipboard')
      } catch (error) {
        toast.error('Error in Copying Room Id to clipboard')
        console.log(error);
      }
  }
  const leaveRoom = () => {
      navigate('/');
  }


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
            }
            setUsers(users);
            socketRef.current.emit('sync-code' , {
              code : codeRef.current,
              socketId,
            })
        } )

        // listening on disconnecting from server

        socketRef.current.on('disconnected' , ({socketId , userName}) => {

            toast.success(`${userName} left the room..`);
            setUsers( (prev) => {
              return prev.filter( 
                (user) =>  user.socketId !== socketId   // remove the disconnected user from user list
                 )
            })
        } )
    }

    init();

    // clean up function - used when component get unmounted so all the resources will be released

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off('joined');    // unsubscribing joined event
      socketRef.current.off('disconnect');    //cunsubscribing disconnect event
    }
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
          <button className="copyBtn" onClick={copyroomId} >Copy Room Id</button>
          <button className="leaveBtn"  onClick={leaveRoom} >Leave Room</button>
        </div>
      </div>
      <div className="right">
        <Editor 
          socketRef={socketRef} 
          roomId={roomId}
          onCodeChange = {(code) => codeRef.current = code }
        />
      </div>
    </div>
  );
};

export default Editorpages;
