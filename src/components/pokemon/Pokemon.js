import React, { Component } from "react";
import axios from "axios";
import spinner from "../pokemon/4xjS.gif";
import spinner2 from "../pokemon/pokeball2.gif"
import Tab from "../layout/Tabs";
import arrow from "../layout/arrow1b.png";
import styled from "styled-components";

const Move = styled.div`
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
&:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}
-moz-user-select: none;
-website-user-select: none;
user-select: none;
-o-user-select: none;
`;


const TYPE_COLORS = {
    bug: "B1C12E",
    dark: "4F3A2D",
    dragon: "755EDF",
    electric: "FCBC17",
    fairy: "F4B1F4",
    fighting: "823551",
    fire: "E73B0C",
    flying: "A3B3F7",
    ghost: "6060B2",
    grass: "74C236",
    ground: "D3B357",
    ice: "A3E7FD",
    normal: "b0aca5",
    poison: "934594",
    psychic: "ED4882",
    rock: "B9A156",
    steel: "B5B5C3",
    water: "3295F6"
}

const CARD_COLORS = {
    bug: "e5f562",
    dark: "b09686",
    dragon: "b6a7fc",
    electric: "ffda7a",
    fairy: "f7daf7",
    fighting: "a6677e",
    fire: "fa7855",
    flying: "c8d1f7",
    ghost: "8b8bb0",
    grass: "96c472",
    ground: "d9c489",
    ice: "d7f1fa",
    normal: "dedddc",
    poison: "ad87ad",
    psychic: "fa8cb3",
    rock: "c4b482",
    steel: "d7d7de",
    water: "81bffc"
}

const DARK_COLORS = {
    bug: "7f8c15",
    dark: "2b2018",
    dragon: "46368f",
    electric: "c79208",
    fairy: "bf8ebf",
    fighting: "4f1c2f",
    fire: "ab310f",
    flying: "8995c7",
    ghost: "414178",
    grass: "4c8024",
    ground: "a18947",
    ice: "#8fb4bf",
    normal: "969592",
    poison: "5e2c5e",
    psychic: "b03862",
    rock: "736436",
    steel: "7a7a85",
    water: "2365a6"
}

export default class Pokemon extends Component {
    state = {
        name: "",
        pokemonIndex: "",
        imageUrl: "",
        types: [],
        description: "",
        stats: {
            hp: "",
            attack: "",
            defense: "",
            speed: "",
            specialAttak: "",
            specialDefense: ""
        },
        height: "",
        weight: "",
        eggGroup: "",
        abilities: "",
        genderRatioMale: "",
        genderRatioFemale: "",
        evs: "",
        hatchSteps: "",
        imageLoading: true,
        dataLoaded: false,
        cardColor: "",
        evoChain: [],
        evoChainUrl: "",
        evo1: "",
        evo2: "",
        evo3: "",
        evo1index: "",
        evo2index: "",
        evo3index: "",
        pokemonMovesUrl: [],
        pokemonMovesData: []
    }

