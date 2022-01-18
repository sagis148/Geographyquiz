import React from 'react';
import { backgroundImage } from '../../config.json';
import flagQuestion, {  questions } from '../../flagQuestions.json';
import Quiz from '../quiz/Quiz';
import './App.css';
import axios from "axios";

class App extends React.Component {

  constructor(props) {
    console.log("constructor app")
    super(props);
    this.state = {
      page: -1,//Current question page.
      numCorrectAnswers: 0,
      numIncorrectAnswers: 0,
      qNum: 0,//Current question number.
      score: 0,//Current player score.
      playerName:"s",
      difficulty:"3",
      amountOfQuestions:"5",
      gameQuestionsType:"country",

      // isActive: false,
      secondsElapsed: 45 //time in seconds

    }
  }

//Get the current second.
  getSeconds() {
    if (this.secondsElapsed  >= 0) {
      return (("" + (this.secondsElapsed )).slice(-2));
    }
    else {//Times is up, stop the timer by setting it to 0.
      return "0"
    }
  }
  //Start the countdown timer.
  startTime = () => {
    // this.setState({ isActive: true });

    this.countdown = setInterval(() => {
      this.setState(({ secondsElapsed }) => ({
        secondsElapsed: secondsElapsed - 1
      }));
    }, 1000);
  };
//Reset the countdown timer.
  resetTime = () => {
    clearInterval(this.countdown);
    this.setState({
      secondsElapsed: 45,
      // isActive: false
    });
  };
//Pause the countdown timer.
  pauseTime = () => {
    // console.log("secondsElapsed: ",this.state.secondsElapsed % 60)
    clearInterval(this.countdown);
    // this.setState({ isActive: false });
  };

  setPlayerName = (e) => {
    this.setState({
      playerName: e.target.value
    }) ;
  }
  handleDifficultyChange=(e)=> {
    this.setState({
      difficulty : e.target.value,

    })

  }
  handleQuestionsAmountChange=(e)=> {
    this.setState({
      amountOfQuestions : e.target.value
    })
  }
  handleTypeChange=(e)=> {
    this.setState({
      gameQuestionsType:e.target.value
    })
  }
  handleNameSubmission = () => {
    console.log("handleNameSubmission app")
    this.setState({
      page: this.state.page + 1
    })
  }
  handlePageNext = () => {
    this.resetTime()
    console.log("handlePageNext app")
    let min = 1;
    let max = Number(flagQuestion.questions.length)//Maximum questions amount.
    if (this.state.qNum < Number (this.state.amountOfQuestions )+1) {
      this.setState({
        page: Number(Math.floor(Math.random() * (max - min) + min)),
        qNum: this.state.qNum + 1
      })
    }
  }

  handleAnswerSubmission = (validAnswer,clueButtonPenalty,currentTime) => {
    console.log("handleAnswerSubmission app");
    // A correct answer score is calculated based on the difficulty of the game
    // and the time it took for the user to answer the question and will be rounded to have a round score.
    // If the hint was used the score would be cut in half.
    let currentScore = Math.round(((10 * this.state.difficulty / 2 ) + currentTime) * clueButtonPenalty)
    if (validAnswer){
      this.setState((prevState) => ({
        numCorrectAnswers: prevState.numCorrectAnswers + 1,
        score:prevState.score += currentScore
      }));
    }
    else this.setState({ numIncorrectAnswers: this.state.numIncorrectAnswers + 1 })
  }

  reset = () => {
    console.log("reset app")
    this.setState({
      page: 0,
      numCorrectAnswers: 0,
      numIncorrectAnswers: 0,
      qNum:0,
      score:0,
    });
  }

  endGame = () => {
    console.log("endGame app")
    this.setState({
      page: -1,
      numCorrectAnswers: 0,
      numIncorrectAnswers: 0,
      qNum:0,
      score:0
    });
    axios.post('http://localhost:2000/logOut', {})
  }

  render() {
    // console.log("render app")
    return (
        <div className="App" style={{ backgroundImage: `url('${window.location.origin}/${backgroundImage}')`}}>
          <Quiz
              page={this.state.page}
              qNum={this.state.qNum}
              score={this.state.score}
              playerName={this.state.playerName}
              difficulty={this.state.difficulty}
              amountOfQuestions={this.state.amountOfQuestions}
              gameQuestionsType={this.state.gameQuestionsType}
              numCorrectAnswers={this.state.numCorrectAnswers}
              numIncorrectAnswers={this.state.numIncorrectAnswers}
              handleAnswer={this.handleAnswer}
              setPlayerName={this.setPlayerName}
              handleDifficultyChange={this.handleDifficultyChange}
              handleQuestionsAmountChange={this.handleQuestionsAmountChange}
              handleTypeChange={this.handleTypeChange}
              handlePageNext={this.handlePageNext}
              handleAnswerSubmission={this.handleAnswerSubmission}
              reset={this.reset}
              endGame={this.endGame}
              randomAnswers = {this.createRandomAnswers}
              handleNameSubmission={this.handleNameSubmission}
              questions={questions}

              // isActive={this.state.isActive}
              secondsElapsed={this.state.secondsElapsed}

              startTime={this.startTime}
              resetTime={this.resetTime}
              pauseTime={this.pauseTime}
              getSeconds={this.getSeconds}

          />
        </div>
    );
  }
}
export default App;
