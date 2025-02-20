import * as React from 'react'

declare module 'cmdk' {
  export interface CommandProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode
  }
} 