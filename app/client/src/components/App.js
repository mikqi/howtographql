import React from 'react'
import { Router } from '@reach/router'
import Header from './Header'
import LinkList from './LinkList'
import CreateLink from './CreateLink'

function App() {
  return (
    <>
      <Header />
      <Router>
        <LinkList path="/" />
        <CreateLink path="/create" />
      </Router>
    </>
  )
}

export default App
