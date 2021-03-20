import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
  /**
   * A signed eight-byte integer. The upper big integer values are greater than the
   * max value for a JavaScript number. Therefore all big integers will be output as
   * strings and not numbers.
   */
  BigInt: any;
  /** The day, does not include a time. */
  Date: any;
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.
   */
  Datetime: any;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID'];
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** Reads and enables pagination through a set of `Account`. */
  allAccounts?: Maybe<AccountsConnection>;
  /** Reads and enables pagination through a set of `Offer`. */
  allOffers?: Maybe<OffersConnection>;
  accountById?: Maybe<Account>;
  accountByUsername?: Maybe<Account>;
  offerById?: Maybe<Offer>;
  /** Reads a single `Account` using its globally unique `ID`. */
  account?: Maybe<Account>;
  /** Reads a single `Offer` using its globally unique `ID`. */
  offer?: Maybe<Offer>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAllAccountsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<AccountsOrderBy>>;
  condition?: Maybe<AccountCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllOffersArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<OffersOrderBy>>;
  condition?: Maybe<OfferCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAccountByIdArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAccountByUsernameArgs = {
  username: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryOfferByIdArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAccountArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryOfferArgs = {
  nodeId: Scalars['ID'];
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};


/** Methods to use when ordering `Account`. */
export enum AccountsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  UsernameAsc = 'USERNAME_ASC',
  UsernameDesc = 'USERNAME_DESC',
  PasswordAsc = 'PASSWORD_ASC',
  PasswordDesc = 'PASSWORD_DESC',
  CreatedAsc = 'CREATED_ASC',
  CreatedDesc = 'CREATED_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Account` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type AccountCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `username` field. */
  username?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `password` field. */
  password?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `created` field. */
  created?: Maybe<Scalars['Date']>;
};



/** A connection to a list of `Account` values. */
export type AccountsConnection = {
  __typename?: 'AccountsConnection';
  /** A list of `Account` objects. */
  nodes: Array<Maybe<Account>>;
  /** A list of edges which contains the `Account` and cursor to aid in pagination. */
  edges: Array<AccountsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type Account = Node & {
  __typename?: 'Account';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  username: Scalars['String'];
  password: Scalars['String'];
  created: Scalars['Date'];
  /** Reads and enables pagination through a set of `Offer`. */
  offersByAccountId: OffersConnection;
};


export type AccountOffersByAccountIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<OffersOrderBy>>;
  condition?: Maybe<OfferCondition>;
};

/** Methods to use when ordering `Offer`. */
export enum OffersOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ExternalIdAsc = 'EXTERNAL_ID_ASC',
  ExternalIdDesc = 'EXTERNAL_ID_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  McdOfferidAsc = 'MCD_OFFERID_ASC',
  McdOfferidDesc = 'MCD_OFFERID_DESC',
  McdPropidAsc = 'MCD_PROPID_ASC',
  McdPropidDesc = 'MCD_PROPID_DESC',
  LastCheckedAsc = 'LAST_CHECKED_ASC',
  LastCheckedDesc = 'LAST_CHECKED_DESC',
  AccountIdAsc = 'ACCOUNT_ID_ASC',
  AccountIdDesc = 'ACCOUNT_ID_DESC',
  ExpiresAsc = 'EXPIRES_ASC',
  ExpiresDesc = 'EXPIRES_DESC',
  OfferbucketAsc = 'OFFERBUCKET_ASC',
  OfferbucketDesc = 'OFFERBUCKET_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Offer` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type OfferCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `externalId` field. */
  externalId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `title` field. */
  title?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `mcdOfferid` field. */
  mcdOfferid?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `mcdPropid` field. */
  mcdPropid?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `lastChecked` field. */
  lastChecked?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `accountId` field. */
  accountId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `expires` field. */
  expires?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `offerbucket` field. */
  offerbucket?: Maybe<Scalars['String']>;
};


