import React, { Component, useEffect, useState} from "react";

function BookingsPage() {
    const [bookings, setBookings] = useState('');
    const getBookingFunction = () => {
       // setIsLoading(true);
        let requestBody = {
            query:`
                query {
                    bookings{
                        _id
                        event{
                            title
                            price
                        }
                        user{
                            _id
                            email
                        }
                        createdAt
                        UpdatedAt
                    }

                }
            `
        }
        
        fetch('http://localhost:8000/graphql',{
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201){
                throw new Error('failed');
            }
            return res.json();
        })
        .then(resData =>{
            console.log(resData);
            setBookings(resData.data.bookings);
           // setEventList(resData.data.events);
            //setIsLoading(false);
        }).catch(err => {
           console.log('error');
           //setIsLoading(false);
        }) 
    }
    useEffect(getBookingFunction,[]);

    return (
        <div>{console.log('inside the auth')}
            <h1>The Booking Page</h1>
            {bookings && bookings.map((item, index) =>{
                return (
                    <div>
                        <span>{item.event.title}</span>
                        <span>{item.user.email}</span>
                        <span>{item.event.price}</span>
                        <span>{item.createdAt}</span>
                    </div>
                )
            })}
        </div>
    )
}


export default BookingsPage;