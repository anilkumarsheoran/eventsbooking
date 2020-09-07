import React, { Component, useState, useContext, useEffect } from "react";
import './Events.css';
import Modal from '../components/Modal/Modal';
import AuthContext from '../context/auth-context';
import Backdrop from '../components/Backdrop/Backdrop';
import Spinner from "../components/Spinner/Spinner";

function EventsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [activeEvent, setActiveEvent] = useState({});
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [addingEvent, setAddingEvent] = useState(false);
    const [eventList, setEventList] = useState([]);
    const cancelBtnHandler = () =>{
        setAddingEvent(false);
    }
    const context = useContext(AuthContext);
    const showDetail = (event) => {
        setActiveEvent(event)
        setIsDetailVisible(true);
    }
    const getEventsFunction = () => {
        setIsLoading(true);
        let requestBody = {
            query:`
                query {
                    events{
                        _id
                        title
                        description
                        price
                        date
                        creator{
                            _id
                            email
                        }
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
            setEventList(resData.data.events);
            setIsLoading(false);
        }).catch(err => {
           console.log('error');
           setIsLoading(false);
        }) 
    }

    const bookEvent = (eventId) => {
       // e.preventDefault();
       console.log('fdfdfddf'+  eventId)
        setIsLoading(true);
        const  requestBody = {
            query:`
                mutation {
                    bookEvent(eventId: "${eventId}"){
                        _id
                        createdAt
                        UpdatedAt
                    }
                }
            `
        };

        fetch('http://localhost:8000/graphql',{
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization':  'Bearer ' + context.token

            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201){
                throw new Error('failed');
            }
            return res.json();
        })
        .then(resData =>{
            console.log(resData);
            // getEventsFunction();
            // setAddingEvent(false);

            setIsLoading(false);
        }).catch(err => {
            setIsLoading(false);
           console.log('error')
        })
    }

    useEffect(function(){
      getEventsFunction();
    },[])

    const formHandler = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const  requestBody = {
            query:`
                mutation {
                    createEvents(eventInput: {title: "${title}",price: ${price},date: "${date}",description: "${description}"}){
                        _id
                        title
                        price
                        description
                        date
                        creator{
                            _id
                            email
                        }
                    }
                }
            `
        };

        fetch('http://localhost:8000/graphql',{
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization':  'Bearer ' + context.token

            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201){
                throw new Error('failed');
            }
            return res.json();
        })
        .then(resData =>{
            console.log(resData);
            getEventsFunction();
            setAddingEvent(false);
            setIsLoading(false);
        }).catch(err => {
            setIsLoading(false);
           console.log('error')
        })
    }
    return ( <>
         {isLoading ? <Backdrop><Spinner /></Backdrop> : <div className="events-section">
            {context.token && 
                <div className="events-input">
                    <div>Add new event here</div>
                    <button className="events-inputs--btn" onClick={()=> setAddingEvent(true)}>Create Event</button>
                </div>
            }
            {addingEvent && 
                <Backdrop>
                    <Modal title="Add Events">
                        <form onSubmit={formHandler}>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="input" id="title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="input" id="price" value={price} onChange={(e)=>setPrice(e.target.value)}/>
                            </div>
                            <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="date" id="title" value={date} onChange={(e)=>setDate(e.target.value)}/>
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <input type="textarea" id="description" value={description} onChange={(e)=>setDescription(e.target.value)}/>
                            </div>
                            <div className="form-control">
                                <button type="submit">Confirm</button>
                            </div>
                            <div className="form-control">
                            <button onClick={()=>cancelBtnHandler()}>Cancel</button>
                            </div>
                        </form>
                    </Modal> 
                </Backdrop>
            }
            <ul className="events-list">
            {eventList && eventList.map((item, index)=>{
                return <li key={index}>
                    <span>{item.title}</span>
                    {/* <span>{item.description}</span> */}
                    <span>{item.price}</span>
                    {/* <span>{item.date}</span> */}
                    {/* <span>{item.creator.email}</span> */}
                    {context.userId == item.creator._id ? <span>Event create by you</span> : <button onClick={()=>showDetail(item)} className="event-item--book-btn" >Book</button>}
                </li>
            })}
        </ul>

        {isDetailVisible && activeEvent &&
                        <Backdrop>
                            <Modal title="Events Details">
                                <p>{activeEvent.title}</p>
                                <p>{activeEvent.description}</p>
                                <p>{activeEvent.price}</p>
                                <p>{activeEvent.date}</p>
                                <p>{activeEvent.creator.email}</p>
                                <div className="form-action">
                                    <button onClick={()=> setIsDetailVisible(false)}>Cancel</button>h
                                    <button onClick={()=> bookEvent(activeEvent._id)}>Book</button>
                                </div>
                            </Modal>
                        </Backdrop>
                    }
        </div>}
        </>
    )
}


export default EventsPage;