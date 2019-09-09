import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import qs from 'query-string'
import { navigate } from '@reach/router'
import Link from './Link'
import { LINKS_PER_PAGE } from '../constants'

const LinkList = props => {
  const updateCacheAfterVote = (store, createVote, linkid) => {
    const isNewPage = props.location.pathname.includes('new')
    const page = parseInt(props.page, 10)
    const skip = isNewPage ? page - 1 + LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null

    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy }
    })
    const votedLink = data.feed.links.find(link => link.id === linkid)

    votedLink.votes = createVote.link.votes
    store.writeQuery({ query: FEED_QUERY, data })
  }

  const subscribeToNewLinks = async subscribeToMore => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newLink = subscriptionData.data.newLink
        const exists = prev.feed.links.find(({ id }) => id === newLink.id)

        if (exists) return prev

        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename
          }
        })
      }
    })
  }

  const subscribeToNewVote = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    })
  }

  const getQueryVariables = () => {
    const isNewPage = props.location.pathname.includes('new')
    const page = parseInt(props.page, 10)
    const skip = isNewPage ? page - 1 + LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null

    return {
      first,
      skip,
      orderBy
    }
  }

  const nextPage = data => {
    const page = parseInt(props.page, 10)

    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1
      console.log(nextPage)
      console.log(navigate)
      navigate(`/new/${nextPage}`)
    }
  }

  const previousPage = () => {
    const page = parseInt(props.page, 10)

    if (page > 1) {
      const previousPage = page - 1
      navigate(`/new/${previousPage}`)
    }
  }

  const getLinksToRender = data => {
    const isNewPage = props.location.pathname.includes('new')
    if (isNewPage) return data.feed.links

    const rankedLinks = data.feed.links.slice()
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)

    return rankedLinks
  }

  return (
    <Query query={FEED_QUERY} variables={getQueryVariables()}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <div>Fetching</div>
        if (error) return <div>Error</div>

        subscribeToNewLinks(subscribeToMore)
        subscribeToNewVote(subscribeToMore)

        const linksToRender = getLinksToRender(data)
        const isNewPage = props.location.pathname.includes('new')
        const pageIndex = props.page ? (props.page - 1) * LINKS_PER_PAGE : 0

        return (
          <Fragment>
            {linksToRender.map((link, index) => (
              <Link
                key={link.id}
                link={link}
                index={index + pageIndex}
                updateStoreAfterVote={updateCacheAfterVote}
              />
            ))}
            {isNewPage && (
              <div className="flex ml4 mv3 gray">
                <div className="pointer mr2" onClick={previousPage}>
                  Previous
                </div>
                <div className="pointer" onClick={() => nextPage(data)}>
                  Next
                </div>
              </div>
            )}
          </Fragment>
        )
      }}
    </Query>
  )
}

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
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
      count
    }
  }
`

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
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
`

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
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
          }
        }
      }
      user {
        id
      }
    }
  }
`

export default LinkList
