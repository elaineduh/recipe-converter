import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './Header.css';

// Navbar for top of page
const Header = () => {
    return (
        <Navbar bg="light" expand="md">
            <Navbar.Brand href="/home">Recipe Converter</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
                <Nav className="mr-auto">
                    <Nav.Link href="/home">Convert</Nav.Link>
                    <Nav.Link href="/resize">Resize</Nav.Link>
                    <Nav.Link href="/substitute">Substitute</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header;
