import React from 'react';

class HighScoreTable extends React.Component {
    render() {
        return (
            <tr>
                <td> </td>
                <td> {this.props.obj.username} </td>
                {/*<td>{this.props.obj.loggedIn.toString()}</td>*/}
                <td> {this.props.obj.score} </td>
                <td> {this.props.obj.date} </td>
            </tr>
        );
    }
}
export default HighScoreTable;
