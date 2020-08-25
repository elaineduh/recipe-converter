import React, { Component } from 'react';
import SingleConversion from './SingleConversion/SingleConversion';
import RecipeResizer from './RecipeResizer/RecipeResizer';
import Header from './Header/Header';
import SingleSubstitution from './SingleSubstitution/SingleSubstitution';
import { Switch, Route, Redirect } from 'react-router-dom';

class Main extends Component {
    render() {
        return (
            <div>
                <Header/>

                <Switch>
                    <Route path="/convert" component={SingleConversion} />
                    <Route exact path="/resize" component={() => <RecipeResizer />} />
                    <Route exact path="/substitute" component={() => <SingleSubstitution />} />
                    <Redirect to="/resize" />
                </Switch>
            </div>

        )
    }
}

export default Main
