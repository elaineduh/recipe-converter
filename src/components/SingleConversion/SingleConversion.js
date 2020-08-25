import React, { Component } from 'react';
import { Form, Alert, Button, Container, Row, Col } from 'react-bootstrap';
import { UNITS } from '../sharedInfo';
import PageHeader from '../PageHeader';
import './SingleConversion.css';

// Form component
const ConversionForm = ({ handleSubmit, ingredient, handleInputChange, sourceAmount }) => {
    // Returns options for units
    const unitOptions = UNITS.map((unit) => {
        return (
            <option key={unit} value={unit}>{unit}</option>
        );
    });

    // Form for converting
    return (
        <Form id="conversionForm" onSubmit={handleSubmit}>
            <Form.Group as={Row}>
                <Form.Label htmlFor="ingredient" column md={2}>Ingredient </Form.Label>
                <Col md={10}>
                    <Form.Control type="text" id="ingredient" name="ingredient"
                        placeholder="Flour"
                        value={ingredient}
                        onChange={handleInputChange}
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label htmlFor="sourceAmount" column md={2}>Amount </Form.Label>
                <Col md={10}>
                    <Form.Control type="number" id="sourceAmount" name="sourceAmount"
                        placeholder="2.5" step=".01"
                        value={sourceAmount}
                        onChange={handleInputChange}
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label htmlFor="sourceUnit" column md={2}>Convert from</Form.Label>
                <Col md={10}>
                    <Form.Control as="select" id="sourceUnit" name="sourceUnit"
                        onChange={handleInputChange}
                    >
                        {unitOptions}
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label htmlFor="targetUnit" column md={2}>Convert to</Form.Label>
                <Col md={10}>
                    <Form.Control as="select" id="targetUnit" name="targetUnit"
                        onChange={handleInputChange}
                    >
                        {unitOptions}
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Col md={{ span: 10, offset: 0 }}>
                    <Button type="submit">
                        Convert
                            </Button>
                </Col>
            </Form.Group>
        </Form>
    );
}

// Page for single conversion
class SingleConversion extends Component {
    constructor(props) {
        super(props);

        // Initialize state
        this.state = {
            values: {
                ingredient: '',
                sourceAmount: 0,
                sourceUnit: '',
                targetUnit: ''
            },
            targetAmount: 0,
            targetAnswer: '',
            formSubmitted: false,
            isError: false,
            showConversion: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    // Handle submit
    handleSubmit = async event => {
        // Prevent from going to next page
        event.preventDefault();
        this.setState({
            formSubmitted: true
        });

        // Fetch from API and store results in state
        try {
            const response = await fetch(
                `https://api.spoonacular.com/recipes/convert?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}`
                + "&ingredientName=" + this.state.values.ingredient
                + "&sourceAmount=" + this.state.values.sourceAmount
                + "&sourceUnit=" + this.state.values.sourceUnit
                + "&targetUnit=" + this.state.values.targetUnit);
            const data = await response.json();

            // Response not OK
            if (response.status !== 200) {
                this.setState({
                    isError: true,
                    targetAnswer: data.message
                })
            }
            // Response OK
            else {
                this.setState({
                    isError: false,
                    targetAmount: data.targetAmount,
                    targetAnswer: data.answer
                })
            }
        }
        // Handle errors
        catch (err) {
            this.setState({
                isError: true
            })
        }
    }

    // Handle input change
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        // Update state based on name and value
        this.setState({
            values: {
                ...this.state.values,
                [name]: value
            }
        });
    }

    // Renders alert for response
    renderResponse() {
        if (this.state.formSubmitted) {
            let color = this.state.isError ? "danger" : "info";
            return (
                <Alert variant={color}>{this.state.targetAnswer}</Alert>
            );
        }
        return (
            <React.Fragment></React.Fragment>
        );
    }

    // Renders page with header, conversion form, and conversion results
    render() {
        return (
            <Container>
                <PageHeader
                    title="Ingredient Conversion"
                    description="Convert one ingredient from one unit to another."
                />
                <Row>
                    <ConversionForm
                        handleSubmit={this.handleSubmit}
                        ingredient={this.state.ingredient}
                        handleInputChange={this.handleInputChange}
                        sourceAmount={this.state.sourceAmount}
                    />
                </Row>
                <Row>
                    {this.state.formSubmitted && this.renderResponse()}
                </Row>
            </Container>
        )
    }
}

export default SingleConversion;