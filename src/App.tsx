import React, { useEffect, useReducer, useState } from "react"
import "./App.css"
import apiKey from './apiKey' // Import the API key from a separate file

const initialState = {
  loading: true,
  error: "",
  data: null,
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" }
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload }
    case "FETCH_FAILURE":
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const WeatherForecastApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("London")
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const fetchWeatherData = async () => {
      dispatch({ type: "FETCH_REQUEST" })

      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${searchQuery}`
        )
        const data = await response.json()

        dispatch({ type: "FETCH_SUCCESS", payload: data })
      } catch (error: any) {
        dispatch({ type: "FETCH_FAILURE", payload: error.message })
      }
    }

    fetchWeatherData().then( () => setSearchQuery(""))

  }, [])

  if (state.loading) {
    return <div>Loading...</div>
  }

  if (state.error) {
    return <div>Error: {state.error}</div>
  }

  if (!state.data) {
    return null
  }

  const { location, current } = state.data

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSearchSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    try {
      const apiKey = "4e4bf418e2334a34b2b44613231206"
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${searchQuery}`
      )

      if (response.ok) {
        const data = await response.json()
        dispatch({ type: "FETCH_SUCCESS", payload: data })
      } else {
        throw new Error("Failed to fetch weather data")
      }
    } catch (error: any) {
      dispatch({ type: "FETCH_FAILURE", payload: error.message })
    }
    setSearchQuery(searchQuery)
    setSearchQuery("")
  }

  return (
    <div className="App">
      <h1>Weather Forecast</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Enter location"
        />
        <button
            type="submit"
            className={`search-button ${!searchQuery ? 'disabled' : ''}`}
            disabled={!searchQuery}
        >
          Search
        </button>
      </form>
      {current && (
        <div className="weather-data">
          <img
            className="weather-icon"
            src={current.condition.icon}
            alt={current.condition.text}
          />
          <div className="weather-description">
            <p>Location: {location.name}</p>
            <p>
              <span className="icon">🌡️</span>Temperature: {current.temp_f}°F
            </p>
            <p>
              <span className="icon">💧</span>Humidity: {current.humidity}%
            </p>
            <p>
              <span className="icon">💨</span>Wind Speed: {current.wind_kph}{" "}
              km/h
            </p>
            <p>
              <span className="icon">☁️</span>Conditions:{" "}
              {current.condition.text}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherForecastApp
