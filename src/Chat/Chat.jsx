import React, {useState, useEffect, useRef } from 'react';
import helloImg from './hello.png'
import css from './Chat.module.css'

const API = 'http://localhost:8080';

export const Chat = ({name}) => {
    const [message, setMessage] = useState();
    const [messages, setMessages] = useState([]);
    const eventSourceRef = useRef();
    const messagesRef = useRef();
    useEffect( ()=> {
        messagesRef?.current?.scrollTo(0,9000)
    }, [messages]);
    useEffect(() => {
        if (!window.EventSource) {
            alert('No EventSource');
            return;
        }

        function onNewMessage(event) {
            const newMessage = JSON.parse(event.data);
            setMessages(prevMessages => {
                setMessages([...prevMessages, newMessage])
            })
        }

        function onError() {
            setMessages(prevMessages => {
                setMessages([ ...prevMessages ,{
                    isbot: true,
                    message: 'connection error',
                    name: 'Чат'
                }])
            })
        }

        eventSourceRef.current = new EventSource(`${API}/event?name=${name}`);
        eventSourceRef.current?.addEventListener("message", onNewMessage, false);
        eventSourceRef.current?.addEventListener("error", onError, false);
        return (() => {
            eventSourceRef.current?.removeEventListener("message", onNewMessage);
            eventSourceRef.current?.removeEventListener("error", onError);
            eventSourceRef.current?.close()
        })
    }, [name])

    const handleKeyPress = event => {
        if ((event.which === 13 || event.keyCode === 13) && message) {
                const form_data = new FormData();
                form_data.append('message', message)
                form_data.append('name', name)
                fetch(`${API}/message`, {
                    method: 'post',
                    body: form_data
                }).finally(() => setMessage(''));
        }
        return true;
    };
    return (
        <div className={css.root}>
            <div className={css.messages} ref = {messagesRef}>
                {messages?.length ? messages.map(item => (<div><span className={css.name}>{item.name}:&nbsp;</span>{item.message}</div>)) :
                    <div className={css.hello}>
                        <img src={helloImg}/>
                        <div>Здравствуйте, {name}!<br/>
                            Подсказать что-нибудь?
                        </div>
                    </div>
                }
            </div>
            <div className={css.newMessage}>
                <input onKeyPress={handleKeyPress} value={message} onChange={e => setMessage(e.target.value)}
                       className={css.newMessageText}
                       placeholder='напишите сообщение и нажмите "enter"...'/>
            </div>
        </div>
    )
}
