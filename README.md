# React Quiz Application Template

#### Easily put together a quiz and customize it through 1 json file
See running example at: [limitless-reef-93222.herokuapp.com/](https://limitless-reef-93222.herokuapp.com/)

### Documentation

#### Customization

Customize the template through `./src/config.json`

```json
{
  "title":  "The Planet Express Quiz",
  "titleColor":  "#333",
  "quizLogo":  "planet-express.png",
  "subtext":  "Welcome to the Quiz. ",
  "subtext2":  "Try to get as many questions right as you can.",
  "subtextColor":  "#000",
  "startButtonText":  "Get Started",
  "backgroundImage":  "background.jpg",
  "containerColor":  "#fff",
  "containerAccentColor":  "#eaeaea",
  "buttonColor":  "#e74c3c",
  "buttonHoverColor":  "#e56357",
  "buttonTextColor":  "#fff",
  "quizTextColor":  "#000",
  "questionScoreCorrectColor":  "#2ecc71",
  "questionScoreIncorrectColor":  "#e74c3c",
  "questionScoreWarningColor":  "#ff9f43",
  "submitText":  "Submit",
  "nextButtonText":  "Next Question",
  "correctAnswerText":  "Correct!",
  "incorrectAnswerText":  "Incorrect, the correct answer was:",
  "questionNotAnsweredText":  "Doh! you forgot to choose an answer.",
  "resultsHeader":  "Results",
  "congratsGif":  "congrats.gif",
  "startOverButtonText":  "Start Over",
  "questions":  [{
    "body":  "In 'Space Pilot 3000' who is the first main character that Fry meets?",
    "img":  "http://slurmed.com/fgrabs/01acv01/01acv01_019.jpg",
    "answers":  ["Zoidberg",  "Leela",  "Bender",  "Professor Hubert J. Farnsworth"],
    "correctAnswerIndex":  1
  },
  {
    "body":  "In 'The Series Has Landed' what was the name of the amusement park on the moon?",
    "img":  "http://images2.fanpop.com/images/photos/7300000/Futurama-1x02-The-Series-Has-Landed-futurama-7312946-500-333.jpg",
    "answers":  ["Lunar Park",  "Mars University",  "Wong Ranch",  "Moon Spacefun"],
    "correctAnswerIndex":  0
  },
  {
    "body":  "In 'When Aliens Attack' what planet are the aliens from?",
    "img":  "http://slurmed.com/fgrabs/01acv12/01acv12_045.jpg",
    "answers":  ["Omicron Persia 11",  "Omicron Persia 8",  "Mars",  "Amazonia"],
    "correctAnswerIndex":  1
  },
  {
    "body":  "In 'Hell Is Other Robots' where was robot hell?",
    "img":  "https://horrorpediadotcom.files.wordpress.com/2014/04/robot-hell.png",
    "answers":  ["Utah",  "Alabama",  "Texas",  "New Jersey"],
    "correctAnswerIndex":  3
  },
  {
    "body":  "In 'Fear of Bot Planet' what fake religious robot holiday did Bender make up?",
    "img":  "http://images2.fanpop.com/image/photos/12400000/1x05-Fear-of-a-Bot-Planet-futurama-12425237-500-375.jpg",
    "answers":  ["Bot-Mitvah",  "Robanza",  "Robonukah",  "Robotisam"],
    "correctAnswerIndex":  2
  }]
}
```

#### Image Assets

Image assets should be stored in the `./public` folder for the application to work correctly. Then inside of `./src/config.json`
you reference them by just the filename and extension:

```json
...
"quizLogo": "planet-express.png"
...
"backgroundImage":  "background.jpg",
...
"congratsGif": "congrats.gif"
...
```

#### Note

- Currently the value for site title is hard-coded so you must change it in `./public/index.html`
