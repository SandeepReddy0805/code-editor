import React, { useState, useRef } from 'react'
import { Editor } from '@monaco-editor/react';
import axios from 'axios';

export default function App() {
  const editorRef = useRef(null);
  const [output, setOutput] = useState("");
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }
  const submitCode = async ()=>{
    const sourceCode = editorRef.current.getValue();
    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      headers: {
        'x-rapidapi-key': '30d270473amshdea31901aeff278p14bd54jsnfb122eb99b93',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        language_id: 91,
        source_code: sourceCode,
        stdin: 'SnVkZ2Uw'
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log(response.data);
      const getOptions = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/' + response.data.token,
        headers: {
          'x-rapidapi-key': '30d270473amshdea31901aeff278p14bd54jsnfb122eb99b93',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      };
      
      try {
        setTimeout(async ()=>{
          const response = await axios.request(getOptions);
          console.log(response.data);
          if(response.data.status.id === 3){
            setOutput(response.data.stdout);
          }else{
            setOutput(response.data.stderr)
          }
        },2000);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className='grid grid-cols-2'>
      <div className='p-5'>
        <Editor 
          height="60vh"
          theme='vs-dark'
          defaultLanguage="java" 
          defaultValue="// write your code here"
          onMount={handleEditorDidMount} />
        <div>
          <button className='px-4 py-2 bg-emerald-400 rounded-lg my-2' onClick={submitCode}>Run Code</button>
          <button className='px-4 py-2 bg-blue-400 rounded-lg my-2 mx-4'>Submit</button>
        </div>
        <div className='flex'>
          <div className='flex flex-col m-2'>
            <label className='my-2 bg-slate-100 px-2 rounded-md' htmlFor="sample-input">Sample Input: </label>
            <textarea className='border border-gray-400 px-2' name="sample-input" id="sample-input" rows={5} cols={40}></textarea>
          </div>
          <div className='flex flex-col m-2'>
            <label className='my-2 bg-slate-100 px-2 rounded-md' htmlFor="sample-input">Sample Output: </label>
            <textarea className='border border-gray-400 font-mono' value={output} name="sample-input" id="sample-input" readOnly rows={5} cols={40}></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

