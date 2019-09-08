import React, { useState } from 'react'
import { AUTH_TOKEN } from '../constants'

const Login = () => {
  const [state, setState] = useState({
    login: true,
    email: '',
    password: '',
    name: ''
  })

  const confirm = async () => {}
  const saveUserData = token => window.localStorage.setItem(AUTH_TOKEN, token)
  return (
    <div>
      <h4 className="mv3">{state.login ? 'Login' : 'Sign Up'}</h4>
      <div className="flex flex-column">
        {!state.login && (
          <input
            value={state.name}
            onChange={e => setState({ name: e.target.value })}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={state.email}
          onChange={e => setState({ email: e.target.value })}
          type="text"
          placeholder="Your email address"
        />
        <input
          value={state.password}
          onChange={e => setState({ password: e.target.value })}
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <div className="pointer mr2 button" onClick={() => confirm()}>
          {state.login ? 'login' : 'create account'}
        </div>
        <div className="pointer button" onClick={() => setState({ login: !state.login })}>
          {state.login ? 'need to create an account?' : 'already have an account?'}
        </div>
      </div>
    </div>
  )
}

export default Login
