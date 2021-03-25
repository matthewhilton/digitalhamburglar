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

export const GET_OFFER_SIMPLE_LIST = gql`
query {
  allOffers {
   nodes {
      externalId
      title
    	offerbucket
      image
    }
  }
}
`

export const GET_OFFER_MCD_DETAILS = gql`
query QueryOfferByExternalId($externalId: String!){
  allOffers(condition: {
    externalId: $externalId
  }) {
    nodes {
      id
      mcdPropid
      mcdOfferid
      accountByAccountId {
        username
        password
        created
        id
      }
    }
  }
}
`

export const UPDATE_OFFER_CHECKED = gql`
mutation UpdateOfferLastChecked($id: BigInt!, $lastChecked: Datetime!){
  updateOfferById(input: { id: $id, offerPatch: { lastChecked: $lastChecked }}) {
    offer {
      id
    }
  }
}
`

export const QUERY_BY_EXTERNAL_ID = gql`
query QueryOfferByExternalId($externalId: String!){
  allOffers(condition: {
    externalId: $externalId
  }) {
    nodes {
      title
      description
      externalId
      expires
      image
      lastChecked
    }
  }
}
`
