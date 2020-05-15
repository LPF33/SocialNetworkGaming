import React from "react";
import axios from "../axios.js";

export default class Games extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            previosGameId:"",
            nextGameId:"",
            searchPreviousGameId:"",
            searchNextGameId:"",
            firstGame:"",
            secondGame:"",
            thirdGame:"" ,
            showDescription1: false,
            showDescription2: false,
            showDescription3: false,  
        };
    }    

    componentDidMount(){
        axios.get(`/games/3`).then(response => {
            this.setState({previosGameId:response.data.games[1].previousgame});
            this.setState({nextGameId:response.data.games[1].nextgame});
            this.setState({firstGame:response.data.games[0]});
            this.setState({secondGame:response.data.games[1]});
            this.setState({thirdGame:response.data.games[2]});
            this.setState({searchPreviousGameId:response.data.games[0].id});    
            this.setState({searchNextGameId:response.data.games[2].id});          
        });
    }

    getGames(gameId){
        axios.get(`/games/${gameId}`)
            .then(response => {
                this.setState({previosGameId:response.data.games[1].previousgame});
                this.setState({nextGameId:response.data.games[1].nextgame});
                this.setState({firstGame:response.data.games[0]});
                this.setState({secondGame:response.data.games[1]});
                this.setState({thirdGame:response.data.games[2]});
                this.setState({searchPreviousGameId:response.data.games[0].id});    
                this.setState({searchNextGameId:response.data.games[2].id});
            });
    }


    render(){
        const {ClickToPlay} = this.props;

        return (
            <div id="Games">
                {this.state.previosGameId &&
                    <button className="select_button" id="previousButton" onClick={()=>this.getGames(this.state.searchPreviousGameId)}></button>
                }
                <div className="gamePreview" onMouseOver={()=>this.setState({showDescription1:true})} onMouseLeave={()=>this.setState({showDescription1:false})}>
                    <button onClick={() => ClickToPlay(this.state.firstGame.game)}>PLAY</button>  
                    <img src={this.state.firstGame.picturefile}/>
                    <h2>{this.state.firstGame.game}</h2>
                    {this.state.showDescription1 && <p className="gameDescription">{this.state.firstGame.info}</p> }                 
                </div>
                <div className="gamePreview"  onMouseOver={()=>this.setState({showDescription2:true})} onMouseLeave={()=>this.setState({showDescription2:false})}>
                    <button onClick={() => ClickToPlay(this.state.secondGame.game)}>PLAY</button>
                    <img src={this.state.secondGame.picturefile}/>
                    <h2>{this.state.secondGame.game}</h2> 
                    {this.state.showDescription2 && <p className="gameDescription">{this.state.secondGame.info}</p>}
                </div>
                <div className="gamePreview"  onMouseOver={()=>this.setState({showDescription3:true})} onMouseLeave={()=>this.setState({showDescription3:false})}>
                    <button onClick={() => ClickToPlay(this.state.thirdGame.game)}>PLAY</button>
                    <img src={this.state.thirdGame.picturefile}/>
                    <h2>{this.state.thirdGame.game}</h2> 
                    {this.state.showDescription3 && <p className="gameDescription">{this.state.thirdGame.info}</p>}
                </div>
                {this.state.nextGameId &&
                    <button className="select_button" id="nextButton" onClick={()=>this.getGames(this.state.searchNextGameId)}></button>
                }
            </div>
        );
    }
}

