import React from 'react';
import QuizEntry from './QuizEntry/QuizEntry';
import QuizQuestion from './QuizQuestion/QuizQuestion';
import QuizFinish from './QuizFinish/QuizFinish';
import './Quiz.css';
import MainMenu from "./Menus/MainMenu";
import axios from "axios";

class Quiz extends React.Component {
    constructor(props) {
        super(props);
        axios.post('http://localhost:2000/logOutEveryOne', {})
    }

  renderQuizDisplay = () => {
    if (this.props.page === -1) {//Main Menu
      return (
          <MainMenu
              handleNameSubmission={this.props.handleNameSubmission}
              setPlayerName={this.props.setPlayerName}
              playerName={this.props.playerName}
          />
      )
    }
    else if (this.props.page === 0) {//Quiz entry
      return <QuizEntry
          handlePageNext={this.props.handlePageNext}
          gameQuestionsType={this.props.gameQuestionsType}
          setTypeChange={this.props.setTypeChange}
          setQuestionsAmountChange={this.props.setQuestionsAmountChange}
          setDifficultyChange={this.props.setDifficultyChange}
          playerName={this.props.playerName}
          difficulty={this.props.difficulty}
          amountOfQuestions={this.props.amountOfQuestions}
      />
    }
    //Ask questions as the amount of questions defined at the beginning.
    else if ( this.props.qNum !== (Number(this.props.amountOfQuestions)+1))
    {
      return (
          <QuizQuestion
              page={this.props.page}
              qNum={this.props.qNum}
              handlePageNext={this.props.handlePageNext}
              numCorrectAnswers={this.props.numCorrectAnswers}
              numIncorrectAnswers={this.props.numIncorrectAnswers}
              handleAnswer={this.props.handleAnswer}
              handleAnswerSubmission={this.props.handleAnswerSubmission}
              score={this.props.score}
              gameQuestionsType={this.props.gameQuestionsType}
              amountOfQuestions={this.props.amountOfQuestions}
              difficulty={this.props.difficulty}
              secondsElapsed={this.props.secondsElapsed}
              startTime={this.props.startTime}
              resetTime={this.props.resetTime}
              pauseTime={this.props.pauseTime}
              getSeconds={this.props.getSeconds}
          />
      )
    }
    else {
        //No more questions to ask.
      return <QuizFinish
          numCorrectAnswers={this.props.numCorrectAnswers}
          reset={this.props.reset}
          endGame={this.props.endGame}
          score={this.props.score}
          amountOfQuestions={this.props.amountOfQuestions}
          playerName={this.props.playerName}
      />
    }
  }
  render() {
    return (
        <div className="container-fluid quizContainer" style={{ backgroundImage: `url('texture.png')`}}>
          {this.renderQuizDisplay()}
        </div>
    );
  }
}
export default Quiz;
