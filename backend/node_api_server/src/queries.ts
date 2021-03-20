import { gql } from 'graphql-request'

export const GET_ALL_ACCOUNTS = gql`
query {
  allAccounts {
    nodes {
      id
      username
      password
    }
  }
}
`

export const CREATE_ACCOUNT = gql`
mutation CreateAccount($username: String!, $password: String!, $created: Date!) {
  createAccount(input: { account: { username: $username, password: $password, created: $created}}) {
    account {
      id
      username
      password
      created
    }
    
  }
}
`

export const CREATE_OFFER = gql`
mutation CreateOffer($input: OfferInput!) {
	createOffer(input: { offer: $input}) {
    offer {
      id
    } 
  }
}
`

export const GET_LIST_OFFERS_ID = gql`
query {
  allOffers {
    nodes {
      id
    }
  }
}
`

export const DELETE_OFFER_BY_ID = gql`
mutation DeleteOffer($id: BigInt!){
  deleteOfferById(input: { id: $id }) {
    deletedOfferId
  }
}
`