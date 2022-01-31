import React from 'react';
import swal from 'sweetalert';
import config from '../../../config.json';
import './MainMenu.css';
import HighScoreTable from '../HighScoreTable/HighScoreTable'

const axios = require('axios');

/**
 * The first page.
 */
class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            usersCollection: []
        };
    }
    /**
     * Creates the High score table from the mongodb data base.
     * @returns High score table.
     */
    dataTable() {
        return this.state.usersCollection.map((data, i) => {
            return <HighScoreTable obj={data} key={i}/>;
        });
    }
    /**
     * Show the leaderboard from the data base.
     */
    componentDidMount() {
        axios.get('http://localhost:2000/showAll')
            .then(res => {
                this.setState({ usersCollection: res.data });
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    /**
     * Register a user to data base.
     */
    register = () => {
        axios.post('http://localhost:2000/register', {
            username: this.props.playerName,
        })
            .then((res) => {
                swal({
                        text: res.data.title,
                        icon: "success",
                        timer: 3000,
                    },
                );
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
        return (
            <div>
                <h1>{config.title}</h1>
                <img className="quizLogo" src={`${window.location.origin}/${config.quizLogo}`} alt={`${config.title} logo` } />
                <h2>Welcome</h2>
                <div className="row">
                    <div className="col sm-6">
                        <label htmlFor="userNameInput">Please enter your name:</label>
                    </div>
                    <div className="col sm-6">
                        <input
                            type="text"
                            id="userNameInput"
                            onChange={this.props.setPlayerName}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") this.register()
                            }}
                        />
                    </div>
                </div>

                <button
                    type="button"
                    className="rainbow rainbow-1"
                    disabled={this.props.playerName === ''}
                    onClick={this.register}
                >
                    Continue
                </button>

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
            </div>
        );
    }
}

export default MainMenu;
