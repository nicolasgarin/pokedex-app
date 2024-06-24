import React, { Component } from 'react';
import axios from 'axios';

import PokemonCard from './PokemonCard'

export default class Pokemonlist extends Component {
    state = {
        url: 'https://pokeapi.co/api/v2/pokemon?limit=151', 
        pokemon: null
    };

    async componentDidMount() {
        const res = await axios.get(this.state.url);
        this.setState({ pokemon: res.data['results'] });
     }

    render() {
        return (
            <React.Fragment>
            {this.state.pokemon ? (
                <div className="row">
                {this.state.pokemon.map(pokemon => (
                    <PokemonCard 
                    key={pokemon.name}
                    name= {pokemon.name}
                    url= {pokemon.url}
                    />
                ))}
            </div>

            ) : (
                <div className="row align-items-center" style={{height:"33em"}}>
                <h1 style={{textAlign:"center",color: "#ef5350", textShadow: "1px 1px 1px black, 0 0 1em black, 0 0 0.2em white", fontWeight:"bold"}}>
                    Loading Pokemon
                </h1>
                </div>
            )}
            </React.Fragment>
        )
    }
}