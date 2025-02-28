import { GraphQLClient } from 'graphql-request'

// Ensure the URL is properly constructed with the GraphQL endpoint
const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`

// Create GraphQL client with proper configuration
export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {},
  // Add error handling for development
  errorPolicy: 'all',
})

// Log the endpoint in development
if (process.env.NODE_ENV === 'development') {
  console.log('GraphQL Endpoint:', GRAPHQL_ENDPOINT)
}

// Authentication mutations
export const LOGIN_MUTATION = `
  mutation loginWithPassword($username: String!, $password: String!) {
    login(
      input: {
        provider: PASSWORD,
        credentials: {
          username: $username,
          password: $password
        }
      }
    ) {
      authToken
      authTokenExpiration
      refreshToken
      refreshTokenExpiration
      user {
        id
        databaseId
        name
        email
        firstName
        lastName
        username
      }
      wooSessionToken
      customer {
        id
        databaseId
        email
        firstName
        lastName
      }
    }
  }
`

export const REGISTER_MUTATION = `
  mutation registerUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      user {
        id
        name
        email
      }
    }
  }
`

export const REFRESH_TOKEN_MUTATION = `
  mutation refreshToken($token: String!) {
    refreshToken(input: { refreshToken: $token }) {
      authToken
      authTokenExpiration
      success
    }
  }
`

// Types
export interface LoginResponse {
  login: {
    authToken: string
    authTokenExpiration: string
    refreshToken: string
    refreshTokenExpiration: string
    user: {
      id: string
      databaseId: number
      name: string
      email: string
      firstName: string
      lastName: string
      username: string
    }
    wooSessionToken: string
    customer: {
      id: string
      databaseId: number
      email: string
      firstName: string
      lastName: string
    }
  }
}

export interface RegisterResponse {
  registerUser: {
    user: {
      id: string
      name: string
      email: string
    }
  }
}

export interface RefreshTokenResponse {
  refreshToken: {
    authToken: string
    authTokenExpiration: string
    success: boolean
  }
} 