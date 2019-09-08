import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { AUTH_TOKEN } from '../constants'

const Login = ({ navigate }) => {
  const [state, setState] = useState({
    login: true,
    email: '',
    password: '',
    name: ''
  })

  const confirm = async data => {
    const { token } = state.login ? data.login : data.signup
    saveUserData(token)
    navigate('/')
  }
  const saveUserData = token => window.localStorage.setItem(AUTH_TOKEN, token)
  return (
    <div>
      <h4 className="mv3">{state.login ? 'Login' : 'Sign Up'}</h4>
      <div className="flex flex-column">
        {!state.login && (
          <input
            value={state.name}
            onChange={e => setState({ ...state, name: e.target.value })}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={state.email}
          onChange={e => setState({ ...state, email: e.target.value })}
          type="text"
          placeholder="Your email address"
        />
        <input
          value={state.password}
          onChange={e => setState({ ...state, password: e.target.value })}
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <Mutation
          mutation={state.login ? LOGIN_MUTATION : SIGNUP_MUTATION}
          variables={{ email: state.email, password: state.password, name: state.name }}
          onCompleted={data => confirm(data)}
        >
          {mutation => (
            <div className="pointer mr2 button" onClick={mutation}>
              {state.login ? 'login' : 'create account'}
            </div>
          )}
        </Mutation>
        <div className="pointer button" onClick={() => setState({ ...state, login: !state.login })}>
          {state.login ? 'need to create an account?' : 'already have an account?'}
        </div>
      </div>
    </div>
  )
}

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

export default Login
