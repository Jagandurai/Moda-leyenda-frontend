/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {

    const { navigate, accessToken, setCartItems, backendURL } = useContext(ShopContext)
    const [searchParams, setSearchParams] = useSearchParams()

    const verifyPayment = async () => {

        const success = searchParams.get('success')
        const orderId = searchParams.get('orderId')

        try {

            if (!accessToken) {
                return null
            }

            const response = await axios
                .post(`${backendURL}/api/order/verifyStripe`,
                    { success, orderId },
                    {
                        headers:
                            { accesstoken: accessToken }
                    }
                )

            if (response.data.success) {
                setCartItems({})
                navigate('/orders')
            } else {
                navigate('/cart')
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
    }

    useEffect(() => {
        verifyPayment()
    }, [accessToken])

    return (
        <div>Verify</div>
    )
}

export default Verify