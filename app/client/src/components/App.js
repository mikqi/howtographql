import React from 'react'
import { Router } from '@reach/router'
import Header from './Header'
import LinkList from './LinkList'
import CreateLink from './CreateLink'
import Login from './Login'
import Search from './Search'

function App() {
  return (
    <>
      <Header />
      <Router>
        <LinkList path="/" />
        <LinkList path="/top" />
        <LinkList path="/new/:page" />
        <CreateLink path="/create" />
        <Login path="/login" />
        <Search path="/search" />
      </Router>
    </>
  )
}

export default App
