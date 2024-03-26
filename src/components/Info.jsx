import React from 'react'
import AppContext from '../context'

const Info = ({ image, title, description }) => {
    const { setCartOpened } = React.useContext(AppContext)
    return (
        <div className='cartEmpty d-flex align-center justify-center flex-column flex'>
            <img
                className='mb-20'
                width={'120px'}
                src={image}
                alt="Empty"
            />

            <h2>{title}</h2>
            <p className='opacity-6'>{description}</p>
            <button onClick={() => setCartOpened(false)} className='greenButton d-flex justify-center align-center'>
                <img className='mr-10' src="/img/arrow.svg" alt="Arrow" />
                Повернутися назад
            </button>
        </div>
    )
}

export default Info