    async componentDidMount() {
        const { pokemonIndex } = this.props.match.params;

        //Urls para información de pokemones
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

        //GET información pokemon
        const pokemonRes = await axios.get(pokemonUrl);
        
        const name = pokemonRes.data.name
        .toLowerCase()
            .split("-")
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonIndex}.png`;
        const frontSprite = pokemonRes.data.sprites.front_default;
        const backSprite = pokemonRes.data.sprites.back_default;
        const frontShiny = pokemonRes.data.sprites.front_shiny;
        const backShiny = pokemonRes.data.sprites.back_shiny;

        let { hp, attack, defense, speed, specialAttack, specialDefense } = "";

        //Traemos del JSON los datos que vamos a usar
        pokemonRes.data.stats.map(stat => {
            switch(stat.stat.name) {
                case "hp":
                    hp = stat["base_stat"];
                    break;
                case "attack":
                    attack = stat["base_stat"];
                    break;
                case "defense":
                    defense = stat["base_stat"];
                    break;
                case "speed":
                    speed = stat["base_stat"];
                    break;
                case "special-attack":
                    specialAttack = stat["base_stat"];
                    break;
                case "special-defense":
                    specialDefense = stat["base_stat"];
                    break;
            } 
        });
        //convertimos a cmetros la altura
        const height = (pokemonRes.data.height * 10) * 0.01;
        //convertimos a kilos el peso
        const weight = pokemonRes.data.weight * 0.1;

        const types = pokemonRes.data.types.map(type => type.type.name);

        const abilities = pokemonRes.data.abilities.map(ability => {
            return ability.ability.name
            .toLowerCase()
            .split("-")
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ") + " ";
        });

        const evs = pokemonRes.data.stats.filter(stat => {
            if(stat.effort > 0) {
                return true;
            }
            return false;
        }).map(stat => {
            return `${stat.effort} ${stat.stat.name
                .toLowerCase()
                .split("-")
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(" ")
    }`
        })
        .join(", ");

        const cardColor = pokemonRes.data.types[0].type.name;

        const pokemonMovesUrl = pokemonRes.data.moves.map(move =>move.move.url);
        

        //Get descripción Pokemon, catchrate, eggGroup, Gender ratio, Hatch steps
        await axios.get(pokemonSpeciesUrl)
        .then(res => {
            let description = "";
            res.data.flavor_text_entries.some(flavor => {
                if (flavor.language.name === "en") {
                    description = flavor.flavor_text;
                    return;
                }
            });

            const femaleRate = res.data["gender_rate"];
            const genderRatioFemale = 12.5 * femaleRate;
            const genderRatioMale = 100 - genderRatioFemale;

            const catchRate = Math.round((100/255) * res.data["capture_rate"]);

            const eggGroups = res.data["egg_groups"].map(group => {
                return group.name
                .toLowerCase()
                .split("-")
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(" ")
            }).join(", ");

            const hatchSteps = 255 * (res.data["hatch_counter"] + 1)

            //Get de la cadena de evolución del pokemon
            const evoChainUrl = res.data["evolution_chain"].url;

            this.setState({
                description,
                genderRatioFemale,
                genderRatioMale,
                catchRate,
                eggGroups,
                hatchSteps,
                evoChainUrl
            })
        })

        await axios.get(this.state.evoChainUrl)
        .then(res => {
            let evoData = res.data["chain"];
            let evoChain = []
            if (evoData.evolves_to.length == []) {
               evoChain = []
            } else {
                do {
                    var evoDetails = evoData["evolution_details"][0];

                    evoChain.push({
                        "species_name": evoData.species.name,
                        "min_level": !evoDetails ? 1 : evoDetails.min_level,
                        "trigger_name": !evoDetails ? null : evoDetails.trigger.name,
                        "item": !evoDetails ? null : evoDetails.item,
                        "held_item": !evoDetails ? null : evoDetails.held_item
                    });

                    evoData = evoData["evolves_to"][0];
                } while (!!evoData && evoData.hasOwnProperty('evolves_to'))
            };

            this.setState({
                evoChain
            })
        })

        if (this.state.evoChain[0] && !this.state.evoChain[2]) {
            const evo1 = this.state.evoChain[0].species_name;
            const evo2 = this.state.evoChain[1].species_name;

            this.setState({evo1, evo2})
        } else if (this.state.evoChain[2]) {
            const evo1 = this.state.evoChain[0].species_name;
            const evo2 = this.state.evoChain[1].species_name;
            const evo3 = this.state.evoChain[2].species_name;

            this.setState({evo1, evo2, evo3})
        }

        if (this.state.evoChain[0] && !this.state.evoChain[2]) {
            await axios.get(`https://pokeapi.co/api/v2/pokemon/${this.state.evo1}/`)
            .then(res => {
                const evo1index = res.data.id;

                this.setState({
                    evo1index
                })
            })
            await axios.get(`https://pokeapi.co/api/v2/pokemon/${this.state.evo2}/`)
            .then(res => {
                const evo2index = res.data.id;

                this.setState({
                    evo2index
                })
            })
        } else if (this.state.evoChain[2]) {
            await axios.get(`https://pokeapi.co/api/v2/pokemon/${this.state.evo1}/`)
            .then(res => {
                const evo1index = res.data.id;

                this.setState({
                    evo1index
                })
            })
            await axios.get(`https://pokeapi.co/api/v2/pokemon/${this.state.evo2}/`)
            .then(res => {
                const evo2index = res.data.id;

                this.setState({
                    evo2index
                })
            })
            await axios.get(`https://pokeapi.co/api/v2/pokemon/${this.state.evo3}/`)
            .then(res => {
                const evo3index = res.data.id;

                this.setState({
                    evo3index
                })
            })
        }
        this.setState({
            imageUrl,
            frontSprite,
            backSprite,
            frontShiny,
            backShiny,
            pokemonIndex,
            name,
            types,
            stats :{
                hp,
                attack,
                defense,
                speed,
                specialAttack,
                specialDefense
            },
            height,
            weight,
            abilities,
            evs,
            dataLoaded: true,
            cardColor,
            pokemonMovesUrl,
            sprite1Loading: true,
            sprite2Loading: true,
            sprite3Loading: true,
            sprite4Loading: true,
        })
        const pokemonMovesData = [];
        for (let move of pokemonMovesUrl) {
            await axios.get(move)
            .then(res => {
                pokemonMovesData.push({
                    "name": res.data.name,
                    "type": res.data.type.name,
                    "pp": res.data.pp,
                    "power": res.data.power
                })
            })
        }
        this.setState({pokemonMovesData})

    }

    pokenum() {
        if (this.state.pokemonIndex < 10) {
            return("00");
        } else if (this.state.pokemonIndex < 100) {
            return("0") ;
        } else {
            return("");
        }
    }
    
