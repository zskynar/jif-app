import React, { Component } from 'react';
import Gif from './Gif'
import loader from './images/loader.svg'
import clearButton from './images/close-icon.svg'

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length)
  return arr[randIndex]
}

const Header = ({clearSearch, hasResults}) => (
  <div className='header grid'>
      {hasResults ? (
        <button onClick={clearSearch}>
            <img src={clearButton} />
        </button>
      ) : (
        <h1 className='title' onClick={clearSearch}>Jiffy</h1>
      )}
    
  </div>
)

const UserHint = ({loading, hintText}) => (
  <div className='user-hint'>
    {loading ? <img src={loader} className='block mx-auto' /> : hintText}
  </div>
)


class App extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      searchTerm: '',
      hintText: '',
      gifs: []
    }
  }

  // search giphy using fetch and put search term into URL 

  searchGiphy = async searchTerm => {
    try {
      this.setState({
        loading: true
      })

      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=w4qXduHaSqvxgf13ogtu23wNBWWXAhfy&q=${searchTerm}&limit=25&offset=0&rating=Y&lang=en`)
      const {data} = await response.json()

      // Check if arr of results is empty and throw error
      if (!data.length) {
        throw `Nothing found for ${searchTerm}`
      }

      const randomGif = randomChoice(data)

      this.setState((prevState, props) => ({
        ...prevState, 
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }))

    } catch (error) {
        this.setState((prevState, props) => ({
          ...prevState,
          hintText: error, 
          loading: false
        }))
    }
  }

  handleChange = event =>  {
    const value = event.target.value
    this.setState((prevState, props) => ({
      ...prevState, 
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }))
  }

  // when we have 2 or more chars in our box 
  // and we also press enter, we want to run a search

  handleKeyPress = event => {
    const value = event.target.value

    if (value.length > 2 && event.key === 'Enter') {
      this.searchGiphy(value)
    }
  }

  // here we reset state by clearing values

  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }))
    this.textInput.focus()
  }

  render() {
    const {searchTerm, gifs} = this.state
    const hasResults = gifs.length

    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults}/>
        <div className='search grid'>

            {this.state.gifs.map((gif, i) => (
                <Gif key={i} {...gif}/> 
            ))}

            <input 
              className='input grid-item' 
              placeholder='Type Something' 
              onKeyPress={this.handleKeyPress} 
              onChange={this.handleChange} 
              value={searchTerm}
              ref={input => {
                this.textInput = input
              }}
            />
        </div>
        <UserHint {...this.state}/>
      </div>
    );
  }
}

export default App;
