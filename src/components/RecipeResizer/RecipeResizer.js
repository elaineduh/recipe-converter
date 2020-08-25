import React, { Component } from 'react';
import { Button, Form, Container, Col, Card, CardDeck } from 'react-bootstrap';
import './RecipeResizer.css';
import PageHeader from '../PageHeader';
import { UNITS } from '../sharedInfo';

// Row for ingredient input
const IngredientInput = ({ ingredient, removeIngredient, onChange }) => {
    const qtyId = "ingr-qty-" + ingredient.id;
    const unitId = "ingr-unit-" + ingredient.id;
    const nameId = "ingr-name-" + ingredient.id;

    // Returns options for units
    const unitOptions = UNITS.map((unit) => {
        return (
            <option key={unit} value={unit}>{unit}</option>
        );
    });

    // Removes ingredient
    const removeRow = event => {
        removeIngredient(ingredient.id);
    }

    // Form row for amount/unit/ingredient name
    return (
        <Form.Row>
            <Col xs={4} sm={2}>
                <Form.Control type="number" id={qtyId} name={qtyId}
                    step=".01"
                    onChange={(e) => onChange(e, "qty", ingredient.id)}
                />
            </Col>
            <Col xs={8} sm={3}>
                <Form.Control as="select" id={unitId} name={unitId}
                    onChange={(e) => onChange(e, "unit", ingredient.id)}
                >
                    {unitOptions}
                </Form.Control>
            </Col>
            <Col xs={10} sm={6}>
                <Form.Control type="text" id={nameId} name={nameId}
                    onChange={(e) => onChange(e, "name", ingredient.id)}
                />
            </Col>
            <Col xs={2} sm={1}>
                <Button variant="outline-secondary"
                    onClick={removeRow}>×</Button>
            </Col>
        </Form.Row>
    );

}

// Returns table of ingredients
const IngredientTable = ({ ingredients, removeIngredient, onChange }) => {
    // If ingredients, map through and create ingredient rows
    if (ingredients) {
        const ingrTable = ingredients.map((ingr) => {
            return (
                <IngredientInput ingredient={ingr}
                    key={ingr.id}
                    removeIngredient={removeIngredient}
                    onChange={onChange}
                />
            );
        });
        return (
            <React.Fragment>
                {ingrTable}
            </React.Fragment>
        );
    }
    else {
        return (<React.Fragment></React.Fragment>);
    }
}

// Holds addition/removal of ingredient rows
const IngredientContainer = ({ ingredients, removeIngredient, addRow, onChange }) => {
    // Renders ingredient table and add button
    return (
        <React.Fragment>
            <IngredientTable
                ingredients={ingredients}
                removeIngredient={removeIngredient}
                onChange={onChange}
            />
            <Form.Row>
                <Col xs={{ span: 0, offset: 10 }} sm={{ span: 0, offset: 11 }}>
                    <Button onClick={addRow}
                    >+</Button>
                </Col>
            </Form.Row>
        </React.Fragment>
    );
}

// Form for resizing recipe
const ResizingForm = ({ handleSubmit, handleInputChange, ingredients, removeRow, addRow }) => {
    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Row>
                    <Col xs={12}><h5>Recipe Information</h5></Col>
                    <Form.Label htmlFor="recipeName" column md={2}>Recipe name </Form.Label>
                    <Col md={3}>
                        <Form.Control
                            type="text"
                            name="recipeName"
                            id="recipeName"
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Form.Label htmlFor="recipeDescription" column md={2}>Recipe description </Form.Label>
                    <Col md={5}>
                        <Form.Control
                            as="textarea"
                            rows="1"
                            name="recipeDescription"
                            id="recipeDescription"
                            onChange={handleInputChange}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Form.Label htmlFor="sourceServings" column md={2}>Original servings </Form.Label>
                    <Col md={3}>
                        <Form.Control
                            type="number"
                            step=".01"
                            name="sourceServings"
                            id="sourceServings"
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Form.Label htmlFor="targetServings" column md={2}>New servings</Form.Label>
                    <Col md={3}>
                        <Form.Control
                            type="number"
                            step=".01"
                            name="targetServings"
                            id="targetServings"
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col md={2}>
                        <Button type="submit" className="float-right">
                            Convert
                        </Button>
                    </Col>
                </Form.Row>
                <Form.Row className="ingredientSection">
                    <Col xs={12}><h5>Ingredients</h5></Col>
                    <Col xs={4} sm={2}><Form.Label>Amount</Form.Label></Col>
                    <Col xs={8} sm={3}><Form.Label>Unit</Form.Label></Col>
                    <Col xs={10} sm={6}><Form.Label>Ingredient</Form.Label></Col>
                </Form.Row>
                <IngredientContainer
                    ingredients={ingredients}
                    removeIngredient={removeRow}
                    addRow={addRow}
                    onChange={handleInputChange}
                />
            </Form>
        </div>
    );
}

