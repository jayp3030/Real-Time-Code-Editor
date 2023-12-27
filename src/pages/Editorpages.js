import React, { useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";

const Editorpages = () => {

  const [users , setUsers] = useState( [
    {soketid : 1 , userName : 'john doe'},
    {soketid : 2 , userName : 'john doe'},
    {soketid : 3 , userName : 'alice bob'},
    {soketid : 4 , userName : 'alice bob'},
    {soketid : 5 , userName : 'alice bob'},
    {soketid : 6 , userName : 'alice bob'},
    {soketid : 7 , userName : 'alice bob'},
    {soketid : 8 , userName : 'alice bob'},
    {soketid : 9 , userName : 'alice bob'},
    {soketid : 10 , userName : 'alice bob'},
    {soketid : 11 , userName : 'alice bob'},
    {soketid : 12 , userName : 'alice bob'},
    {soketid : 13 , userName : 'alice bob'},
    {soketid : 14 , userName : 'alice bob'},
  ])

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
            <Client key={user.soketid} username = {user.userName} />
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
