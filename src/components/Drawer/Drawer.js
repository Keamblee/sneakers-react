import React from "react"
import axios from "axios"


import Info from "../Info"
import { useCart } from "../../hooks/useCart"

import styles from './Drawer.module.scss'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, 1000))

function Drawer({ onClose, onRemove, items = [], opened }) {
    const {cartItems, setCartItems, totalPrice} = useCart()
    const [orderId, setOrderId] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isOrderComplete, setIsOrderComplete] = React.useState(false)

    const onClickOrder = async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.post('https://65f99517df15145246120770.mockapi.io/Orders', {
                items: cartItems
            })
            setOrderId(data.id)
            setIsOrderComplete(true)
            setCartItems([])

            for (let i = 0; i < cartItems.length; i++) {
                const item = cartItems[i]
                await axios.delete('https://65e285d5a8583365b31839e1.mockapi.io/cart/'+ item.id)
                delay(1000)
            }

        } catch (error) {
            alert('Не вдалося створити замовлення(')
        }
        setIsLoading(false)
    }

    return (
        <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
            <div className={styles.drawer}>
                <h2 className='mb-30 d-flex justify-between'>
                    Корзина
                    <img onClick={onClose} className="removeBtn cu-p" src="/img/btn-remove.svg" alt="Remove" />
                </h2>

                {items.length > 0 ? (
                    <>
                        <div className='items'>

                            {items.map((obj) => (
                                <div key={obj.id} className="cartItem d-flex align-center mb-20">
                                    <div
                                        style={{ backgroundImage: `url(${obj.imageUrl})` }}
                                        className='cartItemImg'></div>
                                    <div className="mr-20 flex">
                                        <p>{obj.title}</p>
                                        <b>{obj.price} грн</b>
                                    </div>
                                    <img onClick={() => onRemove(obj.id)} className="removeBtn" src="/img/btn-remove.svg" alt="Remove" />
                                </div>
                            ))}

                        </div>

                        <div className='cartTotalBlock'>
                            <ul>
                                <li>
                                    <span>Всього:</span>
                                    <div></div>
                                    <b>{totalPrice} грн</b>
                                </li>
                                <li>
                                    <span>Податок 5%</span>
                                    <div></div>
                                    <b>{totalPrice * 5 / 100} грн</b>
                                </li>
                            </ul>
                            <button disabled={isLoading} onClick={onClickOrder} className="greenButton">Оформити замовлення<img src="/img/arrow.svg" alt="arrow" /></button>
                        </div>
                    </>
                ) : (
                    <Info
                        title={isOrderComplete ? 'Замовлення оформлено' : 'Корзина Пуста'}
                        description={isOrderComplete ? `Ваше замовлення №${orderId} буде передано службі доставки.` : 'Додайте хочаб одну пару кросівок, щоб зробити замовлення.'}
                        image={isOrderComplete ? '/img/complete-order.jpg' : '/img/empty-cart.jpg'}
                    />
                )}

            </div>
        </div>
    )
}

export default Drawer