// Card for recipe
const RecipeCard = ({ recipeName, recipeDescription, ingredients, servings }) => {
    if (ingredients && servings && ingredients !== undefined) {
        const ingredientListItems = ingredients.map((ingr) => {
            if (ingr.id && ingr.name) {
                return (<li key={ingr.id}>{ingr.qty} {ingr.unit} {ingr.name}</li>);
            }
            return (<React.Fragment></React.Fragment>);
        });

        return (
            <Card>
                <Card.Body>
                    {recipeName && <Card.Title>{recipeName}</Card.Title>}
                    <Card.Subtitle>{servings} servings</Card.Subtitle>
                    <Card.Text>{recipeDescription}</Card.Text>
                    <Card.Subtitle>Ingredients:</Card.Subtitle>
                    <ul className="list-unstyled">
                        {ingredientListItems}
                    </ul>
                </Card.Body>
            </Card>
        );
    }
    else {
        return (<React.Fragment><p>Recipe card</p></React.Fragment>);
    }
}

// Returns both original recipe and converted in a card
const ConversionResults = ({ recipeName, recipeDescription, ingredients, sourceServings, targetServings }) => {
    const convertedIngredients = ingredients.map((ingr) => {
        let ingrCopy = JSON.parse(JSON.stringify(ingr));
        if (targetServings !== 0) {
            if (ingrCopy.qty && ingrCopy.qty !== 0) {
                ingrCopy.qty = parseFloat(((targetServings / sourceServings) * ingrCopy.qty).toFixed(3));
            }
            return ingrCopy;
        }
        else {
            if (ingrCopy.qty) {
                ingrCopy.qty = 0;
            }
            return ingrCopy;
        }
    });


    if (ingredients && sourceServings && targetServings) {
        console.log(JSON.stringify(convertedIngredients));
        return (
            <Container>
                <CardDeck>
                    <RecipeCard
                        recipeName={recipeName}
                        recipeDescription={recipeDescription}
                        ingredients={ingredients}
                        servings={sourceServings}
                    />

                    <RecipeCard
                        recipeName={recipeName}
                        recipeDescription={recipeDescription}
                        ingredients={convertedIngredients}
                        servings={targetServings}
                    />
                </CardDeck>
            </Container>
        )
    }
    else {
        return (<React.Fragment><p>Recipe card</p></React.Fragment>);
    }
}

// Entire resizing page
class RecipeResizer extends Component {
    constructor(props) {
        super(props);

        // Init ingredients
        const initIngredients = [];
        for (let i = 1; i <= 5; i++) {
            initIngredients.push({ id: i, name: '', unit: '', qty: null });
        }

        this.state = {
            ingredients: initIngredients, // Array of ingredient name/id objects
            numIngredients: initIngredients.length,
            sourceServings: 0,
            targetServings: 0,
            recipeName: '',
            recipeDescription: '',
            formSubmitted: false,
        }

        this.addRow = this.addRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    // Adds row for ingredient input
    addRow() {
        this.setState(state => {
            const ingredients = this.state.ingredients.concat({
                id: this.state.numIngredients + 1,
                name: '',
                unit: '',
                qty: null
            });

            return {
                ingredients: ingredients,
                numIngredients: this.state.numIngredients + 1
            }
        });
    }

    // Removes row for ingredient input
    removeRow(rowId) {
        const ingredients = this.state.ingredients.filter(
            (ingredient) => (ingredient.id !== rowId));

        this.setState({
            ingredients: ingredients
        });
    }

    // Handles submit
    handleSubmit(event) {
        event.preventDefault();
        console.log(JSON.stringify(this.state.ingredients));

        this.setState({
            formSubmitted: true,
        });
    }

    // Handle input change
    handleInputChange(event, type = null, ingredientId = null) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        // Update state of servings
        if (['sourceServings', 'targetServings', 'recipeName', 'recipeDescription'].includes(name)) {
            this.setState({
                [name]: value
            })
        }
        // Update ingredient
        else if (type && ingredientId) {
            let ingredients = this.state.ingredients;
            let ingrIdx = ingredients.findIndex(ingr => ingr.id === ingredientId);

            // If found ingredient, change state based on type
            if (ingrIdx !== -1 && ['name', 'unit', 'qty'].includes(type)) {
                ingredients[ingrIdx][type] = value;

                this.setState({
                    ingredients: ingredients
                });
            }
        }
    }

    // Returns page with header, form, and results
    render() {
        return (
            <Container>
                <PageHeader
                    title="Recipe Resizer"
                    description="Rescale a recipe."
                />
                <ResizingForm
                    handleSubmit={this.handleSubmit}
                    handleInputChange={this.handleInputChange}
                    ingredients={this.state.ingredients}
                    removeRow={this.removeRow}
                    addRow={this.addRow}
                />
                {this.state.formSubmitted &&
                    <ConversionResults
                        recipeName={this.state.recipeName}
                        recipeDescription={this.state.recipeDescription}
                        ingredients={this.state.ingredients}
                        sourceServings={this.state.sourceServings}
                        targetServings={this.state.targetServings}
                    />
                }
            </Container>
        )
    }
}

export default RecipeResizer;
