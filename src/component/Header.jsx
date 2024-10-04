

import React, { useState, useEffect, useRef } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { products } from "../product_data";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems } from "../redux/features/addTocartSlice";
import logo from '../assets/img/logo.png';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const searchInputRef = useRef(null);
    const location = useLocation();
    const searchContainerRef = useRef(null);
    const cartItem = useSelector((state) => state.addToCart.cartItems);


    const items = products.flatMap((cat) =>
        cat.productData.map((item) => ({
            id: item.productId,
            name: item.productName,
            price: item.price,
            categoryName: cat.categoryName,
            categoryId: cat.categoryId,
            productCode: item.productCode,
        }))
    );

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term.trim() !== '') {
            const filtered = items.filter(item =>
                item.name.toLowerCase().includes(term.toLowerCase()) ||
                item.productCode.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredItems(filtered);
            setFocusedIndex(0);
        } else {
            setFilteredItems([]);
        }
    };

    const handleInputFocus = () => {
        if (searchTerm.trim() === '') {
            setFilteredItems(items);
        }
    };

    const handleSelectItem = (item) => {
        const addItem = {
            categoryId: item.categoryId,
            categoryName: item.categoryName,
            productId: item.id,
            productName: item.name,
            price: item.price,
            productCode: item.productCode,
        };

        dispatch(setCartItems(addItem));
        // Reset search term and filtered items, and focus on the search input
        setSearchTerm('');
        setFilteredItems([]);
        setFocusedIndex(0);
        searchInputRef.current?.focus();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            setFocusedIndex((prevIndex) => {
                const newIndex = prevIndex < filteredItems.length - 1 ? prevIndex + 1 : prevIndex;
                scrollToFocusedItem(newIndex);
                return newIndex;
            });
        } else if (event.key === 'ArrowUp') {
            setFocusedIndex((prevIndex) => {
                const newIndex = prevIndex > 0 ? prevIndex - 1 : 0;
                scrollToFocusedItem(newIndex);
                return newIndex;
            });
        } else if (event.key === 'Enter' || event.key === 'Tab') {
            if (filteredItems?.length > 0) {
                event.preventDefault();
                handleSelectItem(filteredItems[focusedIndex]);
            }
        }
    };

    const scrollToFocusedItem = (index) => {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            const focusedItem = searchResults.children[index];
            if (focusedItem) {
                searchResults.scrollTop = focusedItem.offsetTop - searchResults.offsetTop; // Scroll to the focused item
            }
        }
    };

    const handleMouseEnter = (index) => {
        setFocusedIndex(index); // Set focused index to the index of the hovered item
    };

    const handleMouseClick = (item) => {
        handleSelectItem(item); // Select the item when clicked
    };

    const handleFocusShortcut = (event) => {
        if (event.shiftKey && event.key.toLowerCase() === 'p') {
            event.preventDefault();
            searchInputRef.current?.focus();
        }
    };

    // Hide results when clicking outside
    const handleClickOutside = (event) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
            setFilteredItems([]); // Clear filtered items if clicking outside
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleFocusShortcut);
        window.addEventListener('click', handleClickOutside); // Add click event listener

        return () => {
            window.removeEventListener('keydown', handleFocusShortcut);
            window.removeEventListener('click', handleClickOutside); // Cleanup event listener
        };
    }, []);


    useEffect(() => {
        const intervalId = setInterval(() => {
            if (cartItem?.length === 0 && searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, 1000);
        // Stop the interval when cartItem length is 1
        if (cartItem?.length >= 1) {
            clearInterval(intervalId);
            setTimeout(() => {
            }, 0); // Adjust timeout as necessary
        }

        return () => clearInterval(intervalId);
    }, [cartItem]); // Dependency array includes cartItem



    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    return (
        <header className='border-bottom pt-'>
            <Container fluid>
                <Row>
                    <Col sm={2}>
                        <img src={logo} alt="" className='img-fluid' style={{ width: "120px" }} />
                    </Col>
                    <Col sm={6}>


                    {location.pathname !== '/reports' && (
                                  <div className='mt-1' ref={searchContainerRef}>
                                  <div className='border-0'>
                                      <input
                                          id="searchProduct"
                                          type="text"
                                          value={searchTerm}
                                          onChange={handleSearchChange}
                                          onKeyDown={handleKeyDown}
                                          onFocus={handleInputFocus}
                                          placeholder="Search Product (Shift + P)"
                                          className="form-control"
                                          ref={searchInputRef}
                                      />
                                      {filteredItems?.length > 0 && (
                                          <div className="search-results border bg-white p-2">
                                              {filteredItems?.map((item, index) => (
                                                  <div
                                                      key={item.id}
                                                      onClick={() => handleMouseClick(item)} // Select the item on click
                                                      onMouseEnter={() => handleMouseEnter(index)} // Highlight on mouse enter
                                                      className={`search-item p-1 border-bottom ${index === focusedIndex ? 'focused' : ''}`}
                                                      style={{
                                                          cursor: 'pointer',
                                                          backgroundColor: index === focusedIndex ? '#fffce1' : 'transparent'
                                                      }}
                                                  >
                                                      {item.productCode} - {item.name}
                                                  </div>
                                              ))}
                                          </div>
                                      )}
                                  </div>
                              </div>
                        )}


                  
                    </Col>
                    <Col sm={4} className='mt-1 text-end'>
                        {location.pathname !== '/' && (
                            <a href="/">
                                <button className='btn bg-dark text-white btn-sm'>Back To POS</button>
                            </a>
                        )} &nbsp;
                        {location.pathname !== '/reports' && (
                            <Link to="/reports">
                                <button className='btn bg-dark text-white btn-sm mr-2'>Go To Reports</button>
                            </Link>
                        )}
                    </Col>
                </Row>
            </Container>
        </header>
    );
};

export default Header;
