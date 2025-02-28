import { gql } from 'graphql-request'

export const FEATURED_PRODUCTS_QUERY = gql`
  query FeaturedProducts {
    products(where: {featured: true}) {
      nodes {
        id
        databaseId
        name
        onSale
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          stockStatus
          stockQuantity
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
        }
        ... on ExternalProduct {
          price
          regularPrice
          salePrice
        }
        ... on GroupProduct {
          price
          regularPrice
          salePrice
        }
      }
    }
  }
`

export const PRODUCT_QUERY = gql`
  query Product($id: ID!) {
    product(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      name
      onSale
      description
      image {
        sourceUrl
        altText
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockStatus
        stockQuantity
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
      }
      ... on ExternalProduct {
        price
        regularPrice
        salePrice
      }
      ... on GroupProduct {
        price
        regularPrice
        salePrice
      }
    }
  }
`

export const CART_QUERY = gql`
  query Cart {
    cart {
      contents {
        nodes {
          key
          product {
            node {
              id
              databaseId
              name
              image {
                sourceUrl
                altText
              }
              ... on SimpleProduct {
                price
              }
              ... on VariableProduct {
                price
              }
              ... on ExternalProduct {
                price
              }
              ... on GroupProduct {
                price
              }
            }
          }
          quantity
          total
        }
      }
      total
      subtotal
      shippingTotal
      discountTotal
    }
  }
`

export const ADD_TO_CART_MUTATION = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      cartItem {
        key
        product {
          node {
            id
            databaseId
            name
            image {
              sourceUrl
              altText
            }
            ... on SimpleProduct {
              price
            }
            ... on VariableProduct {
              price
            }
            ... on ExternalProduct {
              price
            }
            ... on GroupProduct {
              price
            }
          }
        }
        quantity
        total
      }
    }
  }
`

export const UPDATE_CART_ITEM_MUTATION = gql`
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input) {
      cartItem {
        key
        quantity
        total
      }
    }
  }
`

export const REMOVE_CART_ITEM_MUTATION = gql`
  mutation RemoveCartItem($input: RemoveCartItemInput!) {
    removeCartItem(input: $input) {
      cartItem {
        key
      }
    }
  }
`

export const APPLY_COUPON_MUTATION = gql`
  mutation ApplyCoupon($input: ApplyCouponInput!) {
    applyCoupon(input: $input) {
      cart {
        appliedCoupons {
          code
          discountAmount
        }
        total
        subtotal
        discountTotal
      }
    }
  }
`

export const UPDATE_SHIPPING_METHOD_MUTATION = gql`
  mutation UpdateShippingMethod($input: UpdateShippingMethodInput!) {
    updateShippingMethod(input: $input) {
      cart {
        shippingTotal
        total
        availableShippingMethods {
          packageDetails
          rates {
            id
            cost
            label
          }
        }
      }
    }
  }
`

export const CHECKOUT_MUTATION = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      clientMutationId
      order {
        id
        orderKey
        orderNumber
        status
        total
      }
      result
      redirect
    }
  }
`

export const GET_SHIPPING_METHODS_QUERY = gql`
  query ShippingMethods {
    cart {
      availableShippingMethods {
        packageDetails
        rates {
          id
          cost
          label
        }
      }
    }
  }
` 