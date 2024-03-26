import React from 'react'
import styles from './Card.module.scss'
import ContentLoader from "react-content-loader"
import AppContext from '../../context'

function Card({
    id,
    imageUrl,
    title,
    price,
    onPlus,
    onFavorite,
    favorited = false,
    loading = false,
}) {

    const [isFavorite, setIsFavorite] = React.useState(favorited)
    const { isItemsAdded } = React.useContext(AppContext)
    const itemObj = { id, parentId: id, title, imageUrl, price }

    const onClickPlus = () => {
        onPlus(itemObj)
    }

    const onClickFavorite = () => {
        onFavorite(itemObj)
        setIsFavorite(!isFavorite)
    }

    return (
        <div className={styles.card}>
            {loading ?
                (<ContentLoader
                    speed={2}
                    width={155}
                    height={250}
                    viewBox="0 0 150 200"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                >
                    <rect x="0" y="0" rx="10" ry="10" width="150" height="90" />
                    <rect x="0" y="100" rx="5" ry="5" width="150" height="15" />
                    <rect x="0" y="125" rx="5" ry="5" width="100" height="15" />
                    <rect x="0" y="170" rx="5" ry="5" width="80" height="25" />
                    <rect x="115" y="165" rx="5" ry="5" width="33" height="33" />
                </ContentLoader>
                ) : (
                    <>
                        {onFavorite && (
                            <div className={styles.favorite}>
                                <img src={isFavorite ? "/img/liked.svg" : "/img/unliked.svg"} onClick={onClickFavorite} />
                            </div>
                        )}
                        <img width={"100%"} height={'135'} src={imageUrl} />
                        <h5>{title}</h5>
                        <div className="d-flex justify-between align-center">
                            <div className="d-flex flex-column">
                                <span>Ціна:</span>
                                <b>{price} грн.</b>
                            </div>
                            {onPlus && (
                                <img
                                    className={styles.plus}
                                    src={isItemsAdded(id) ? "/img/btn-checked.svg" : "/img/btn-plus.svg"}
                                    onClick={onClickPlus} />
                            )}

                        </div>
                    </>)
            }
        </div>
    )
}

export default Card