import React from 'react'
import { ButtonProps } from './Button.types'
import './Button.less'
const noop = () => {}

const Button = ({ onClick = noop, text = '', type = 'primary' }: ButtonProps): JSX.Element => {
	return <button onClick={onClick}>this is a button</button>
}

export default Button
