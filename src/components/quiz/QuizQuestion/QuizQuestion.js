import React from 'react';
import config from '../../../config.json';
import flagQuestion  from '../../../flagQuestions.json';

import './QuizQuestion.css';


class QuizQuestion extends React.Component {
  constructor(props) {
    // console.log("constructor QuizQuestion")
    super(props);
    this.state = {

      // currentPage: this.props.page,
      qNum:this.props.qNum,
      buttonColor: config.buttonColor,
      answerButtonColor:config.answerButtonColor,

      submitButtonClicked: false,
      questionAnswered: false,
      selectedAnswer: null,
      // answerCorrect: null,
      showAnswerResponse: null,

      correctAnswer:null,

      randomAnswers:[],
      qType:this.props.gameQuestionsType,
      clueButtonPenalty:1,
      timePenalty:1

    }

  }



  componentDidMount() {
    // console.log("QuizQuestion componentDidMount")

    this.setState({
      randomAnswers:this.createRandomAnswers(),
      test:flagQuestion.questions[this.props.page - 1][this.state.qType]
    })

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log("componentDidUpdate QuizQuestion")
    let questionTime = document.getElementById("timer")
    questionTime.style.color='black'
    questionTime.className=""
    if (prevProps.page !== this.props.page) {
      this.setState({
        questionAnswered: false,
        showAnswerResponse: null,
        randomAnswers:this.createRandomAnswers(),
      })
    }
    if (this.props.secondsElapsed  <= 30) {
      questionTime.style.color = 'orange';
    }
    if (this.props.secondsElapsed  <= 15) {
      questionTime.style.color = 'red';
      questionTime.className="blink_me";
      questionTime.style.fontSize = "large";
    }

    // if(this.props.secondsElapsed === 0) this.setState({ showAnswerResponse: "time is up"})
    //  console.log("this.setState.showAnswerResponse: ",this.setState.showAnswerResponse)
  }


  getClue(e) {
    e.target.disabled = true;//Disabled clue button.
    let buttonsToDisabled = [];//The buttons that will be disabled.
    let i = 0//Index
    let correctAnswer = this.state.correctAnswer;
    // console.log( "correctAnswer: "+ correctAnswer)

    let answersButtons = Array.from(document.querySelectorAll('.answerButton'));//All answers buttons.
    let answersButtonsWithoutCorrectAnswer = answersButtons.filter(function(f) { return f.innerHTML !== correctAnswer })//All answers buttons without the correctAnswer.

    this.setState({clueButtonPenalty:0.5})

    //Choose random answers that will become non-clickable.
    while (i < answersButtons.length/2){//Half of the answers amount.
      const random = Math.floor(Math.random() * Math.abs(answersButtons.length-1));//Random number in range (0,answersButtons.length-1).
      if((buttonsToDisabled.indexOf(answersButtonsWithoutCorrectAnswer[random]) !== -1)) {//Avoid duplicate numbers.
        continue;
      }
      buttonsToDisabled.push(answersButtonsWithoutCorrectAnswer[random]);
      ++i;
    }
    //Make those random answers to non-clickable.
    i = 0
    while (i < buttonsToDisabled.length){
      buttonsToDisabled[i].disabled = true;
      ++i;
    }
  }

  createRandomAnswers() {

    //Set the clue penalty.
    this.setState({clueButtonPenalty:1})
    //Start countdown the time.
    this.props.startTime()
    //Return the clue button to enabled.
    document.getElementById("clueButton").disabled = false;

    // let buttons = document.getElementsByClassName("answerButton");//Get all answer buttons.
    let correctAnswer;
    // const answersArray = [];
    const result = [];
    // let i = 0;


    //Return all buttons to original color and enabled them.
    for(let button of document.getElementsByClassName("answerButton")) {
      button.style.background = 'linear-gradient(to right, #eaeaea, #c5c4c4)';
      button.disabled = false;
    }

    // while(i < flagQuestion.questions.length){//
    //   const random = Math.floor(Math.random() * flagQuestion.questions.length);
    //
    //   answersArray.push(flagQuestion.questions[random][this.state.qType]);
    //
    //
    //   i++
    // }

    // i=0
    correctAnswer = flagQuestion.questions[this.props.page - 1][this.state.qType];
    this.setState({correctAnswer:correctAnswer})

    result.push(correctAnswer);
    do {

      let random = Math.floor(Math.random() * flagQuestion.questions.length);

      if (!result.includes(flagQuestion.questions[random][this.state.qType])) {
        result.push(flagQuestion.questions[random][this.state.qType]);
        // console.log(i,": ",answersArray[random])
      }
      else if (result.includes(flagQuestion.questions[random] || result.includes(correctAnswer))) {
        // console.log("shit: ",answersArray[random])

      }
    }
    while (result.length < parseInt(this.props.difficulty)+1);
    result.sort(() => Math.random() - 0.5)
    return result;


    // if(this.state.qType === "Population") {
    //   answersArray.push(flagQuestion.populationAnswers[i])
    //   correctAnswer = flagQuestion.questions[this.props.page - 1].population;
    //   console.log("xxxxxxxxxxxxxxxxxxxx: "+ correctAnswer.slice(2))
    //   if(correctAnswer < 1000000){
    //     correctAnswer = "< 1000000"
    //   }
    //   else if(correctAnswer < 2500000){
    //     correctAnswer ="< 2500000"
    //   }
    //   else if(correctAnswer < 5000000){
    //     correctAnswer ="< 5000000"
    //   }
    //   else if(correctAnswer < 10000000){
    //     correctAnswer ="< 10000000"
    //   }
    //   else if(correctAnswer < 25000000){
    //     correctAnswer ="< 25000000"
    //   }
    //   else if(correctAnswer < 50000000){
    //     correctAnswer ="< 50000000"
    //   }
    //   else if(correctAnswer < 100000000){
    //     correctAnswer ="< 100000000"
    //   }
    //   else if(correctAnswer > 100000000){
    //     correctAnswer ="100000000 +"
    //   }
    //   console.log("yyyyyyyyyyyyyyyyyyy: ", correctAnswer)
    // }
    //   const random = Math.floor(Math.random() * answersArray.length);
    //   if((result.indexOf(answersArray[random]) !== -1)
    //       ||(answersArray[random]) === correctAnswer) {//Avoid duplicate answer.
    //     continue;
    //   }
    //   result.push(answersArray[random]);
    //   ++i;
    // }


    // if(this.state.qType !== "Population") {
    //   result.push(correctAnswer);
    //   result.sort(() => Math.random() - 0.5)
    // }
    // else if(this.state.qType === "Population") {
    //   result.sort((a, b) => parseInt(a.slice(2)) - parseInt(b.slice(2)))
    // }

    // return result;
  }

