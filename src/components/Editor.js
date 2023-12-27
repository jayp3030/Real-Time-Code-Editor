import React, { useEffect } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';

function Editor() {
    function init() {
        const textarea = document.getElementById('editor');
        if (textarea) {
            CodeMirror.fromTextArea(textarea, {
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
    }
  useEffect(() => {
    init()
  }, []); // Empty dependency array ensures useEffect runs once after the initial render

  return (
      <textarea id="editor">

      </textarea>
  );
}

export default Editor;
