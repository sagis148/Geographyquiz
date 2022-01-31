import React from 'react';
import config from '../../../config.json';
import './QuizFinish.css';
import {ButtonGroup} from "react-bootstrap";
import axios from "axios";
import HighScoreTable from '../HighScoreTable/HighScoreTable'
/**
 * The final page.
 */
class QuizFinish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usersCollection:[]
        }
        axios.get('http://localhost:2000/saveScore/' + this.props.score + '/' + this.props.playerName)
            .then(res => {
                console.log("saveScore")
                this.setState({ score: res.data });
                this.setState({ usersCollection: res.data });
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    /**
     * Show the leaderboard from the data base.
     */
    componentDidMount() {
        //setTimeout needed for letting the score be updated.
        setTimeout(() => {
            axios.get('http://localhost:2000/showAll')
                .then(res => {

                    this.setState({ usersCollection: res.data });
                })
                .catch(function (error) {
                    console.log(error);
                })
        }, 500);
    }
    /**
     *
     * @returns High score table.
     */
    dataTable() {
        return this.state.usersCollection.map((data, i) => {
            return <HighScoreTable obj={data} key={i} />;
        });
    }

    render() {
        return (
            <div>
                <h1>{config.title}</h1>
                <img className="resultsLogo" src={`${window.location.origin}/${config.quizLogo}`} alt={`${config.title} logo`}/>
                <h2 className="resultsHeader">{"Leaderboard"}</h2>
                <div className="container">
                    <table className="table table-bordered border-dark">
                        <thead className="thead-dark">
                        <tr>
                            <th> </th>
                            <td>Name</td>
                            {/*<td>logged</td>*/}
                            <td>Best Score</td>
                            <td>Last Seen</td>
                        </tr>
                        </thead>
                        <tbody>
                        {this.dataTable()}
                        </tbody>
                    </table>
                </div>
                {this.props.numCorrectAnswers === parseInt(this.props.amountOfQuestions) ?
                    <div className="perfect">
                        <img src={`${window.location.origin}/${config.perfectGif}`} alt={"Perfect gif"} />
                        <p> {"You answered all the questions correctly!"}</p>
                    </div>
                    :
                    <p className="resultsNumbers">You got {this.props.numCorrectAnswers} correct answers out of {parseInt( this.props.amountOfQuestions)}!</p>
                }
                <p><u>Yore score:</u> <b>{this.props.score}</b></p>

                <ButtonGroup  variant="contained" aria-label="outlined primary button group">
                    <button
                        className="endGameButtons"
                        onClick={this.props.reset}
                    >
                        {"Start Over"}
                    </button>
                    &nbsp;&nbsp;&nbsp;{/*Space between the buttons*/}
                    <button
                        className="endGameButtons"
                        onClick={this.props.endGame}
                    >
                        {"End Game"}
                    </button>
                </ButtonGroup>
            </div>
        )
    }
}

export default QuizFinish;
