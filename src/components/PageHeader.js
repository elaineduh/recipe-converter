import React from 'react';
import { Row } from 'react-bootstrap';

// Title and description of each page
const PageHeader = ({ title, description }) => {
    return (
        <React.Fragment>
            <Row>
                <h4>{title}</h4>
            </Row>
            <Row>
                <p>{description}</p>
            </Row>
        </React.Fragment>
    )
}

export default PageHeader;
