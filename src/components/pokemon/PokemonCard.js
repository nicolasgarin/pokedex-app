import React, { Component } from "react";
import styled from "styled-components";
import spinner from "../pokemon/4xjS.gif";
import {Link} from "react-router-dom";


const Sprite = styled.img`
max-height: 7em;
width: auto;
`;

const Card = styled.div`
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

const StyledLink = styled(Link)`
    text-decoration: none;
    color: black;
    &: focus;
    &: hover;
    &: visited;
    &: link;
    &: active{
        text-decoration: none;
    };
`

export default class PokemonCard extends Component {
state = {
    name: "",
    imageUrl: "",
    pokemonIndex: "",
    imageLoading: true,
    tooManyRequests: false
}

componentDidMount() {
    const { name, url } = this.props;
    const pokemonIndex = url.split("/")[url.split("/").length - 2];
    const imageUrl = `https://projectpokemon.org/images/normal-sprite/${name == "mr-mime" ? (name.split("-").join(".")) : (name.split("-").join("_"))}.gif`;

    this.setState({ 
        name, 
        imageUrl, 
        pokemonIndex,
    })
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

    render() {

        return (
            <div className="col-lg-3 col-md-6 col-sm-6 mb-5">
                <StyledLink to={`pokemon/${this.state.pokemonIndex}`}>
                <Card className="card">
                    <h5 className="card-header">#{this.pokenum()}{this.state.pokemonIndex}
                    </h5>
                    {this.state.imageLoading ? (
                        <div className="d-flex justify-content-center"><img src={spinner} style={{width: "auto", height: "4em", position: "absolute"}} className="contenedor card-img-top rounded mx-auto d-block mt-2"></img></div>
                    ) : null}
                    <div className="contenedor d-flex align-items-end">
                    <Sprite className="card-img-top rounded mx-auto mt-2"
                    onLoad={() => this.setState({imageLoading: false})}
                    onError={() => this.setState({tooManyRequests: true})}
                    src={this.state.imageUrl}
                    style={
                        this.state.imageLoading ? {display: "none"} : { display: "block"}
                    }
                    >
                    </Sprite>
                    </div>
                    <div className="card-body mx-auto">
                        <div className="card-title">
                            <h6>
                            {this.state.name
                            .split("-")
                            .map(
                                letter => letter.charAt(0).toUpperCase() + letter.substring(1)
                                )
                            .join(" ")}
                            </h6>
                        </div>
                    </div>
                </Card>
                </StyledLink>
            </div>
        )
    }
}
