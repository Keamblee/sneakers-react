import React from "react";
import { Route, Routes } from "react-router-dom";
import axios from 'axios'
import Card from "./components/Card/Card";
import Drawer from "./components/Drawer/Drawer";
import Header from "./components/Header";
import AppContext from "./context";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Orders";



function App() {
  const [cartOpened, setCartOpened] = React.useState(false)
  const [items, setItems] = React.useState([])
  const [searchValue, setSearchValue] = React.useState('')
  const [favorites, setFavorites] = React.useState([])
  const [cartItems, setCartItems] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {

    async function fetchData() {
      try {
        const [cartResponse, favoriteResponse, itemsResponse] = await Promise.all([
          axios.get('https://65e285d5a8583365b31839e1.mockapi.io/cart'),
          axios.get('https://65f99517df15145246120770.mockapi.io/Favorites'),
          axios.get('https://65e285d5a8583365b31839e1.mockapi.io/items'),
        ])

        setIsLoading(false)
        setCartItems(cartResponse.data);
        setFavorites(favoriteResponse.data)
        setItems(itemsResponse.data)
      } catch (error) {
        alert('Помилка запросу данних')
      }
    }

    fetchData();
  }, [])

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find(cartObj => Number(cartObj.parentId) === Number(obj.id))
      if (findItem) {
        setCartItems(prev => prev.filter(item => Number(item.parentId) !== Number(obj.id)))
        await axios.delete(`https://65e285d5a8583365b31839e1.mockapi.io/cart/${findItem.id}`)
      } else {
        
        setCartItems(prev => [...prev, obj])
        const { data } = await axios.post('https://65e285d5a8583365b31839e1.mockapi.io/cart', obj);
        setCartItems(prev => prev.map(item => {
          if (item.parentId === data.parentId) {
            return {
              ...item,
              id: data.id
            }
          }
          return item
        }))
      }

    } catch (error) {
      alert('Помилка при добавлені в корзину')
    }

  }

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find(favObj => favObj.id === obj.id)) {
        axios.delete(`https://65f99517df15145246120770.mockapi.io/Favorites/${obj.id}`);
        setFavorites(prev => prev.filter(item => item.id !== obj.id))
      } else {
        const { data } = await axios.post('https://65f99517df15145246120770.mockapi.io/Favorites', obj);
        setFavorites(prev => [...prev, data])
      }
    } catch (error) {
      alert("Не вдалося добавити в закладки!!!")
    }


  }

  const onRemoveItem = (id) => {
    try {
      setCartItems(prev => prev.filter(item => Number(item.id) !== Number(id)))
      axios.delete(`https://65e285d5a8583365b31839e1.mockapi.io/cart/${id}`);
    } catch (error) {
      alert('Помилка при видалені з корзини')
    }
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value)
  }

  const isItemsAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id))
  }

  return (
    <AppContext.Provider value={{
      items,
      cartItems,
      favorites,
      isItemsAdded,
      onAddToFavorite,
      onAddToCart,
      setCartOpened,
      setCartItems
    }}>
      <div className="wrapper clear">
        <div>
          <Drawer
            items={cartItems}
            onClose={() => setCartOpened(false)}
            onRemove={onRemoveItem}
            opened={cartOpened}
          />
        </div>


        <Header onClickCart={() => setCartOpened(true)} />

        <Routes>
          <Route
            exact path="/"
            element={<Home
              items={items}
              cartItems={cartItems}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onChangeSearchInput={onChangeSearchInput}
              onAddToFavorite={onAddToFavorite}
              onAddToCart={onAddToCart}
              isLoading={isLoading}
            />}
          />
          <Route
            exact path="/favorites"
            element={<Favorites />}
          />
          <Route
            path="/orders"
            element={<Orders />}
          />
        </Routes>

      </div>
    </AppContext.Provider>
  );
}

export default App; 
