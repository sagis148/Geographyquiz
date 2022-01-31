import React from 'react';
import config from '../../../config.json';
import question  from '../../../questions.json';
import './QuizQuestion.css';

class QuizQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qNum:this.props.qNum,
      submitButtonClicked: false,
      questionAnswered: false,
      selectedAnswer: null,
      showAnswerResponse: null,
      correctAnswer:null,
      randomAnswers:[],
      qType:this.props.gameQuestionsType,
      clueButtonPenalty:1,
      timePenalty:1
    }
  }

  componentDidMount() {
    this.setState({randomAnswers:this.createRandomAnswers()})
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //Changing the timer.
    let questionTime = document.getElementById("timer")
    questionTime.style.color='black'
    questionTime.className=""
    if (this.props.secondsElapsed  <= 30) {
      questionTime.style.color = 'orange';
    }
    if (this.props.secondsElapsed  <= 15) {
      questionTime.style.color = 'red';
      questionTime.className="blink_me";
      questionTime.style.fontSize = "large";
    }
    //Next question
    if (prevProps.page !== this.props.page) {
      this.setState({
        questionAnswered: false,
        showAnswerResponse: null,
        randomAnswers:this.createRandomAnswers()
      })
    }

    // if(this.props.secondsElapsed === 0) this.setState({ showAnswerResponse: "time is up"})
    //  console.log("this.setState.showAnswerResponse: ",this.setState.showAnswerResponse)
  }

  /**
   * Clicking this button will delete half of the answers and half of the score.
   * @param e The get clue button.
   */
  getClue(e) {
    //Disabled clue button.
    e.target.disabled = true;
    //The buttons that will be disabled.
    let buttonsToDisabled = [];
    let i = 0
    //Current correct answer.
    let correctAnswer = this.state.correctAnswer;
    //All answers buttons.
    let answersButtons = Array.from(document.querySelectorAll('.answerButton'));
    //All answers buttons without the correctAnswer.
    let answersButtonsWithoutCorrectAnswer = answersButtons.filter(function(f) { return f.innerHTML !== correctAnswer });
    //Set the clue penalty.
    this.setState({clueButtonPenalty:0.5})
    //Choose random answers that will become non-clickable.
    //Half of the answers amount.
    while (i < answersButtons.length/2){
      //Random number in range (0,answersButtons.length-1).
      const random = Math.floor(Math.random() * Math.abs(answersButtons.length-1));
      //Avoid duplicate numbers.
      if((buttonsToDisabled.indexOf(answersButtonsWithoutCorrectAnswer[random]) !== -1)) {
        continue;
      }
      buttonsToDisabled.push(answersButtonsWithoutCorrectAnswer[random]);
      i++;
    }
    //Make those random answers to non-clickable.
    i = 0
    while (i < buttonsToDisabled.length){
      buttonsToDisabled[i].disabled = true;
      i++;
    }
  }

  /**
   * This function is performed for each new question.
   * Generates appropriate answers according the type of question.
   * It's resets the clue button penalty and make it enable if necessary.
   * Responsible for returning the colors of the buttons to gray.
   * Turns on the timer.
   * @returns {*[]} Random answers.
   */
  createRandomAnswers() {
    //Set the clue penalty.
    this.setState({clueButtonPenalty:1})
    //Return the clue button to enabled.
    document.getElementById("clueButton").disabled = false;
    let correctAnswer;
    const answersArray = [];
    //Return all buttons to original color and enabled them.
    for(let button of document.getElementsByClassName("answerButton")) {
      button.style.background = 'linear-gradient(to right, #eaeaea, #c5c4c4)';
      button.disabled = false;
    }
    //Current correct answer.
    correctAnswer = question.questions[this.props.page - 1][this.state.qType];
    this.setState({correctAnswer:correctAnswer})
    //Creating answers array.
    answersArray.push(correctAnswer);
    do {
      let random = Math.floor(Math.random() * question.questions.length);
      if (!answersArray.includes(question.questions[random][this.state.qType])) {
        answersArray.push(question.questions[random][this.state.qType]);
      }
    }
    while (answersArray.length < parseInt(this.props.difficulty)+1);
    //Start countdown the time.
    this.props.startTime()
    //Shuffles the order of the answers.
    answersArray.sort(() => Math.random() - 0.5)
    return answersArray;
  }

  /**
   * Saves and colors the chosen answer button.
   * @param e The chosen button.
   */
  setAnswer = (e) => {
    //No answer was selected.
    if(!this.state.questionAnswered){
      for(let button of document.getElementsByClassName("answerButton")) {
        button.style.background = 'linear-gradient(to right, #eaeaea, #c5c4c4)';//Gray.
      }
      //Color the selected answer button.
      e.target.style.background =  'linear-gradient(to right, #7FBCF9, #77a7d7)';//Azure.
    }
    //answer selected.
    if(this.state.questionAnswered) {
      e.target.style.border="3px solid #000"//Highlight with black border.
    }
    //Sets the selected answer and its index(name).
    this.setState({
      selectedAnswer: e.target.innerHTML,
      selectedAnswerIndex:e.target.name
    });
  }
  /**
   * This functions colors the correct answer in green and if the user chose incorrct answer it will color it in red.
   * @param answerCorrect True for correct answer, False for incorrect answer.
   * button.name is the button number/index.
   */
  colorTheAnswer = (answerCorrect) => {

    for(let button of document.getElementsByClassName("answerButton")) {
      //Checks if the chosen button match to the correct answer.
      if(button.innerHTML === this.state.correctAnswer ){
        //Paint the correct answer button.
        button.style.background= 'linear-gradient(to right, #5ed285, #1b9b52)';//Green.
      }
      //If the user chose incorrct answer.
      if(this.state.selectedAnswerIndex === button.name && !answerCorrect){
        //Paint the incorrect answer button.
        button.style.background= 'linear-gradient(to right, #ed213a, #93291e)';//Red.
      }
    }
  }
  /**
   * This function is performed when an answer submited.
   * Checks the answer and paints the buttons accordingly, stops the timer and calculates the score.
   */
  handleAnswerSubmission = () => {
    let currentQuestion = question.questions[this.props.page - 1][this.state.qType]
    let currentTime = document.getElementById("timer").innerHTML
    let answerCorrect;
    //If an answer was selected and that was the correct answer.
    if (this.state.selectedAnswer && (this.state.selectedAnswer) === (currentQuestion))
    {
      answerCorrect = true;
      this.colorTheAnswer(answerCorrect)
    }
    //If an answer was selected and that was NOT the correct answer.
    else if (this.state.selectedAnswer)
    {
      answerCorrect = false;
      this.colorTheAnswer(answerCorrect)
    }
    //If an answer was NOT.
    else answerCorrect = null;
    //After clicking submit the timer will stop.
    if(answerCorrect != null){
      this.props.pauseTime()
    }
    if (answerCorrect === null) this.setState({ showAnswerResponse: "none" })
    else if (answerCorrect === true) this.setState({ showAnswerResponse: "correct" })
    else this.setState({ showAnswerResponse: "incorrect"})

    this.setState({
      submitButtonClicked: true,
      questionAnswered: answerCorrect !== null,
      answerCorrect
    });

    if (this.state.selectedAnswer && answerCorrect !== null) {
      this.setState({
        submitButtonClicked: false,
        selectedAnswer: null,
      });
      //Calculate the score.
      this.props.handleAnswerSubmission(answerCorrect,this.state.clueButtonPenalty,(currentTime/2));
    }

  }
  /**
   * Creates the answers buttons.
   * @param randomAnswers The answers.
   * @returns {*} Answers buttons.
   */
  renderAnswers = (randomAnswers) => {
    return randomAnswers.map((answer,i) => {
      return (
          <div className="col" key={answer}>
            <button
                type="button"
                className= "answerButton"
                name={`${i}`}
                onClick={e => this.setAnswer(e)}
                id={`answerButton${i}` }//Unique id for each button.
                style={{fontWeight:"bold"}}
            >
              {answer}
            </button>
          </div>
      )
    })
  }
  /**
   * Displays a response of the solution.
   * @param currentQuestion The current correct answer.
   * @returns {JSX.Element} Response of the solution.
   */
  renderAnswerResponseText = (currentQuestion) => {

    if (this.state.showAnswerResponse === "correct")
      return (<p className="answerResponse" style={{ color: config.questionScoreCorrectColor }}>{"Correct!"}</p>)
    else if (this.state.showAnswerResponse === "incorrect")
      return (<p className="answerResponse" style={{ color: config.questionScoreIncorrectColor }}>{"Incorrect, the correct answer was:"} <strong>{currentQuestion}</strong></p>)
    else if (this.state.showAnswerResponse === "none")
      return (<p className="answerResponse" style={{ color: config.questionScoreWarningColor}}>{"You forgot to choose an answer."}</p>)
    // else if (this.state.showAnswerResponse === "time is up")
    //   return (<p className="answerResponse" style={{ color: config.questionScoreIncorrectColor }}>{"Time is up!, the correct answer was:"} <strong>{currentQuestion}</strong></p>)
    // else return (<div style={{ height: '43px' }}>

    // </div>)
  }

  /**
   * Creates the question.
   * If question type is flags it will display an image of a flag Otherwise, it will display the country name.
   * @returns {JSX.Element} Flag image or country name.
   */
  renderQuestionTypeField() {
    let currentQuestion = question.questions[this.props.page - 1];
    if(this.state.qType === "country") {
      return(
          <img
              className="questionImage"
              src={currentQuestion.img} alt={`for question ${this.props.page - 1}`}
              style={{ borderColor: config.containerAccentColor,
                borderWidth: 2
              }}
          />)
    }
    else {
      return (
          <div className="capitalCityDiv">
            {currentQuestion.country}
          </div>
      );
    }
  }

  render() {
    return (
        <div className="container">
          <h1>{config.title}</h1>
          <div>
            {this.renderQuestionTypeField()}{/* Render questions by type*/}
          </div>
          <div className= "timeHintQuestion">
            <div className="row ">
              <div className="col px-0">
                <div className="timeAndAmount">
                  Time:
                  <p className="" id={"timer"}> {this.props.getSeconds()}</p>
                </div>
              </div>
              <div className="col px-0">
                {/*<div>*/}
                  <button
                      title="Clicking this button will delete half of the answers and half of the score."
                      className="getClueButton"
                      id = "clueButton"
                      onClick={e=>this.getClue(e)}
                  >
                    {"Hint"}
                  </button>
                {/*</div>*/}
              </div>
              <div className="col px-0">
                <div className="timeAndAmount">
                  Question
                  <p>{this.props.qNum} / {Number(this.props.amountOfQuestions)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="questionFormWrap">
            <div className="container" >
              <div className="row row-cols-sm-2 mx-5">
                {this.renderAnswers(this.state.randomAnswers)}
              </div>
            </div>
            {!this.state.questionAnswered ?
                <button
                    className="questionSubmit"
                    onClick={this.handleAnswerSubmission}
                >
                  {"Submit"}
                </button>
                :
                <button
                    className="questionSubmit"
                    onClick={this.props.handlePageNext}
                >
                  {"Next Question"}
                </button>
            }
            <div className="row" style={{height: 77}}>
              {this.renderAnswerResponseText(question.questions[this.props.page - 1][this.state.qType])}
            </div>
            <p className="questionCurrentScore">
              <span style={{ color: config.questionScoreCorrectColor }}>
                {this.props.numCorrectAnswers} correct</span> |&nbsp;
              <span style={{ color: config.questionScoreIncorrectColor }}>
                {this.props.numIncorrectAnswers} incorrect</span>
              <br />
              <span>Your Score: {this.props.score}</span>
            </p>
          </div>
        </div>
    )
  }
}
export default QuizQuestion;
