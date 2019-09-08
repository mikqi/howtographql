import React, { useState } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

const Search = ({ client }) => {
  const [state, setState] = useState({
    links: [],
    filter: ''
  })

  const doSearch = async () => {
    const { filter } = state
    const result = await client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter }
    })

    const links = result.data.feed.links
    setState({ ...state, links })
  }

  return (
    <div>
      <div>
        Search
        <input type="text" onChange={e => setState({ ...state, filter: e.target.value })} />
        <button onClick={() => doSearch()}>OK</button>
      </div>
      {state.links.map((link, index) => (
        <Link key={link.id} index={index} link={link} />
      ))}
    </div>
  )
}

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
            name
          }
        }
      }
    }
  }
`

export default withApollo(Search)
