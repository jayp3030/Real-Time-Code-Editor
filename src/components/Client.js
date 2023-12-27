import React from 'react'
import Avatar from './Avatar';

function Client({username}) {
    
    let summName ="";

    const arr = username.split(" ");

    arr.forEach(element => {
        summName+=element.charAt(0).toUpperCase();
    });

  return (
    <div className='user-info'>
        <Avatar summName = {summName} />
        <span>{username}</span>
    </div>
  )
}

export default Client
