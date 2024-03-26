import { useContext } from "react"
import Card from "../components/Card/Card"
import AppContext from "../context"

function Home({
    items,
    cartItems,
    searchValue,
    setSearchValue,
    onChangeSearchInput,
    onAddToFavorite,
    onAddToCart,
    isLoading,
}) {

    const renderItems = () => {
        const filteredItems = items.filter(item =>
            item.title.toLowerCase().includes(searchValue.toLocaleLowerCase()))
        return (
            (isLoading ? [...Array(8)] : filteredItems).map((item, index) => (
                <Card
                    key={index}
                    onFavorite={(obj) => onAddToFavorite(obj)}
                    onPlus={(obj) => onAddToCart(obj)}
                    loading={isLoading}
                    {...item}
                />
            ))
        )
    }
    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>{searchValue ? `Пошук по запиту: "${searchValue}"` : "Всі товари"}</h1>
                <div className="search-block d-flex">
                    <img src="/img/search.svg" alt="Search" />
                    {searchValue && (
                        <img
                            onClick={() => setSearchValue('')}
                            className="clear removeBtn"
                            src="/img/btn-remove.svg"
                            alt="clear"
                        />
                    )}
                    <input onChange={onChangeSearchInput} value={searchValue} placeholder="Пошук ..." />
                </div>
            </div>

            <div className="d-flex flex-wrap">{renderItems()}</div>
        </div>
    )
}

export default Home