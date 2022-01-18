import React from 'react';
import swal from 'sweetalert';
import config from '../../../config.json';
import './MainMenu.css';
import HighScoreTable from '../HighScoreTable/HighScoreTable'

const axios = require('axios');



class MainMenu extends React.Component {
    constructor(props) {
        console.log("MainMenu c-tor")
        super(props);
        this.state = {
            username: '',
            usersCollection: []
        };
    }








    dataTable() {
        return this.state.usersCollection.map((data, i) => {
            return <HighScoreTable obj={data} key={i}  />;
        });
    }
    componentDidMount() {
        axios.get('http://localhost:2000/showAll')
            .then(res => {
                this.setState({ usersCollection: res.data });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    register = (e) => {
        e.preventDefault()

        axios.post('http://localhost:2000/register', {
            username: this.props.playerName,
        })
            .then((res) => {
                // swal({
                //         text: res.data.title,
                //         icon: "success",
                //         timer: 500,
                //     },
                // );
                // this.props.history.push('/');
                this.props.handleNameSubmission()
            })
            .catch((err) => {
                if (err.response && err.response.data && err.response.data.errorMessage) {
                    swal({
                        dangerMode: true,
                        text: err.response.data.errorMessage,
                        icon: "error",
                    })
                }
            });

    }

    render() {
        console.log("render MainMenu")
        return (
            <div>

                <h1>{config.title}</h1>
                <img className="quizLogo" src={`${window.location.origin}/${config.quizLogo}`} alt={`${config.title} logo`} />
                <h2 style={{ color: config.titleColor, margin:5}}>Welcome</h2>

                <div className="row">
                    <div className="col-5">
                        Please enter your name:
                    </div>
                    <div className="username input col-7">
                        {/*<Form>*/}
                            <div className = "mb-4">
                                <input
                                    // size="5"
                                    type="text"
                                    name="username"
                                    // value={this.props.playerName}

                                    onChange={this.props.setPlayerName}
                                    placeholder="s"
                                />
                                {/*<FormControl.Feedback type="invalid">*/}
                                {/*</FormControl.Feedback>*/}
                            </div>
                        {/*</Form>*/}
                    </div>
                </div>

                <button
                    type="button"
                    className="rainbow rainbow-1"
                    disabled={this.props.playerName === ''}
                    onClick={this.register}
                    // onClick={this.props.handleNameSubmission }
                >
                    Continue
                </button>

                <div className="wrapper-users">
                    <div className="container">
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                            <tr>
                                <th> </th>
                                <td>Name</td>
                                {/*<td>logged</td>*/}
                                <td>Best Score</td>
                                <td>Last seen</td>
                            </tr>
                            </thead>
                            <tbody>
                            {this.dataTable()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
export default MainMenu;
