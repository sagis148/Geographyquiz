import React from 'react';
import { backgroundImage } from '../../config.json';
import question, {  questions } from '../../questions.json';
import Quiz from '../quiz/Quiz';
import './App.css';
import axios from "axios";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: -1,//Current question page.
      numCorrectAnswers: 0,
      numIncorrectAnswers: 0,
      qNum: 0,//Current question number.
      score: 0,//Current player score.
      playerName:"s",
      difficulty:"3",//Default - easy.
      amountOfQuestions:"5",//Default - 5 questions.
      gameQuestionsType:"country",//Default - flags questions.
      secondsElapsed: 45 //Default - 45 seconds.
    }
  }

  /**
   * Get the current time.
   * @returns {string} The time in seconds.
   */
  getSeconds() {
    if (this.secondsElapsed  >= 0) {
      return (("" + (this.secondsElapsed )).slice(-2));
    }
    else {//Times is up, stop the timer by setting it to 0.
      return "0"
    }
  }
  /**
   * Start the countdown timer.
   */
  startTime = () => {
    this.countdown = setInterval(() => {
      this.setState(({ secondsElapsed }) => ({
        secondsElapsed: secondsElapsed - 1
      }));
    }, 1000);
  };
  /**
   * Reset the countdown timer.
   */
  resetTime = () => {
    clearInterval(this.countdown);
    this.setState({secondsElapsed: 45,});
  };
  /**
   * Pause the countdown timer.
   */
  pauseTime = () => {clearInterval(this.countdown)};
  /**
   * Sets the player name.
   * @param e The name input.
   */
  setPlayerName = (e) => {
    this.setState({playerName: e.target.value}) ;
  }
  /**
   * Sets the difficulty.
   * @param e The chosen difficulty.
   */
  setDifficultyChange=(e)=> {
    this.setState({difficulty : e.target.value})
  }
  /**
   * Sets the questions amount.
   * @param e The chosen questions amount.
   */
  setQuestionsAmountChange=(e)=> {
    this.setState({amountOfQuestions : e.target.value})
  }
  /**
   * Sets the question type.
   * @param e The chosen question type.
   */
  setTypeChange=(e)=> {
    this.setState({gameQuestionsType:e.target.value})
  }
  /**
   * Moves to the entry menu after name submission.
   */
  handleNameSubmission = () => {
    this.setState({page: this.state.page + 1})
  }
  /**
   * Resets the timer and randomly selects a random question.
   */
  handlePageNext = () => {
    this.resetTime()
    let min = 1;
    let max = Number(question.questions.length)//Maximum questions amount.
    if (this.state.qNum < Number (this.state.amountOfQuestions )+1) {
      this.setState({
        page: Number(Math.floor(Math.random() * (max - min) + min)),
        qNum: this.state.qNum + 1
      })
    }
  }
  /**
   * This function calculate the score, Summarized it and counts the amount of correct and incorrect answers .
   * @param validAnswer True for correct answer, False for incorrect answer.
   * @param clueButtonPenalty If the user press the hint button it value will be 0.5 otherwise its 1.
   * @param currentTime The current time left.
   */
  handleAnswerSubmission = (validAnswer,clueButtonPenalty,currentTime) => {
    // A correct answer score is calculated based on the difficulty of the game,
    // the time it took for the user to answer the question and will be rounded to have a round score.
    // If the hint button was used the score would be cut in half.
    let currentScore = Math.round(((10 * this.state.difficulty / 2 ) + currentTime) * clueButtonPenalty)
    if (validAnswer){
      this.setState((prevState) => ({
        numCorrectAnswers: prevState.numCorrectAnswers + 1,
        score:prevState.score += currentScore
      }));
    }
    else this.setState({ numIncorrectAnswers: this.state.numIncorrectAnswers + 1 })
  }
  /**
   * Start over button pressed.
   * Returns the user to the entry menu.
   */
  reset = () => {
    this.setState({
      page: 0,
      numCorrectAnswers: 0,
      numIncorrectAnswers: 0,
      qNum:0,
      score:0
    });
  }
  /**
   * End game button pressed.
   * Returns the user to the main menu.
   */
  endGame = () => {
    this.setState({
      page: -1,
      numCorrectAnswers: 0,
      numIncorrectAnswers: 0,
      qNum:0,
      score:0,
      difficulty:"3",
      amountOfQuestions:"5",
      gameQuestionsType:"country"
    });
    axios.post('http://localhost:2000/logOut')
  }

  render() {
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
              setDifficultyChange={this.setDifficultyChange}
              setQuestionsAmountChange={this.setQuestionsAmountChange}
              setTypeChange={this.setTypeChange}
              handlePageNext={this.handlePageNext}
              handleAnswerSubmission={this.handleAnswerSubmission}
              reset={this.reset}
              endGame={this.endGame}
              randomAnswers = {this.createRandomAnswers}
              handleNameSubmission={this.handleNameSubmission}
              questions={questions}
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
