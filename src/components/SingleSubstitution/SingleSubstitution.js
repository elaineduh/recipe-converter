import React, { Component } from 'react';
import { Form, Alert, Button, Container, Row, Col, Card } from 'react-bootstrap';
import PageHeader from '../PageHeader';

// Form for substitution
const SubstitutionForm = ({ handleSubmit, handleInputChange }) => {
    return (
        <Form id="substitutionForm" onSubmit={handleSubmit}>
            <Form.Group as={Row}>
                <Form.Label htmlFor="ingredientName" column md={2}>Ingredient </Form.Label>
                <Col md={10}>
                    <Form.Control type="text" id="ingredientName" name="ingredientName"
                        placeholder="Flour"
                        onChange={handleInputChange}
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Col md={{ span: 10, offset: 0 }}>
                    <Button type="submit">
                        Find Substitutes
                        </Button>
                </Col>
            </Form.Group>
        </Form>
    );
}

// Returns card with substitutions
const SubstitutionCard = ({ substitutionList, ingredient }) => {
    const subList = substitutionList.map((sub, idx) =>
        <li key={idx}>{sub}</li>
    );

    return (
        <Card className="ml-2">
            <Card.Body>
                <h5>Found {substitutionList.length} substitutes for {ingredient}</h5>
                <ul className="list-unstyled">
                    {subList}
                </ul>
            </Card.Body>
        </Card>
    );
}

// Single substitution page
class SingleSubstitution extends Component {
    constructor(props) {
        super(props);

        // Initialize state
        this.state = {
            ingredientName: '',
            formSubmitted: false,
            isError: false,
            responseIngr: '',
            responseMsg: 'Error',
            responseSubs: []
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    // Handle submit
    handleSubmit = async event => {
        // Prevent from going to next page
        event.preventDefault();

        // Fetch from API and store results in state
        try {
            const response = await fetch(
                `https://api.spoonacular.com/food/ingredients/substitutes?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}`
                + "&ingredientName=" + this.state.ingredientName);
            const data = await response.json();
            console.log(JSON.stringify(data));
            console.log(data.message);

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
                    responseSubs: data.substitutes,
                    responseMsg: data.message,
                    responseIngr: this.state.ingredientName
                })
            }
        }
        // Handle errors
        catch (err) {
            this.setState({
                isError: true
            })
        }

        this.setState({
            formSubmitted: true
        });
    }

    // Handle input change
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        // Update state based on name and value
        this.setState({
            [name]: value
        });
    }

    // Renders alert for response
    renderResponse() {
        if (this.state.formSubmitted) {
            if (this.state.isError || !this.state.responseSubs || (this.state.responseSubs && this.state.responseSubs.length === 0)) {
                return (<Alert variant="danger" className="ml-2">{this.state.responseMsg}</Alert>);
            }
            else {
                return (
                    <SubstitutionCard
                        substitutionList={this.state.responseSubs}
                        ingredient={this.state.responseIngr}/>
                )
            }
        }
        return (<React.Fragment></React.Fragment>);
    }

    // Return page header, form, and response
    render() {
        return (
            <Container>
                <PageHeader
                    title="Ingredient Substitution"
                    description="Find substitutes for an ingredient."
                />
                <SubstitutionForm
                    handleSubmit={this.handleSubmit}
                    handleInputChange={this.handleInputChange}
                />
                <Row>
                    {this.state.formSubmitted && this.renderResponse()}
                </Row>
            </Container>
        )
    }
}

export default SingleSubstitution;