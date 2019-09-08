import React from 'react'
import { Router } from '@reach/router'
import Header from './Header'
import LinkList from './LinkList'
import CreateLink from './CreateLink'
import Login from './Login'

function App() {
  return (
    <>
      <Header />
      <Router>
        <LinkList path="/" />
        <CreateLink path="/create" />
        <Login path="/login" />
      </Router>
    </>
  )
}

export default App