  setAnswer = (e) => {
    // console.log("setAnswer")

    // let buttons = document.getElementsByClassName("answerButton");//Get all answer buttons.
    //Return all buttons to original color.

    //Color the selected answer button.
    if(!this.state.questionAnswered){
      for(let button of document.getElementsByClassName("answerButton")) {
        button.style.background = 'linear-gradient(to right, #eaeaea, #c5c4c4)';
      }
      e.target.style.background =  'linear-gradient(to right, #7FBCF9, #77a7d7)';

    }
    if(this.state.questionAnswered) {
      e.target.style.border="3px solid #000"
    }

    this.setState({//Sets the selected answer.
      selectedAnswer: e.target.innerHTML,
      selectedAnswerIndex:e.target.name
    });
  }

  colorSelectedAnswer = (answerCorrect) => {
    // let correctAnswer=this.state.correctAnswer
    // let buttons = document.getElementsByClassName("answerButton");//Get all answer buttons.

    for(let button of document.getElementsByClassName("answerButton")) {
      if(button.innerHTML === this.state.correctAnswer ){//Paint the correct answer button.
        button.style.background= 'linear-gradient(to right, #5ed285, #1b9b52)';
      }
      if(this.state.selectedAnswerIndex === button.name && !answerCorrect){//Paint the incorrect answer button.
        button.style.background= 'linear-gradient(to right, #ed213a, #93291e)';
      }
      // if(answerCorrect ==='null'){
      //   //Return all buttons to original color.
      //   for(button of buttons) {
      //     button.style.backgroundColor = "#eaeaea";
      //   }
      // }
      //  if(this.state.selectedAnswerIndex === button.name && answerCorrect) {
      //   button.style.backgroundColor = "#2ecc71";
      // }
    }
  }
  handleAnswerSubmission = (e) => {

    // console.log("handleAnswerSubmission")
    e.preventDefault();

    let currentQuestion = flagQuestion.questions[this.props.page - 1][this.state.qType]
    let currentTime = (document.getElementById("timer").innerHTML)

    let answerCorrect;
    if (this.state.selectedAnswer && (this.state.selectedAnswer) === (currentQuestion))
    {
      answerCorrect = true;
      this.colorSelectedAnswer(answerCorrect)
    }

    else if (this.state.selectedAnswer)
    {
      answerCorrect = false;
      this.colorSelectedAnswer(answerCorrect)
    }
    else answerCorrect = null;
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
        // currentPage: this.props.page,
        submitButtonClicked: false,
        selectedAnswer: null,
        // answerCorrect: null
      });
      this.props.handleAnswerSubmission(answerCorrect,this.state.clueButtonPenalty,(currentTime/2));
    }

  }

  renderAnswers = (randomAnswers) => {
    // console.log("renderAnswers")

    return randomAnswers.map((answer,i) => {

      return (

          <div className="col box" key={answer} >
            <button
                type="button"
                className= "answerButton"
                name={`${i}`}
                onClick={e => this.setAnswer(e)}//(e,"value")
                id={`answerButton${i}` }//Unique id for each button.
            >
              {answer}
            </button>

          </div>
      )
    })
  }

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
  renderQuestionTypeField() {
    let currentQuestion = flagQuestion.questions[this.props.page - 1];
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
    // console.log("render QuizQuestion")
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
                  {/*<p>{"60"}</p>*/}

                  <p className="" id={"timer"}> {this.props.getSeconds()}</p>
                  {/*<Timer/>*/}
                </div>
              </div>
              <div className="col px-0">
                <div>
                  <button
                      title="Clicking this button will delete half of the answers and half of the score."
                      className="getClueButton"
                      id = "clueButton"
                      onClick={e=>this.getClue(e)}
                  >
                    {"Hint"}
                  </button>
                </div>

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

            {/*<form className="questionForm" onSubmit={(e) => e.preventDefault()}>*/}
            {/*  <fieldset className="questionFieldset" >*/}
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
              {this.renderAnswerResponseText(flagQuestion.questions[this.props.page - 1][this.state.qType])}
            </div>

            <p className="questionCurrentScore">
              <span style={{ color: config.questionScoreCorrectColor }}>{this.props.numCorrectAnswers} correct</span> |&nbsp;
              <span style={{ color: config.questionScoreIncorrectColor }}>{this.props.numIncorrectAnswers} incorrect</span>
              <br />
              <span>Your Score: {this.props.score}</span>
            </p>
            {/*</fieldset>*/}

            {/*</form>*/}
          </div>
        </div>
    )
  }
}

export default QuizQuestion;
