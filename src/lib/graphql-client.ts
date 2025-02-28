import { GraphQLClient } from 'graphql-request'

const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_URL

if (!endpoint) {
  console.error('NEXT_PUBLIC_WORDPRESS_API_URL is not defined')
}

export const graphqlClient = new GraphQLClient(endpoint || '', {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': process.env.NEXT_PUBLIC_WORDPRESS_URL || '',
  },
})

// Add authentication token to headers if available
export const setAuthToken = (token: string) => {
  graphqlClient.setHeader('Authorization', `Bearer ${token}`)
}

// Remove authentication token
export const removeAuthToken = () => {
  graphqlClient.setHeader('Authorization', '')
} 