/** A connection to a list of `Offer` values. */
export type OffersConnection = {
  __typename?: 'OffersConnection';
  /** A list of `Offer` objects. */
  nodes: Array<Maybe<Offer>>;
  /** A list of edges which contains the `Offer` and cursor to aid in pagination. */
  edges: Array<OffersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Offer` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type Offer = Node & {
  __typename?: 'Offer';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  externalId: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  mcdOfferid: Scalars['Int'];
  mcdPropid: Scalars['Int'];
  lastChecked: Scalars['Datetime'];
  accountId: Scalars['BigInt'];
  expires: Scalars['Datetime'];
  offerbucket: Scalars['String'];
  /** Reads a single `Account` that is related to this `Offer`. */
  accountByAccountId?: Maybe<Account>;
};

/** A `Offer` edge in the connection. */
export type OffersEdge = {
  __typename?: 'OffersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Offer` at the end of the edge. */
  node?: Maybe<Offer>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>;
};

/** A `Account` edge in the connection. */
export type AccountsEdge = {
  __typename?: 'AccountsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Account`. */
  createAccount?: Maybe<CreateAccountPayload>;
  /** Creates a single `Offer`. */
  createOffer?: Maybe<CreateOfferPayload>;
  /** Updates a single `Account` using its globally unique id and a patch. */
  updateAccount?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccountById?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccountByUsername?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Offer` using its globally unique id and a patch. */
  updateOffer?: Maybe<UpdateOfferPayload>;
  /** Updates a single `Offer` using a unique key and a patch. */
  updateOfferById?: Maybe<UpdateOfferPayload>;
  /** Deletes a single `Account` using its globally unique id. */
  deleteAccount?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccountById?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccountByUsername?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Offer` using its globally unique id. */
  deleteOffer?: Maybe<DeleteOfferPayload>;
  /** Deletes a single `Offer` using a unique key. */
  deleteOfferById?: Maybe<DeleteOfferPayload>;
  deleteOffers?: Maybe<DeleteOffersPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateOfferArgs = {
  input: CreateOfferInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountByIdArgs = {
  input: UpdateAccountByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountByUsernameArgs = {
  input: UpdateAccountByUsernameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateOfferArgs = {
  input: UpdateOfferInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateOfferByIdArgs = {
  input: UpdateOfferByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountArgs = {
  input: DeleteAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountByIdArgs = {
  input: DeleteAccountByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountByUsernameArgs = {
  input: DeleteAccountByUsernameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteOfferArgs = {
  input: DeleteOfferInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteOfferByIdArgs = {
  input: DeleteOfferByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteOffersArgs = {
  input: DeleteOffersInput;
};

/** All input for the create `Account` mutation. */
export type CreateAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Account` to be created by this mutation. */
  account: AccountInput;
};

/** An input for mutations affecting `Account` */
export type AccountInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  created: Scalars['Date'];
};

/** The output of our create `Account` mutation. */
export type CreateAccountPayload = {
  __typename?: 'CreateAccountPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Account` that was created by this mutation. */
  account?: Maybe<Account>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
};


/** The output of our create `Account` mutation. */
export type CreateAccountPayloadAccountEdgeArgs = {
  orderBy?: Maybe<Array<AccountsOrderBy>>;
};

/** All input for the create `Offer` mutation. */
export type CreateOfferInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Offer` to be created by this mutation. */
  offer: OfferInput;
};

/** An input for mutations affecting `Offer` */
export type OfferInput = {
  externalId: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  mcdOfferid: Scalars['Int'];
  mcdPropid: Scalars['Int'];
  lastChecked: Scalars['Datetime'];
  accountId: Scalars['BigInt'];
  expires: Scalars['Datetime'];
  offerbucket: Scalars['String'];
};

/** The output of our create `Offer` mutation. */
export type CreateOfferPayload = {
  __typename?: 'CreateOfferPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Offer` that was created by this mutation. */
  offer?: Maybe<Offer>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Offer`. */
  accountByAccountId?: Maybe<Account>;
  /** An edge for our `Offer`. May be used by Relay 1. */
  offerEdge?: Maybe<OffersEdge>;
};


/** The output of our create `Offer` mutation. */
export type CreateOfferPayloadOfferEdgeArgs = {
  orderBy?: Maybe<Array<OffersOrderBy>>;
};

/** All input for the `updateAccount` mutation. */
export type UpdateAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Account` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Account` being updated. */
  accountPatch: AccountPatch;
};

/** Represents an update to a `Account`. Fields that are set will be updated. */
export type AccountPatch = {
  username?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['Date']>;
};

/** The output of our update `Account` mutation. */
export type UpdateAccountPayload = {
  __typename?: 'UpdateAccountPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Account` that was updated by this mutation. */
  account?: Maybe<Account>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
};


/** The output of our update `Account` mutation. */
export type UpdateAccountPayloadAccountEdgeArgs = {
  orderBy?: Maybe<Array<AccountsOrderBy>>;
};

/** All input for the `updateAccountById` mutation. */
export type UpdateAccountByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Account` being updated. */
  accountPatch: AccountPatch;
  id: Scalars['BigInt'];
};

/** All input for the `updateAccountByUsername` mutation. */
export type UpdateAccountByUsernameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Account` being updated. */
  accountPatch: AccountPatch;
  username: Scalars['String'];
};

/** All input for the `updateOffer` mutation. */
export type UpdateOfferInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Offer` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Offer` being updated. */
  offerPatch: OfferPatch;
};

/** Represents an update to a `Offer`. Fields that are set will be updated. */
export type OfferPatch = {
  externalId?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  mcdOfferid?: Maybe<Scalars['Int']>;
  mcdPropid?: Maybe<Scalars['Int']>;
  lastChecked?: Maybe<Scalars['Datetime']>;
  accountId?: Maybe<Scalars['BigInt']>;
  expires?: Maybe<Scalars['Datetime']>;
  offerbucket?: Maybe<Scalars['String']>;
};

/** The output of our update `Offer` mutation. */
export type UpdateOfferPayload = {
  __typename?: 'UpdateOfferPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Offer` that was updated by this mutation. */
  offer?: Maybe<Offer>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Offer`. */
  accountByAccountId?: Maybe<Account>;
  /** An edge for our `Offer`. May be used by Relay 1. */
  offerEdge?: Maybe<OffersEdge>;
};


/** The output of our update `Offer` mutation. */
export type UpdateOfferPayloadOfferEdgeArgs = {
  orderBy?: Maybe<Array<OffersOrderBy>>;
};

/** All input for the `updateOfferById` mutation. */
export type UpdateOfferByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Offer` being updated. */
  offerPatch: OfferPatch;
  id: Scalars['BigInt'];
};

/** All input for the `deleteAccount` mutation. */
export type DeleteAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Account` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Account` mutation. */
export type DeleteAccountPayload = {
  __typename?: 'DeleteAccountPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Account` that was deleted by this mutation. */
  account?: Maybe<Account>;
  deletedAccountId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
};


/** The output of our delete `Account` mutation. */
export type DeleteAccountPayloadAccountEdgeArgs = {
  orderBy?: Maybe<Array<AccountsOrderBy>>;
};

/** All input for the `deleteAccountById` mutation. */
export type DeleteAccountByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `deleteAccountByUsername` mutation. */
export type DeleteAccountByUsernameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  username: Scalars['String'];
};

/** All input for the `deleteOffer` mutation. */
export type DeleteOfferInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Offer` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Offer` mutation. */
export type DeleteOfferPayload = {
  __typename?: 'DeleteOfferPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Offer` that was deleted by this mutation. */
  offer?: Maybe<Offer>;
  deletedOfferId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Account` that is related to this `Offer`. */
  accountByAccountId?: Maybe<Account>;
  /** An edge for our `Offer`. May be used by Relay 1. */
  offerEdge?: Maybe<OffersEdge>;
};


/** The output of our delete `Offer` mutation. */
export type DeleteOfferPayloadOfferEdgeArgs = {
  orderBy?: Maybe<Array<OffersOrderBy>>;
};

/** All input for the `deleteOfferById` mutation. */
export type DeleteOfferByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `deleteOffers` mutation. */
export type DeleteOffersInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
};

/** The output of our `deleteOffers` mutation. */
export type DeleteOffersPayload = {
  __typename?: 'DeleteOffersPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Node: ResolversTypes['Query'] | ResolversTypes['Account'] | ResolversTypes['Offer'];
  Cursor: ResolverTypeWrapper<Scalars['Cursor']>;
  AccountsOrderBy: AccountsOrderBy;
  AccountCondition: AccountCondition;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  AccountsConnection: ResolverTypeWrapper<AccountsConnection>;
  Account: ResolverTypeWrapper<Account>;
  OffersOrderBy: OffersOrderBy;
  OfferCondition: OfferCondition;
  Datetime: ResolverTypeWrapper<Scalars['Datetime']>;
  OffersConnection: ResolverTypeWrapper<OffersConnection>;
  Offer: ResolverTypeWrapper<Offer>;
  OffersEdge: ResolverTypeWrapper<OffersEdge>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  AccountsEdge: ResolverTypeWrapper<AccountsEdge>;
  Mutation: ResolverTypeWrapper<{}>;
  CreateAccountInput: CreateAccountInput;
  AccountInput: AccountInput;
  CreateAccountPayload: ResolverTypeWrapper<CreateAccountPayload>;
  CreateOfferInput: CreateOfferInput;
  OfferInput: OfferInput;
  CreateOfferPayload: ResolverTypeWrapper<CreateOfferPayload>;
  UpdateAccountInput: UpdateAccountInput;
  AccountPatch: AccountPatch;
  UpdateAccountPayload: ResolverTypeWrapper<UpdateAccountPayload>;
  UpdateAccountByIdInput: UpdateAccountByIdInput;
  UpdateAccountByUsernameInput: UpdateAccountByUsernameInput;
  UpdateOfferInput: UpdateOfferInput;
  OfferPatch: OfferPatch;
  UpdateOfferPayload: ResolverTypeWrapper<UpdateOfferPayload>;
  UpdateOfferByIdInput: UpdateOfferByIdInput;
  DeleteAccountInput: DeleteAccountInput;
  DeleteAccountPayload: ResolverTypeWrapper<DeleteAccountPayload>;
  DeleteAccountByIdInput: DeleteAccountByIdInput;
  DeleteAccountByUsernameInput: DeleteAccountByUsernameInput;
  DeleteOfferInput: DeleteOfferInput;
  DeleteOfferPayload: ResolverTypeWrapper<DeleteOfferPayload>;
  DeleteOfferByIdInput: DeleteOfferByIdInput;
  DeleteOffersInput: DeleteOffersInput;
  DeleteOffersPayload: ResolverTypeWrapper<DeleteOffersPayload>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  String: Scalars['String'];
  Node: ResolversParentTypes['Query'] | ResolversParentTypes['Account'] | ResolversParentTypes['Offer'];
  Cursor: Scalars['Cursor'];
  AccountCondition: AccountCondition;
  BigInt: Scalars['BigInt'];
  Date: Scalars['Date'];
  AccountsConnection: AccountsConnection;
  Account: Account;
  OfferCondition: OfferCondition;
  Datetime: Scalars['Datetime'];
  OffersConnection: OffersConnection;
  Offer: Offer;
  OffersEdge: OffersEdge;
  PageInfo: PageInfo;
  Boolean: Scalars['Boolean'];
  AccountsEdge: AccountsEdge;
  Mutation: {};
  CreateAccountInput: CreateAccountInput;
  AccountInput: AccountInput;
  CreateAccountPayload: CreateAccountPayload;
  CreateOfferInput: CreateOfferInput;
  OfferInput: OfferInput;
  CreateOfferPayload: CreateOfferPayload;
  UpdateAccountInput: UpdateAccountInput;
  AccountPatch: AccountPatch;
  UpdateAccountPayload: UpdateAccountPayload;
  UpdateAccountByIdInput: UpdateAccountByIdInput;
  UpdateAccountByUsernameInput: UpdateAccountByUsernameInput;
  UpdateOfferInput: UpdateOfferInput;
  OfferPatch: OfferPatch;
  UpdateOfferPayload: UpdateOfferPayload;
  UpdateOfferByIdInput: UpdateOfferByIdInput;
  DeleteAccountInput: DeleteAccountInput;
  DeleteAccountPayload: DeleteAccountPayload;
  DeleteAccountByIdInput: DeleteAccountByIdInput;
  DeleteAccountByUsernameInput: DeleteAccountByUsernameInput;
  DeleteOfferInput: DeleteOfferInput;
  DeleteOfferPayload: DeleteOfferPayload;
  DeleteOfferByIdInput: DeleteOfferByIdInput;
  DeleteOffersInput: DeleteOffersInput;
  DeleteOffersPayload: DeleteOffersPayload;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'nodeId'>>;
  allAccounts?: Resolver<Maybe<ResolversTypes['AccountsConnection']>, ParentType, ContextType, RequireFields<QueryAllAccountsArgs, 'orderBy'>>;
  allOffers?: Resolver<Maybe<ResolversTypes['OffersConnection']>, ParentType, ContextType, RequireFields<QueryAllOffersArgs, 'orderBy'>>;
  accountById?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryAccountByIdArgs, 'id'>>;
  accountByUsername?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryAccountByUsernameArgs, 'username'>>;
  offerById?: Resolver<Maybe<ResolversTypes['Offer']>, ParentType, ContextType, RequireFields<QueryOfferByIdArgs, 'id'>>;
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryAccountArgs, 'nodeId'>>;
  offer?: Resolver<Maybe<ResolversTypes['Offer']>, ParentType, ContextType, RequireFields<QueryOfferArgs, 'nodeId'>>;
};

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Query' | 'Account' | 'Offer', ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export interface CursorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Cursor'], any> {
  name: 'Cursor';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type AccountsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountsConnection'] = ResolversParentTypes['AccountsConnection']> = {
  nodes?: Resolver<Array<Maybe<ResolversTypes['Account']>>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['AccountsEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = {
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  offersByAccountId?: Resolver<ResolversTypes['OffersConnection'], ParentType, ContextType, RequireFields<AccountOffersByAccountIdArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DatetimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Datetime'], any> {
  name: 'Datetime';
}

export type OffersConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['OffersConnection'] = ResolversParentTypes['OffersConnection']> = {
  nodes?: Resolver<Array<Maybe<ResolversTypes['Offer']>>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['OffersEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OfferResolvers<ContextType = any, ParentType extends ResolversParentTypes['Offer'] = ResolversParentTypes['Offer']> = {
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  externalId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mcdOfferid?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  mcdPropid?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastChecked?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  accountId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  expires?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  offerbucket?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  accountByAccountId?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OffersEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['OffersEdge'] = ResolversParentTypes['OffersEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['Offer']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  endCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountsEdge'] = ResolversParentTypes['AccountsEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAccount?: Resolver<Maybe<ResolversTypes['CreateAccountPayload']>, ParentType, ContextType, RequireFields<MutationCreateAccountArgs, 'input'>>;
  createOffer?: Resolver<Maybe<ResolversTypes['CreateOfferPayload']>, ParentType, ContextType, RequireFields<MutationCreateOfferArgs, 'input'>>;
  updateAccount?: Resolver<Maybe<ResolversTypes['UpdateAccountPayload']>, ParentType, ContextType, RequireFields<MutationUpdateAccountArgs, 'input'>>;
  updateAccountById?: Resolver<Maybe<ResolversTypes['UpdateAccountPayload']>, ParentType, ContextType, RequireFields<MutationUpdateAccountByIdArgs, 'input'>>;
  updateAccountByUsername?: Resolver<Maybe<ResolversTypes['UpdateAccountPayload']>, ParentType, ContextType, RequireFields<MutationUpdateAccountByUsernameArgs, 'input'>>;
  updateOffer?: Resolver<Maybe<ResolversTypes['UpdateOfferPayload']>, ParentType, ContextType, RequireFields<MutationUpdateOfferArgs, 'input'>>;
  updateOfferById?: Resolver<Maybe<ResolversTypes['UpdateOfferPayload']>, ParentType, ContextType, RequireFields<MutationUpdateOfferByIdArgs, 'input'>>;
  deleteAccount?: Resolver<Maybe<ResolversTypes['DeleteAccountPayload']>, ParentType, ContextType, RequireFields<MutationDeleteAccountArgs, 'input'>>;
  deleteAccountById?: Resolver<Maybe<ResolversTypes['DeleteAccountPayload']>, ParentType, ContextType, RequireFields<MutationDeleteAccountByIdArgs, 'input'>>;
  deleteAccountByUsername?: Resolver<Maybe<ResolversTypes['DeleteAccountPayload']>, ParentType, ContextType, RequireFields<MutationDeleteAccountByUsernameArgs, 'input'>>;
  deleteOffer?: Resolver<Maybe<ResolversTypes['DeleteOfferPayload']>, ParentType, ContextType, RequireFields<MutationDeleteOfferArgs, 'input'>>;
  deleteOfferById?: Resolver<Maybe<ResolversTypes['DeleteOfferPayload']>, ParentType, ContextType, RequireFields<MutationDeleteOfferByIdArgs, 'input'>>;
  deleteOffers?: Resolver<Maybe<ResolversTypes['DeleteOffersPayload']>, ParentType, ContextType, RequireFields<MutationDeleteOffersArgs, 'input'>>;
};

export type CreateAccountPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAccountPayload'] = ResolversParentTypes['CreateAccountPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  accountEdge?: Resolver<Maybe<ResolversTypes['AccountsEdge']>, ParentType, ContextType, RequireFields<CreateAccountPayloadAccountEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateOfferPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateOfferPayload'] = ResolversParentTypes['CreateOfferPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  offer?: Resolver<Maybe<ResolversTypes['Offer']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  accountByAccountId?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  offerEdge?: Resolver<Maybe<ResolversTypes['OffersEdge']>, ParentType, ContextType, RequireFields<CreateOfferPayloadOfferEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAccountPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAccountPayload'] = ResolversParentTypes['UpdateAccountPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  accountEdge?: Resolver<Maybe<ResolversTypes['AccountsEdge']>, ParentType, ContextType, RequireFields<UpdateAccountPayloadAccountEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateOfferPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateOfferPayload'] = ResolversParentTypes['UpdateOfferPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  offer?: Resolver<Maybe<ResolversTypes['Offer']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  accountByAccountId?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  offerEdge?: Resolver<Maybe<ResolversTypes['OffersEdge']>, ParentType, ContextType, RequireFields<UpdateOfferPayloadOfferEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteAccountPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteAccountPayload'] = ResolversParentTypes['DeleteAccountPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  deletedAccountId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  accountEdge?: Resolver<Maybe<ResolversTypes['AccountsEdge']>, ParentType, ContextType, RequireFields<DeleteAccountPayloadAccountEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteOfferPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteOfferPayload'] = ResolversParentTypes['DeleteOfferPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  offer?: Resolver<Maybe<ResolversTypes['Offer']>, ParentType, ContextType>;
  deletedOfferId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  accountByAccountId?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  offerEdge?: Resolver<Maybe<ResolversTypes['OffersEdge']>, ParentType, ContextType, RequireFields<DeleteOfferPayloadOfferEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteOffersPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteOffersPayload'] = ResolversParentTypes['DeleteOffersPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Query?: QueryResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  Cursor?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  AccountsConnection?: AccountsConnectionResolvers<ContextType>;
  Account?: AccountResolvers<ContextType>;
  Datetime?: GraphQLScalarType;
  OffersConnection?: OffersConnectionResolvers<ContextType>;
  Offer?: OfferResolvers<ContextType>;
  OffersEdge?: OffersEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  AccountsEdge?: AccountsEdgeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  CreateAccountPayload?: CreateAccountPayloadResolvers<ContextType>;
  CreateOfferPayload?: CreateOfferPayloadResolvers<ContextType>;
  UpdateAccountPayload?: UpdateAccountPayloadResolvers<ContextType>;
  UpdateOfferPayload?: UpdateOfferPayloadResolvers<ContextType>;
  DeleteAccountPayload?: DeleteAccountPayloadResolvers<ContextType>;
  DeleteOfferPayload?: DeleteOfferPayloadResolvers<ContextType>;
  DeleteOffersPayload?: DeleteOffersPayloadResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
