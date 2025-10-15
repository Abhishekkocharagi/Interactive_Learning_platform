import React, { useState } from 'react';
import './CodePlayground.css';

const CodePlayground = ({ initialCode = '', language = 'javascript' }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setOutput('');

    try {
      // Simple JavaScript execution for demo
      // In production, you'd use a proper code execution service
      const result = new Function(code)();
      setOutput(result ? result.toString() : 'Code executed successfully!');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }

    setIsRunning(false);
  };

  return (
    <div className="code-playground">
      <div className="playground-header">
        <h4>Code Playground - {language}</h4>
        <button 
          onClick={runCode} 
          disabled={isRunning}
          className="btn-primary run-btn"
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>
      
      <div className="code-editor">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
          className="code-input"
        />
      </div>
      
      <div className="code-output">
        <h5>Output:</h5>
        <pre className="output-content">
          {output || 'Click "Run Code" to see output'}
        </pre>
      </div>
    </div>
  );
};

export default CodePlayground;