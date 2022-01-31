import React from 'react';
import config from '../../../config.json';
import './QuizEntry.css';
import 'react-bootstrap';
/**
 * The second page.
 */
class QuizEntry extends React.Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        //Cannot be played when the type of question is religion and the difficulty is hard.
        document.getElementsByClassName("form-select")[2][2].disabled = this.props.difficulty === "7";
        document.getElementsByClassName("form-select")[0][2].disabled = this.props.gameQuestionsType === "religion";
    }
    render() {
        return (
            <div>
                <h1>{config.title}</h1>
                <img className="quizLogo" src={`${window.location.origin}/${config.quizLogo}`} alt={`${config.title} logo`} />
                <h2> Hi, {this.props.playerName}</h2>
                <div className="dropdownContainer">
                    <div className="dropdown row">
                        <div className="dropdownInput col-8">
                            <label>Difficulty:</label>
                        </div>
                        <div className="col-4">
                            <select className="form-select" defaultValue={this.props.difficulty} onChange={this.props.setDifficultyChange}>
                                <option value="3">Easy</option>
                                <option value="5">Normal</option>
                                <option value="7">Hard</option>
                            </select>
                        </div>
                    </div>
                    <div className="dropdown row">
                        <div className="dropdownInput col-8">
                            <label>Amount Of Questions:</label>
                        </div>
                        <div className="col-4">
                            <select  className="form-select" defaultValue={this.props.amountOfQuestions} onChange={this.props.setQuestionsAmountChange}>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                    <div className="dropdown row">
                        <div className="dropdownInput col-8">
                            <label>Questions Type:</label>
                        </div>
                        <div className="col-4">
                            <select className="form-select" defaultValue={this.props.gameQuestionsType} onChange={this.props.setTypeChange}>
                                <option value="country">Flags</option>
                                <option value="city">Capital Cities</option>
                                <option value="religion">Religion</option>
                                <option value="language">Language</option>
                                {/*<option value="Population">Population</option>*/}
                            </select>
                        </div>
                    </div>
                </div>
                <button
                    className="rainbow rainbow-1"
                    onClick={this.props.handlePageNext}
                >
                    {"Get Started"}
                </button>
            </div>
        )
    }
}
export default QuizEntry;
