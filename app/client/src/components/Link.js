import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { timeDifferenceForDate } from '../utls'
import { AUTH_TOKEN } from '../constants'

function Link({ link, index }) {
  const authToken = localStorage.getItem(AUTH_TOKEN)

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <Mutation variables={{ linkId: link.id }} mutation={VOTE_MUTATION}>
            {voteMutation => (
              <div className="ml1 gray f11" onClick={voteMutation}>
                ▲
              </div>
            )}
          </Mutation>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        <div className="f6 lh-copy gray">
          {link.votes.length} votes | by {link.postedBy ? link.postedBy.name : 'Unknown'}{' '}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  )
}

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      user {
        id
      }
      link {
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

export default Link