// Funciones para mostrar la familia de evoluciones del Pokemon
    showEvolutions() {
        if (!this.state.evoChain[0]) {
            return(
            <div className="row align-items-center"
            style={{height:"11em"}}>
            <h3
            style={{
                textAlign: "center",
                fontWeight: "bold"
            }}>This pokemon has no evolutions</h3>
            </div>
            );
     } else if (!this.state.evoChain[2]) {
         let img1 = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.state.evo1index}.png`;
         let img2 = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.state.evo2index}.png`;
        return (
            <div className="row justify-content-center align-items-center letter">
                <div className="col-2 d-flex justify-content-around">
                <picture className="glow">
                    <img src={img1} className="evos"></img>
                    {this.state.evo1.split("-")
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ")}
                </picture>
                </div>
                <div className="col-2">
                <picture>
                    <img src={arrow} className="arrow"></img>
                    {this.showEvoTrigger(1)}
                </picture>
                </div>
                <div className="col-2 d-flex justify-content-around">
                <picture className="glow">
                    <img src={img2} className="evos"></img>
                    {this.state.evo2.split("-")
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ")}
                </picture>
                </div>
            </div>
        )
            } else if (this.state.evoChain[2]) {
         let img1 = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.state.evo1index}.png`;
         let img2 = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.state.evo2index}.png`;
         let img3 = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.state.evo3index}.png`;

                return (
            <div className="row justify-content-center align-items-center letter">
                <div className="col-2 d-flex justify-content-around">
                <picture className="glow">
                    <img src={img1} className="evos"></img>
                    {this.state.evo1.split("-")
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ")}
                </picture>
                </div>
                <div className="col-2">
                <picture>
                    <img src={arrow} className="arrow"></img>
                    {this.showEvoTrigger(1)}
                </picture>
                </div>
                <div className="col-2 d-flex justify-content-around">
                <picture className="glow">
                    <img src={img2} className="evos"></img>
                    {this.state.evo2.split("-")
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ")}
                </picture>
                </div>
                <div className="col-2">
                <picture>
                    <img src={arrow} className="arrow"></img>
                    {this.showEvoTrigger(2)}
                </picture>
                </div>
                <div className="col-2 d-flex justify-content-around">
                <picture className="glow">
                    <img src={img3} className="evos"></img>
                    {this.state.evo3.split("-")
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ")}
                </picture>
                </div>
            </div>
                )
            }
    }

    showEvoTrigger (i) {
        if (this.state.evoChain[i].trigger_name == "level-up") {
            return (
               <div>
                   <br></br>
                {this.state.evoChain[i].min_level ? `Level ${this.state.evoChain[i].min_level}` : "Happiness"}
                </div>
            )
        } else if (this.state.evoChain[i].trigger_name == "trade") {
            return (
                <div>
                    {!this.state.evoChain[i].held_item ? <br></br> : null}
                    Pokemon Trade
                    {this.state.evoChain[i].held_item ? this.heldItem(i) : null}
                </div>
            )
        } else if (this.state.evoChain[i].trigger_name == "use-item") {
            return (
                <div>
                    <picture>
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${this.state.evoChain[i].item.name}.png`} className="icon"></img>
                        {this.state.evoChain[i].item.name
                    .split("-")
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ")}
                    </picture>

                </div>
            )
        }
    }

    heldItem(i) {
        return (
            <picture>
                +
                <picture>
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${this.state.evoChain[i].held_item.name}.png`} className="icon"></img>
                    {this.state.evoChain[i].held_item.name
                    .split("-")
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ")}
                </picture>
            </picture>
        )
    }

    // Funciones para mostrar los movimientos del Pokemon
    showMoves() {
        for (let move of this.state.pokemonMovesData) {
            return (
                <div>
                {this.state.pokemonMovesData.map(move => (
                    <div className="col-2 float-start d-flex justify-content-center my-2">
                        <Move key={move}
                        className="badge badge-primary badge-pill mx-1"
                        style={{
                            backgroundColor: `#${TYPE_COLORS[move.type]}`,
                            fontWeight: "bold",
                            width: "13em",
                            color: "white"}}>
                        <h6>{move.name                                        
                            .toLowerCase()
                            .split("-")
                            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                            .join(" ")}</h6>
                        <span className="float-start"> Pp: {move.pp}</span>
                        <span className="float-end">{move.power ? `Power: ${move.power}` : null}</span>
                        </Move>
                    </div>
                ))}
                </div>
            )
        }
    }

    // Funciones para mostrar los sprites del Pokemon
    showSprites() {
        return(
            <div className="row letter">
            <div className="col-3 d-flex justify-content-center">
                <picture className="glow">
                <div className="img-container-dark">
                {this.state.sprite1Loading ? (
                        <img src={spinner2} style={{width: "8em", height: "8em"}} className="card-img-top rounded mx-auto d-block mt-2"></img>
                        ) : null}
                <img 
                onLoad={() => this.setState({sprite1Loading: false})} 
                className="evosspr flipimage" 
                src={this.state.frontSprite}
                style={
                    this.state.sprite1Loading ? {display: "none"} : { display: "block"}
                }></img>
                </div>
                Front
                </picture>
            </div>
            <div className="col-3 d-flex justify-content-center">
                <picture className="glow">
                <div className="img-container-dark">
                {this.state.sprite2Loading ? (
                        <img src={spinner2} style={{width: "8em", height: "8em"}} className="card-img-top rounded mx-auto d-block mt-2"></img>
                        ) : null}
                <img 
                onLoad={() => this.setState({sprite2Loading: false})} 
                className="evosspr" 
                src={this.state.backSprite}
                style={
                    this.state.sprite2Loading ? {display: "none"} : { display: "block"}
                }></img>
                </div>
                Back
                </picture>
            </div>
            <div className="col-3 d-flex justify-content-center">
                <picture className="glow">
                <div className="img-container-dark">
                {this.state.sprite3Loading ? (
                        <img src={spinner2} style={{width: "8em", height: "8em"}} className="card-img-top rounded mx-auto d-block mt-2"></img>
                        ) : null}
                <img 
                onLoad={() => this.setState({sprite3Loading: false})} 
                className="evosspr" 
                src={this.state.frontShiny}
                style={
                    this.state.sprite3Loading ? {display: "none"} : { display: "block"}
                }></img>
                </div>
                Front Shiny
                </picture>
            </div>
            <div className="col-3 d-flex justify-content-center">
                <picture className="glow">
                <div className="img-container-dark">
                {this.state.sprite4Loading ? (
                        <img src={spinner2} style={{width: "8em", height: "8em"}} className="card-img-top rounded mx-auto d-block mt-2"></img>
                        ) : null}
                <img 
                onLoad={() => this.setState({sprite4Loading: false})} 
                className="evosspr flipimage" 
                src={this.state.backShiny}
                style={
                    this.state.sprite4Loading ? {display: "none"} : { display: "block"}
                }></img>
                </div>
                Back Shiny
                </picture>
            </div>
            </div>
        )
    }


    render() {
        return (
            <div className="col">
               <div className="card"
               style={{
                   backgroundColor: `#${CARD_COLORS[this.state.cardColor]}`
                }}
               >
                    <div className="card-header">
                        <div className="row">
                            <div className="col-8" style={{height:"25px"}}>
                            {this.state.dataLoaded ? (
                                <h4
                                style={{
                                    color: `#${DARK_COLORS[this.state.cardColor]}`,
                                    fontWeight: "bold"
                                }}>#{this.pokenum()}{this.state.pokemonIndex}</h4>
                                ) : null} 
                            </div>
                            <div className="col-4">
                                <div className="float-end">
                                    {this.state.types.map(type => (
                                        <span key={type}
                                        className="badge badge-primary badge-pill mx-1"
                                        style={{backgroundColor: `#${TYPE_COLORS[type]}`}}                                         
                                        >
                                        {type
                                        .toLowerCase()
                                        .split("-")
                                        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                        .join(" ")}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="card-body">
                    <div className="row align-items-center" style={{height:"17em"}}>
                        <div className="col-md-3">

                        {this.state.imageLoading ? (
                        <img src={spinner} style={{width: "6em", height: "6em"}} className="card-img-top rounded mx-auto d-block mt-2"></img>
                        ) : null}
                            <div className="img-container">
                            <img 
                            onLoad={() => this.setState({imageLoading: false})}
                            src={this.state.imageUrl}
                            className="card-img-top rounded mx-auto mt-2"
                            style={
                                this.state.imageLoading ? null : { display: "block"}
                            }
                            ></img>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="container">
                            {this.state.dataLoaded ? (
                            <div>
                            <h2 className="mx-auto"
                            style={{
                                color: `#${DARK_COLORS[this.state.cardColor]}`,
                                textAlign: "center",
                                fontWeight: "bold"
                            }}>{this.state.name}</h2>
                            <br></br>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-3"
                                style={{
                                    color: `#${DARK_COLORS[this.state.cardColor]}`,
                                    textAlign: "end",
                                    fontWeight: "bold"
                                }}>
                                    HP
                                </div>
                                <div className="col-12 col-md-9">
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressBar"
                                        style={{
                                            width: `${this.state.stats.hp}%`,
                                            backgroundColor: `#${DARK_COLORS[this.state.cardColor]}`
                                        }}
                                        aria-valuenow= "25"
                                        aria-valuemin= "0"
                                        aria-valuemax= "100"
                                        >
                                        <small className="letter">{this.state.stats.hp}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-3"
                                style={{
                                    color: `#${DARK_COLORS[this.state.cardColor]}`,
                                    textAlign: "end",
                                    fontWeight: "bold"
                                }}>
                                    Attack
                                </div>
                                <div className="col-12 col-md-9">
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressBar"
                                        style={{
                                            width: `${this.state.stats.attack}%`,
                                            backgroundColor: `#${DARK_COLORS[this.state.cardColor]}`
                                        }}
                                        aria-valuenow= "25"
                                        aria-valuemin= "0"
                                        aria-valuemax= "100"
                                        >
                                        <small className="letter">{this.state.stats.attack}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-3"
                                style={{
                                    color: `#${DARK_COLORS[this.state.cardColor]}`,
                                    textAlign: "end",
                                    fontWeight: "bold"
                                }}>
                                    Defense
                                </div>
                                <div className="col-12 col-md-9">
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressBar"
                                        style={{
                                            width: `${this.state.stats.defense}%`,
                                            backgroundColor: `#${DARK_COLORS[this.state.cardColor]}`
                                        }}
                                        aria-valuenow= "25"
                                        aria-valuemin= "0"
                                        aria-valuemax= "100"
                                        >
                                        <small className="letter">{this.state.stats.defense}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-3"
                                style={{
                                    color: `#${DARK_COLORS[this.state.cardColor]}`,
                                    textAlign: "end",
                                    fontWeight: "bold"
                                }}>
                                    Speed
                                </div>
                                <div className="col-12 col-md-9">
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressBar"
                                        style={{
                                            width: `${this.state.stats.speed}%`,
                                            backgroundColor: `#${DARK_COLORS[this.state.cardColor]}`
                                        }}
                                        aria-valuenow= "25"
                                        aria-valuemin= "0"
                                        aria-valuemax= "100"
                                        >
                                        <small className="letter">{this.state.stats.speed}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-3"
                                style={{
                                    color: `#${DARK_COLORS[this.state.cardColor]}`,
                                    textAlign: "end",
                                    fontWeight: "bold"
                                }}>
                                    Special Attack
                                </div>
                                <div className="col-12 col-md-9">
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressBar"
                                        style={{
                                            width: `${this.state.stats.specialAttack}%`,
                                            backgroundColor: `#${DARK_COLORS[this.state.cardColor]}`
                                        }}
                                        aria-valuenow= "25"
                                        aria-valuemin= "0"
                                        aria-valuemax= "100"
                                        >
                                        <small className="letter">{this.state.stats.specialAttack}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-3"
                                style={{
                                    color: `#${DARK_COLORS[this.state.cardColor]}`,
                                    textAlign: "end",
                                    fontWeight: "bold"
                                }}>
                                    Special Defense
                                </div>
                                <div className="col-12 col-md-9">
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressBar"
                                        style={{
                                            width: `${this.state.stats.specialDefense}%`,
                                            backgroundColor: `#${DARK_COLORS[this.state.cardColor]}`
                                        }}
                                        aria-valuenow= "25"
                                        aria-valuemin= "0"
                                        aria-valuemax= "100"
                                        >
                                        <small className="letter">{this.state.stats.specialDefense}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br></br>
                            <div className="row align-items-center">
                                <div className="col">
                                <p className="p-2"
                                style={{
                                    color: `#${DARK_COLORS[this.state.cardColor]}`,
                                    textAlign: "justify",
                                    fontWeight: "bold",
                                }}>
                                    {this.state.description}
                                </p>
                                </div> 
                            </div>

                            </div>
                            ) : (<h1
                            style={{
                                textAlign: "center",
                                color: "#ef5350",
                                fontWeight: "bold"
                            }}>Loading Data</h1>)}
                            </div>
                        </div>
                    </div>
                </div>
                
                {this.state.dataLoaded ? (
                <div>
                <div className="card-body"
                style={{
                        color: `#${DARK_COLORS[this.state.cardColor]}`
                                }}>
                    <div className="row">
                        <Tab>
                            <div label= "Profile">

                            <div className="row d-flex justify-content-evenly align-items-center" style={{height:"11em"}}>
                        <div className="col-md-5">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-end letter">Height:</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="float-start letter">{this.state.height} mts</h6>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-end letter">Weight:</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="float-start letter">{this.state.weight} kg</h6>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-end letter">Catch Rate:</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="float-start letter">{this.state.catchRate} %</h6>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-end letter">Gender Ratio:</h6>
                                </div>
                                <div className="col-md-6">
                                    <div className="progress">
                                        <div className="progress-bar"
                                        role="progressbar"
                                        style={{
                                            width: `${this.state.genderRatioFemale}%`,
                                            backgroundColor: `#C2185B`
                                        }}
                                        aria-valuenow="15"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        >
                                        <small>{this.state.genderRatioFemale}</small>
                                        </div>
                                        <div className="progress-bar"
                                        role="progressbar"
                                        style={{
                                            width: `${this.state.genderRatioMale}%`,
                                            backgroundColor: `#1976D2`
                                        }}
                                        aria-valuenow="30"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        >
                                        <small>{this.state.genderRatioMale}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                       
                        <div className="col-md-5">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-end letter">Egg Groups:</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="float-start letter">{this.state.eggGroups}</h6>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-end letter">Hatch Steps:</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="float-start letter">{this.state.hatchSteps}</h6>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-end letter">Abilities:</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="float-start letter">{this.state.abilities}</h6>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-end letter">EVS:</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="float-start letter">{this.state.evs}</h6>
                                </div>
                            </div>
                        </div>
                        </div>
                        </div>
                        <div label= "Evolutions">
                            <div className="row" style={{height:"11em"}}>
                                <div className="col">
                                    {this.showEvolutions()}
                                </div>
                        </div>
                        </div>
                        
                        <div label= "Moves">
                            <div className="container">
                            <div className="row justify-content-between section" style={{height:"11em", overflow:"auto", backgroundColor:"  rgba(0, 0, 0, 0.152)"
}}>
                                {this.showMoves()}
                            </div>
                            </div>
                        </div>

                        <div label="Sprites">
                            <div className="row" style={{height:"11em"}}>
                                {this.showSprites()}
                            </div>
                        </div>
                        </Tab>
                    </div>
                </div>
                </div>
                ) : null}
                <div className="card-footer text-muted">
                    <div className="float-end link1 letter">
                        Data from <a href="https://pokeapi.co/" target="_blank" className="card-link link1">PokeAPI.co</a>
                    </div>
                </div>
               </div>

            </div>
        )
    }
}
