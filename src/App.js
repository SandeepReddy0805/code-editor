import React, { useState, useRef } from 'react'
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import { userCode } from './Codes/userCode';
import Navbar from './Navbar';
import { CircularProgress } from '@mui/material';

export default function App() {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const expectedOutput = useRef(null);
  const [loading,setLoading] = useState(false)
  const [output, setOutput] = useState("");
  const [lastExpectedOutput, setlastExpectedOutput] = useState("");
  const [lastActualOutput, setlastActualOutput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [lastInput, setLastInput] = useState("");
  const [verdict, setVerdict] = useState("");
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }
  const submitCode = async ()=>{
    setLoading(true);
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
        stdin: hiddenInputRef.current.value
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
          if(response.data.status.id === 3 && response.data.stderr == null){
            if(response.data.stdout?.trim() === expectedOutput.current.value){
              setVerdict("Accepted");
              setSubmitted(true);
            }else{
              setVerdict("Wrong Answer");
              setSubmitted(true);
              let hiddenInput = hiddenInputRef.current.value.split("\n")
              let hiddenOutput = expectedOutput.current.value.split("\n")
              let actualOutput = response.data.stdout?.split("\n");
              for(let i=0;i<parseInt(hiddenInput[0]);i++){
                if(hiddenOutput[i]!==actualOutput[i]){
                  setLastInput(hiddenInput[i+1]);
                  setlastActualOutput(hiddenOutput[i]);
                  setlastExpectedOutput(actualOutput[i]);
                  break;
                }
              }
            }
          }else{
            let lastInput = '';
            if(response.data.status.id === 6){
              setVerdict("Compilation Error");
              lastInput = response.data.compile_output;
              setlastExpectedOutput(lastInput)
            }else{
              lastInput = response.data.stderr.split("\n")[0].split(':');
              if(lastInput[1].charAt(1) === "T"){
                setlastExpectedOutput("Time Limit Exceeded");
                setLastInput(lastInput[2]);
                setVerdict("Time Limit Exceeded");
              }else{
                setVerdict("Runtime Error");
                setlastExpectedOutput(lastInput[1] + ": " + lastInput[2]);
              }
            }
            setSubmitted(true);
          }
          setLoading(false);
        },2000);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const runCode = async ()=>{
    setLoading(true)
    const sourceCode = editorRef.current.getValue();
    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      headers: {
        'x-rapidapi-key': '345e7d98d1msh0c9ce8bab2eb9f6p10da51jsn07c5c66aa50a',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        language_id: 91,
        source_code: sourceCode,
        stdin: inputRef.current.value
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
            if(response.data.status.id === 6){
              setOutput(response.data.compile_output);
            }else{
              setOutput(response.data.stderr)
            }
          }
          setLoading(false);
        },2000);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
    <Navbar />
    <div className='flex'>
      <div className='py-5 px-5'>
        <Editor
          height="60vh"
          width="60vw"
          theme='vs-light'
          defaultLanguage="java"
          defaultValue={userCode}
          onMount={handleEditorDidMount} />
        <div>
          <button className='px-4 py-2 bg-emerald-400 rounded-lg my-2' onClick={runCode}>Run Code</button>
          <button className='px-4 py-2 bg-blue-400 rounded-lg my-2 mx-4' onClick={submitCode}>Submit</button>
        </div>
        <div className='flex'>
          <div className='flex flex-col m-2'>
            <label className='my-2 bg-blue-100 px-2 rounded-md' htmlFor="sample-input">Sample Input: </label>
            <textarea className='border border-gray-400 px-2' ref={inputRef} name="sample-input" id="sample-input" rows={5} cols={40}></textarea>
          </div>
          <div className='flex flex-col m-2'>
            <label className='my-2 bg-blue-100 px-2 rounded-md' htmlFor="sample-input">Sample Output: </label>
            <textarea className='border border-gray-400 font-mono' value={output} name="sample-input" id="sample-input" readOnly rows={5} cols={40}></textarea>
          </div>
        </div>
      </div>
      <div className='flex flex-col'>
        <h3 className='text-xl font-semibold p-1'>Hidden Testcases: </h3>
        <div className='flex flex-col'>
          <div className='flex flex-col'>
            <label className='my-2 bg-blue-100 px-2 rounded-md' htmlFor="sample-input">Hidden Input: </label>
            <textarea className='border border-gray-400 font-mono bg-blue-50 p-2' ref={hiddenInputRef} name="sample-input" id="sample-input" rows={5} cols={40}></textarea>
          </div>
          <div className='flex flex-col'>
            <label className='my-2 bg-blue-100 px-2 rounded-md' htmlFor="sample-input">Hidden Output: </label>
            <textarea className='border border-gray-400 font-mono bg-blue-50 p-2' ref={expectedOutput} name="sample-input" id="sample-input" rows={5} cols={40}></textarea>
          </div>
          <div className={`flex flex-col border border-gray-400 p-2 my-2 rounded-md ${(submitted && verdict === "Accepted") ? "bg-emerald-100" : submitted ? "bg-red-200" : ""}`}>
            {
              loading ? <div className="grid place-items-center"><CircularProgress/></div> :
              <>
            <label className={`my-2 bg-slate-100 px-2 rounded-md`} htmlFor="sample-input">Verdict: {verdict} </label>
            {verdict !== "Accepted" && (<div className={`${submitted ? "" : 'hidden'}`}>
              <div className={`${verdict === "Runtime Error" || verdict === "Compilation Error" ? "hidden" : ""}`}>
                <label htmlFor="">Last Executed Input: </label>
                <p className='bg-gray-100 p-2 rounded-lg'>num = {lastInput}</p>
                <label htmlFor="">Expected Output: </label>
                <p className='bg-gray-100 p-2 rounded-lg'>{lastActualOutput}</p>
              </div>
              <label htmlFor="">Actual Output: </label>
              <p className='bg-gray-100 p-2 rounded-lg'>{lastExpectedOutput}</p>
            </div>)}
            </>
          }
          </div>
        </div>
      </div>
    </div></>
  );
}

