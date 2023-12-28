import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';

function Editor({socketRef , roomId}) {

    const editorRef = useRef(null);

    function init() {
      const textarea = document.getElementById('editor');

      if (textarea) {
          editorRef.current = CodeMirror.fromTextArea(textarea, {
            mode: {
                name: 'javascript',
                json: true,
            },
            theme: 'dracula',
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
          });
      }

      editorRef.current.on('change' , (instance , changes) => {     // 'change' is the event of codemirror which is fired when we do something in code-editor
        console.log('changes : ' , changes);
        const {origin} = changes ;   // origin property of changes object gives the info about event on editor (input , cut , paste etc...)
        const code = instance.getValue();

        if (origin !== 'setValue') {
          socketRef.current.emit('code-change' , {
            roomId,
            code,
          })
        }

        console.log(code);
      })

    }
  useEffect(() => {
    init()
  }, []); // Empty dependency array ensures useEffect runs once after the initial render
  

  useEffect( () =>{
      if (socketRef.current) {
        socketRef.current.on('code-change', ({code}) => {
          if (code != null) {
            editorRef.current.setValue(code);
          }
        })
      }
  },[socketRef.current])

  return (
      <textarea id="editor">

      </textarea>
  );
}

export default Editor;
