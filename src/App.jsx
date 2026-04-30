import React, { useState } from 'react'
import Search from './components/Search'

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <main>
            <di className = "pattern"/>
            <div className = "wrapper">
                <header>
                    <img src= "./hero.png"/>
                    <h1>
                        Find <span className = "text-gradient">Movies</span> You'll Enjoy
                    </h1>
                </header>
                <p>
                    <Search searchTerm = {searchTerm} setSearchTerm = {setSearchTerm} />
                    <br></br>
                    <h1 className="text-white">{searchTerm} </h1>
                </p>
            </div>
        </main>
  )
}

export default App